"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Form, Input, Modal } from "antd";
import { createIdeaSchema, CreateIdeaInput } from "@/features/feature-requests/schemas/feature-requests.schema";

type NewIdeaModalProps = {
  open: boolean;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: CreateIdeaInput) => void;
};

export function NewIdeaModal({
  onClose,
  onSubmit,
  open,
  submitting,
}: NewIdeaModalProps) {
  const { control, handleSubmit, reset } = useForm<CreateIdeaInput>({
    resolver: zodResolver(createIdeaSchema),
    defaultValues: {
      author: "",
      businessImpact: "",
      category: "",
      problem: "",
      proposedSolution: "",
      summary: "",
      title: "",
    },
  });

  const submit = handleSubmit((values) => {
    onSubmit(values);
    reset();
  });

  return (
    <Modal
      open={open}
      title="Nova sugestão"
      okText="Publicar sugestão"
      cancelText="Cancelar"
      onCancel={onClose}
      onOk={submit}
      confirmLoading={submitting}
      width={720}
    >
      <Form layout="vertical">
        {field(control, "title", "Título")}
        {field(control, "summary", "Resumo")}
        {field(control, "problem", "Contexto do problema", true)}
        {field(control, "businessImpact", "Impacto no negócio", true)}
        {field(control, "proposedSolution", "Sugestão de solução", true)}
        {field(control, "category", "Categoria")}
        {field(control, "author", "Seu nome")}
      </Form>
    </Modal>
  );
}

function field(
  control: ReturnType<typeof useForm<CreateIdeaInput>>["control"],
  name: keyof CreateIdeaInput,
  label: string,
  multiline = false,
) {
  return (
    <Controller
      control={control}
      key={name}
      name={name}
      render={({ field, fieldState }) => (
        <Form.Item
          help={fieldState.error?.message}
          label={label}
          validateStatus={fieldState.error ? "error" : undefined}
        >
          {multiline ? (
            <Input.TextArea rows={4} {...field} />
          ) : (
            <Input {...field} />
          )}
        </Form.Item>
      )}
    />
  );
}
