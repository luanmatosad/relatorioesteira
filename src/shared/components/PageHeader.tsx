import { Button, Space, Tag, Typography } from "antd";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  extraActions?: React.ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
};

export function PageHeader({
  eyebrow,
  extraActions,
  onRefresh,
  refreshing,
  subtitle,
  title,
}: PageHeaderProps) {
  return (
    <div className="page-header">
      <Space direction="vertical" size={8}>
        {eyebrow ? (
          <Tag
            bordered={false}
            style={{
              width: "fit-content",
              margin: 0,
              background: "#e4e4e7",
              color: "#27272a",
            }}
          >
            {eyebrow}
          </Tag>
        ) : null}
        <Typography.Title level={1} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
        <Typography.Paragraph style={{ margin: 0, maxWidth: 720 }}>
          {subtitle}
        </Typography.Paragraph>
      </Space>
      <Space>
        {extraActions}
        <Button onClick={onRefresh} loading={refreshing} type="primary">
          Atualizar agora
        </Button>
      </Space>
    </div>
  );
}
