import * as z from "zod";

export const TaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Judul tugas minimal 3 karakter." })
    .max(100, { message: "Judul tugas maksimal 100 karakter." }),
  description: z
    .string()
    .trim()
    .max(500, { message: "Deskripsi maksimal 500 karakter." })
    .optional()
    .or(z.literal(""))
    .transform((value) => (value === "" ? undefined : value)),
  priority: z.enum(["low", "medium", "high"], {
    message: "Pilih prioritas tugas yang valid.",
  }),
});

export type TaskInput = z.infer<typeof TaskSchema>;

export type ActionState<T> =
  | {
      status: "idle" | "success" | "error";
      message?: string;
      data?: T;
      fieldErrors?: Partial<Record<keyof T, string[]>>;
    }
  | null;
