import Papa from "papaparse";
import { google } from "googleapis";
import { rawSheetRowSchema } from "@/features/executive-report/schemas/report.schema";
import { reportDemoData } from "@/features/executive-report/lib/report-demo-data";
import { RawSheetRow } from "@/features/executive-report/types/report.types";

const spreadsheetId =
  process.env.GOOGLE_SHEETS_SPREADSHEET_ID ??
  "1M2cdxfyhuMrv3M97OKfhGHcd0MSQb2eo3SjejzDgSKA";
const defaultRange = process.env.GOOGLE_SHEETS_RANGE ?? "A:H";
const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME;
const gid = process.env.GOOGLE_SHEETS_GID ?? "0";

export async function getSheetRows() {
  try {
    const rows = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY
      ? await getRowsFromGoogleApi()
      : await getRowsFromPublicSheet();

    if (!rows.length) {
      return {
        lastSyncAt: new Date().toISOString(),
        source: "demo" as const,
        connected: false,
        message:
          "Nenhuma linha valida foi lida da planilha. O portal exibiu dados de demonstracao.",
        rows: reportDemoData,
      };
    }

    return {
      lastSyncAt: new Date().toISOString(),
      source: process.env.GOOGLE_CLIENT_EMAIL ? ("google-api" as const) : ("public-sheet" as const),
      connected: true,
      message:
        process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY
          ? "Conectado via Google Sheets API."
          : "Conectado via exportacao publica da planilha.",
      rows,
    };
  } catch (error) {
    console.error("sheet_read_failed", error);

    return {
      lastSyncAt: new Date().toISOString(),
      source: "demo" as const,
      connected: false,
      message: getConnectionErrorMessage(error),
      rows: reportDemoData,
    };
  }
}

async function getRowsFromGoogleApi() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ auth, version: "v4" });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: getSheetRange(),
  });

  const values = response.data.values ?? [];

  return rowsToObjects(values);
}

async function getRowsFromPublicSheet() {
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
  const response = await fetch(url, {
    next: { revalidate: 180 },
  });

  if (!response.ok) {
    throw new Error(`public_sheet_request_failed:${response.status}`);
  }

  const csv = await response.text();

  if (looksLikeHtml(csv)) {
    throw new Error("public_sheet_requires_auth");
  }

  const parsed = Papa.parse<Record<string, string>>(csv, {
    header: true,
    skipEmptyLines: true,
  });

  return (parsed.data ?? [])
    .map((row) => rawSheetRowSchema.safeParse(row))
    .filter((row) => row.success)
    .map((row) => row.data as RawSheetRow);
}

function getSheetRange() {
  if (sheetName) {
    return `${sheetName}!${defaultRange}`;
  }

  return defaultRange;
}

function rowsToObjects(values: string[][]) {
  if (!values.length) {
    return [];
  }

  const [headers, ...dataRows] = values;

  return dataRows
    .map((row) =>
      headers.reduce<Record<string, string>>((acc, header, index) => {
        acc[header] = row[index] ?? "";
        return acc;
      }, {}),
    )
    .map((row) => rawSheetRowSchema.safeParse(row))
    .filter((row) => row.success)
    .map((row) => row.data as RawSheetRow);
}

function looksLikeHtml(value: string) {
  return value.trimStart().startsWith("<!DOCTYPE html>");
}

function getConnectionErrorMessage(error: unknown) {
  if (error instanceof Error && error.message === "public_sheet_requires_auth") {
    return "A planilha nao esta publicada para acesso anonimo. Configure uma service account do Google ou torne a exportacao CSV publica.";
  }

  if (error instanceof Error && error.message.startsWith("public_sheet_request_failed")) {
    return "A exportacao publica da planilha falhou. Revise as permissoes e o identificador da planilha.";
  }

  return "Nao foi possivel conectar na planilha real. O portal exibiu dados de demonstracao.";
}
