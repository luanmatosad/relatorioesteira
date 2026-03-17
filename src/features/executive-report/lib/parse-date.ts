export function parseDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  const brDateTimeMatch = normalized.match(
    /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/,
  );

  if (brDateTimeMatch) {
    const [, day, month, year, hour = "00", minute = "00", second = "00"] =
      brDateTimeMatch;
    const parsed = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    );

    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  const parsed = new Date(normalized);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}
