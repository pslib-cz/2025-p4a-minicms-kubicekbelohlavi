import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Zadejte platný e-mail."),
  password: z
    .string()
    .min(8, "Heslo musí mít alespoň 8 znaků.")
    .max(128, "Heslo je příliš dlouhé."),
});

export const registerSchema = loginSchema.extend({
  name: z
    .string()
    .trim()
    .min(2, "Jméno musí mít alespoň 2 znaky.")
    .max(50, "Jméno může mít maximálně 50 znaků."),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
