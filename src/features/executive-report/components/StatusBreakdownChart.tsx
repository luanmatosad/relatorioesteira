import { Card, Flex, Progress, Space, Typography } from "antd";
import { ReportSummary } from "@/features/executive-report/types/report.types";
import { StatusTag } from "@/shared/components/StatusTag";

type StatusBreakdownChartProps = {
  summary: ReportSummary;
};

export function StatusBreakdownChart({ summary }: StatusBreakdownChartProps) {
  return (
    <Card title="Distribuicao da esteira">
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {summary.groupedStatusBreakdown.map((item) => {
          const percent = summary.totalItems
            ? Math.round((item.count / summary.totalItems) * 100)
            : 0;

          return (
            <div key={item.status}>
              <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
                <Space>
                  <StatusTag status={item.status} />
                  <Typography.Text>{item.count} itens</Typography.Text>
                </Space>
                <Typography.Text type="secondary">{percent}%</Typography.Text>
              </Flex>
              <Progress percent={percent} showInfo={false} strokeColor="#14532d" />
            </div>
          );
        })}
      </Space>
    </Card>
  );
}
