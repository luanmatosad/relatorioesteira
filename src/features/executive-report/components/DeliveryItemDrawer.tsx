"use client";

import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { Descriptions, Divider, Drawer, Space, Tag, Typography } from "antd";
import { DeliveryItem } from "@/features/executive-report/types/report.types";
import { StatusTag } from "@/shared/components/StatusTag";

dayjs.locale("pt-br");

type DeliveryItemDrawerProps = {
  item: DeliveryItem | null;
  open: boolean;
  onClose: () => void;
};

export function DeliveryItemDrawer({
  item,
  open,
  onClose,
}: DeliveryItemDrawerProps) {
  return (
    <Drawer
      title={item ? `Detalhe ${item.key}` : "Detalhe do item"}
      open={open}
      onClose={onClose}
      width={560}
      destroyOnHidden
    >
      {item ? (
        <Space direction="vertical" size={20} style={{ width: "100%" }}>
          <div>
            <Typography.Text type="secondary">Resumo</Typography.Text>
            <Typography.Title level={4} style={{ marginTop: 6, marginBottom: 0 }}>
              {item.summary}
            </Typography.Title>
          </div>

          <Space size={[8, 8]} wrap>
            <StatusTag status={item.groupedStatus} />
            <Tag bordered={false}>{item.originalStatus}</Tag>
            <Tag bordered={false}>{item.itemType}</Tag>
            {item.categories.map((category) => (
              <Tag key={category} color="cyan">
                {category}
              </Tag>
            ))}
          </Space>

          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Responsavel">
              {item.owner ?? "Não atribuído"}
            </Descriptions.Item>
            <Descriptions.Item label="Criado em">
              {formatDate(item.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Última atualização">
              {formatDate(item.updatedAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Data limite">
              {formatDate(item.dueAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Aging">
              {item.agingDays !== null ? `${item.agingDays} dias` : "Não informado"}
            </Descriptions.Item>
          </Descriptions>

          <Divider style={{ marginBlock: 0 }} />

          <div>
            <Typography.Title level={5}>Leitura executiva</Typography.Title>
            <Typography.Paragraph>
              {buildExecutiveNarrative(item)}
            </Typography.Paragraph>
          </div>
        </Space>
      ) : null}
    </Drawer>
  );
}

function formatDate(value: string | null) {
  return value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "Não informado";
}

function buildExecutiveNarrative(item: DeliveryItem) {
  const owner = item.owner ?? "time responsável";
  const category = item.categories.join(", ");

  switch (item.groupedStatus) {
    case "production":
      return `O item ${item.key} já foi entregue em produção e segue rastreado na categoria ${category}. O owner atual é ${owner}.`;
    case "ready_for_release":
      return `O item ${item.key} já está concluído tecnicamente e aguarda publicação. O acompanhamento agora deve priorizar janela de subida e comunicação de entrega.`;
    case "in_progress":
      return `O item ${item.key} está em execução. O foco de acompanhamento deve permanecer em progresso, revisão e possíveis bloqueios de curto prazo junto a ${owner}.`;
    case "not_started":
      return `O item ${item.key} ainda não foi iniciado. Vale acompanhar prioridade, previsão e dependência para evitar envelhecimento excessivo na esteira.`;
    default:
      return `O item ${item.key} possui um status ainda não mapeado. Recomenda-se revisar a taxonomia operacional da planilha para manter a leitura executiva confiável.`;
  }
}
