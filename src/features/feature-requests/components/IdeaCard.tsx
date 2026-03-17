"use client";

import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button, Card, Flex, Space, Tag, Typography } from "antd";
import { FeatureIdea } from "@/features/feature-requests/types/feature-requests.types";
import { IdeaStatusTag } from "@/features/feature-requests/components/IdeaStatusTag";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

type IdeaCardProps = {
  idea: FeatureIdea;
  onVote: (ideaId: string) => void;
  voting?: boolean;
};

export function IdeaCard({ idea, onVote, voting }: IdeaCardProps) {
  return (
    <Card>
      <Space direction="vertical" size={14} style={{ width: "100%" }}>
        <Flex justify="space-between" align="start" gap={12}>
          <Space direction="vertical" size={6} style={{ flex: 1 }}>
            <Link href={`/sugestoes/${idea.id}`}>
              <Typography.Title level={4} style={{ margin: 0 }}>
                {idea.title}
              </Typography.Title>
            </Link>
            <Typography.Paragraph style={{ marginBottom: 0 }}>
              {idea.summary}
            </Typography.Paragraph>
          </Space>
          <IdeaStatusTag status={idea.status} />
        </Flex>

        <Space size={[8, 8]} wrap>
          <Tag bordered={false}>{idea.category}</Tag>
          <Tag bordered={false}>{idea.votes} votos</Tag>
          <Tag bordered={false}>{idea.comments.length} comentários</Tag>
          <Tag bordered={false}>Atualizada {dayjs(idea.updatedAt).fromNow()}</Tag>
        </Space>

        <Flex justify="space-between" align="center" gap={12}>
          <Typography.Text type="secondary">
            Sugerida por {idea.author}
          </Typography.Text>
          <Space>
            <Button href={`/sugestoes/${idea.id}`} type="default">
              Ver detalhe
            </Button>
            <Button loading={voting} onClick={() => onVote(idea.id)} type="primary">
              Votar
            </Button>
          </Space>
        </Flex>
      </Space>
    </Card>
  );
}
