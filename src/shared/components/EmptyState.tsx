import { Empty, Typography } from "antd";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ description, title }: EmptyStateProps) {
  return (
    <div className="feedback-card">
      <Empty description={false} />
      <Typography.Title level={4} style={{ marginBottom: 8 }}>
        {title}
      </Typography.Title>
      <Typography.Paragraph style={{ marginBottom: 0 }}>
        {description}
      </Typography.Paragraph>
    </div>
  );
}
