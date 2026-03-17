import { Alert } from "antd";
import { ReportSummary } from "@/features/executive-report/types/report.types";

type DataSourceAlertProps = {
  dataSource: ReportSummary["dataSource"];
};

export function DataSourceAlert({ dataSource }: DataSourceAlertProps) {
  if (dataSource.connected) {
    return (
      <Alert
        message="Fonte conectada"
        description={dataSource.message}
        showIcon
        type="success"
      />
    );
  }

  return (
    <Alert
      message="Fonte real ainda nao conectada"
      description={dataSource.message}
      showIcon
      type="warning"
    />
  );
}
