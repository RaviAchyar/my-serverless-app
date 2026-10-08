"use server";

import { revalidatePath } from "next/cache";

import { type ActionState, TaskSchema, type TaskInput } from "@/lib/schemas";

export async function createTaskAction(
  prevState: ActionState<TaskInput> | null,
  formData: FormData,
): Promise<ActionState<TaskInput>> {
  const rawInput = {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    priority: String(formData.get("priority") ?? ""),
  };

  const parsed = TaskSchema.safeParse(rawInput);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    return {
      status: "error",
      message: "Periksa kembali formulir Anda sebelum menyimpan tugas.",
      fieldErrors: fieldErrors as Partial<Record<keyof TaskInput, string[]>>,
    };
  }

  revalidatePath("/tasks");

  return {
    status: "success",
    message: `Tugas "${parsed.data.title}" berhasil disimpan.`,
    data: parsed.data,
  };
}
