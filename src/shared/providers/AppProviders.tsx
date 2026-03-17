"use client";

import { PropsWithChildren, useState } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App as AntApp, ConfigProvider, theme } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: true,
            staleTime: 1000 * 60 * 3,
          },
        },
      }),
  );

  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
        }}
      >
        <AntApp>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </AntApp>
      </ConfigProvider>
    </AntdRegistry>
  );
}
