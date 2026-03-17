"use client";

import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
import { Space, Tag, Typography } from "antd";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

type LastSyncBadgeProps = {
  value: string;
};

export function LastSyncBadge({ value }: LastSyncBadgeProps) {
  return (
    <Space size={8}>
      <Tag color="success" bordered={false} style={{ margin: 0 }}>
        Sincronizado
      </Tag>
      <Typography.Text type="secondary">
        Ultima leitura {dayjs(value).fromNow()}
      </Typography.Text>
    </Space>
  );
}
