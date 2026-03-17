"use client";

import Link from "next/link";
import { Layout, Menu, Space, Tag, Typography } from "antd";

const { Content, Sider } = Layout;

const navigationItems = [
  { key: "/relatorio-executivo", label: <Link href="/relatorio-executivo">Relatório Executivo</Link> },
  { key: "/esteira", label: <Link href="/esteira">Esteira Detalhada</Link> },
  { key: "/sugestoes", label: <Link href="/sugestoes">Sugestões</Link> },
];

type PortalShellProps = {
  children: React.ReactNode;
  currentPath: string;
};

export function PortalShell({ children, currentPath }: PortalShellProps) {
  return (
    <Layout style={{ minHeight: "100vh", background: "transparent" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          background: "#001529",
        }}
        width={280}
      >
        <div style={{ padding: 24 }}>
          <Space direction="vertical" size={10}>
            <Tag
              bordered={false}
              style={{
                width: "fit-content",
                paddingInline: 10,
                marginInlineEnd: 0,
                background: "rgba(255,255,255,0.18)",
                color: "#ffffff",
              }}
            >
              Portal B2B
            </Tag>
            <Typography.Title
              level={3}
              style={{ color: "#fafafa", margin: 0, lineHeight: 1.1 }}
            >
              Relatórios da Esteira
            </Typography.Title>
            <Typography.Paragraph style={{ color: "#d4d4d8", margin: 0 }}>
              Transparência operacional com leitura executiva.
            </Typography.Paragraph>
          </Space>
        </div>
        <Menu
          items={navigationItems}
          mode="inline"
          selectedKeys={[currentPath]}
          style={{
            background: "transparent",
            color: "#f8fafc",
            borderInlineEnd: 0,
          }}
          theme="dark"
        />
      </Sider>
      <Layout>
        <Content style={{ padding: 24 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
