import { Tag } from "antd";
import { IdeaStatus } from "@/features/feature-requests/types/feature-requests.types";

const statusConfig: Record<IdeaStatus, { color: string; label: string }> = {
  new: { color: "blue", label: "Nova" },
  under_review: { color: "gold", label: "Em análise" },
  planned: { color: "cyan", label: "Planejada" },
  in_progress: { color: "processing", label: "Em desenvolvimento" },
  released: { color: "success", label: "Entregue" },
  not_prioritized: { color: "default", label: "Não priorizada" },
};

export function IdeaStatusTag({ status }: { status: IdeaStatus }) {
  const config = statusConfig[status];
  return <Tag color={config.color}>{config.label}</Tag>;
}
