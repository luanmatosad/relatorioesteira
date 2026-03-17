import { Card, List, Space, Tag, Typography } from "antd";
import { ReportSummary } from "@/features/executive-report/types/report.types";

type CategoryBreakdownProps = {
  summary: ReportSummary;
};

export function CategoryBreakdown({ summary }: CategoryBreakdownProps) {
  return (
    <Card title="Top categorias">
      <List
        dataSource={summary.categoryBreakdown.slice(0, 6)}
        renderItem={(item) => (
          <List.Item>
            <Space style={{ justifyContent: "space-between", width: "100%" }}>
              <Space>
                <Tag
                  bordered={false}
                  style={{ margin: 0, background: "#e4e4e7", color: "#27272a" }}
                >
                  {item.category}
                </Tag>
              </Space>
              <Typography.Text strong>{item.count}</Typography.Text>
            </Space>
          </List.Item>
        )}
      />
    </Card>
  );
}
