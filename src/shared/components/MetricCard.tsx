import { Card, Space, Statistic, Tag, Typography } from "antd";

type MetricCardProps = {
  title: string;
  value: number;
  accent?: string;
  hint?: string;
};

export function MetricCard({ accent, hint, title, value }: MetricCardProps) {
  return (
    <Card className="metric-card">
      <Space direction="vertical" size={10} style={{ width: "100%" }}>
        <Space style={{ justifyContent: "space-between", width: "100%" }}>
          <Typography.Text type="secondary">{title}</Typography.Text>
          {accent ? (
            <Tag
              bordered={false}
              style={{
                margin: 0,
                background: "#e4e4e7",
                color: "#27272a",
              }}
            >
              Ao vivo
            </Tag>
          ) : null}
        </Space>
        <Statistic value={value} />
        {hint ? <Typography.Text type="secondary">{hint}</Typography.Text> : null}
      </Space>
    </Card>
  );
}
