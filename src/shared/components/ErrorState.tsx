import { Alert, Button, Space, Typography } from "antd";

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="feedback-card">
      <Space direction="vertical" size={16}>
        <Alert
          message="Não foi possível carregar o relatório"
          description={message}
          type="error"
          showIcon
        />
        {onRetry ? (
          <Button onClick={onRetry} type="primary">
            Tentar novamente
          </Button>
        ) : null}
        <Typography.Text type="secondary">
          Se o problema persistir, valide as credenciais da planilha e tente de novo.
        </Typography.Text>
      </Space>
    </div>
  );
}
