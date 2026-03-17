import { Col, Row } from "antd";
import { ReportSummary } from "@/features/executive-report/types/report.types";
import { MetricCard } from "@/shared/components/MetricCard";

type ExecutiveSummaryCardsProps = {
  summary: ReportSummary;
};

export function ExecutiveSummaryCards({ summary }: ExecutiveSummaryCardsProps) {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12} xl={6}>
        <MetricCard
          title="Itens em produção"
          value={summary.totalProduction}
          accent="green"
          hint="Entrega já refletida no ambiente produtivo."
        />
      </Col>
      <Col xs={24} md={12} xl={6}>
        <MetricCard
          title="Itens em execução"
          value={summary.totalInProgress}
          accent="blue"
          hint="Itens em andamento ou aguardando revisão."
        />
      </Col>
      <Col xs={24} md={12} xl={6}>
        <MetricCard
          title="Prontos para publicar"
          value={summary.totalReadyForRelease}
          accent="gold"
          hint="Itens concluídos ou aguardando subida."
        />
      </Col>
      <Col xs={24} md={12} xl={6}>
        <MetricCard
          title="Sem atualização recente"
          value={summary.staleItems}
          hint="Itens sem movimento há mais de 7 dias fora de produção."
        />
      </Col>
    </Row>
  );
}
