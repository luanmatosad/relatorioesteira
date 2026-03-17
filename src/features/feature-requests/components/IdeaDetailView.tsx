"use client";

import { App, Button, Card, Divider, Form, Input, Space, Tag, Timeline, Typography } from "antd";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
import { FeatureIdea } from "@/features/feature-requests/types/feature-requests.types";
import { IdeaStatusTag } from "@/features/feature-requests/components/IdeaStatusTag";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

export function IdeaDetailView({ idea }: { idea: FeatureIdea }) {
  const { message } = App.useApp();
  const router = useRouter();

  async function vote() {
    const response = await fetch(`/api/ideas/${idea.id}/vote`, { method: "POST" });

    if (!response.ok) {
      message.error("Não foi possível registrar o voto.");
      return;
    }

    message.success("Voto registrado.");
    router.refresh();
  }

  async function submitComment(values: { author: string; message: string }) {
    const response = await fetch(`/api/ideas/${idea.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      message.error("Não foi possível publicar o comentário.");
      return;
    }

    message.success("Comentário publicado.");
    router.refresh();
  }

  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <Card>
        <Space direction="vertical" size={18} style={{ width: "100%" }}>
          <Space size={[8, 8]} wrap>
            <IdeaStatusTag status={idea.status} />
            <Tag bordered={false}>{idea.category}</Tag>
            <Tag bordered={false}>{idea.votes} votos</Tag>
            <Tag bordered={false}>{idea.watchers} acompanhando</Tag>
          </Space>

          <div>
            <Typography.Title level={2} style={{ marginBottom: 8 }}>
              {idea.title}
            </Typography.Title>
            <Typography.Paragraph style={{ marginBottom: 0 }}>
              {idea.summary}
            </Typography.Paragraph>
          </div>

          <Space>
            <Button href="/sugestoes" type="default">
              Voltar
            </Button>
            <Button onClick={vote} type="primary">
              Votar nesta ideia
            </Button>
          </Space>
        </Space>
      </Card>

      <Card title="Contexto">
        <Space direction="vertical" size={16}>
          <div>
            <Typography.Text strong>Problema</Typography.Text>
            <Typography.Paragraph>{idea.problem}</Typography.Paragraph>
          </div>
          <div>
            <Typography.Text strong>Impacto no negócio</Typography.Text>
            <Typography.Paragraph>{idea.businessImpact}</Typography.Paragraph>
          </div>
          <div>
            <Typography.Text strong>Solucao sugerida</Typography.Text>
            <Typography.Paragraph>{idea.proposedSolution}</Typography.Paragraph>
          </div>
        </Space>
      </Card>

      <Card title="Historico da ideia">
        <Timeline
          items={[
            {
              children: `Criada por ${idea.author} em ${dayjs(idea.createdAt).format("DD/MM/YYYY HH:mm")}`,
            },
            {
              children: `Última atualização ${dayjs(idea.updatedAt).fromNow()}`,
            },
            ...idea.comments.map((comment) => ({
              children: `${comment.author}: ${comment.message} (${dayjs(comment.createdAt).fromNow()})`,
            })),
          ]}
        />
      </Card>

      <Card title="Adicionar comentário">
        <Form layout="vertical" onFinish={submitComment}>
          <Form.Item
            label="Seu nome"
            name="author"
            rules={[{ required: true, message: "Informe seu nome." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Comentario"
            name="message"
            rules={[{ required: true, message: "Escreva um comentário." }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Divider style={{ marginTop: 0 }} />
          <Button htmlType="submit" type="primary">
            Publicar comentário
          </Button>
        </Form>
      </Card>
    </Space>
  );
}
