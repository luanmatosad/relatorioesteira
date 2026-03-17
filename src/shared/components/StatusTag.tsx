import { Tag } from "antd";
import { DeliveryStatusGroup } from "@/features/executive-report/types/report.types";

const statusConfig: Record<
  DeliveryStatusGroup,
  { color: string; label: string }
> = {
  in_progress: { color: "processing", label: "Em execução" },
  not_started: { color: "default", label: "Não iniciado" },
  production: { color: "success", label: "Em produção" },
  ready_for_release: { color: "warning", label: "Pronto para publicar" },
  unknown: { color: "magenta", label: "Não mapeado" },
};

type StatusTagProps = {
  status: DeliveryStatusGroup;
};

export function StatusTag({ status }: StatusTagProps) {
  const config = statusConfig[status];

  return (
    <Tag color={config.color} style={{ marginInlineEnd: 0 }}>
      {config.label}
    </Tag>
  );
}
