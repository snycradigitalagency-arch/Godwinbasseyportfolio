import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Enter your name").max(120),
  email: z.string().email("Enter a valid email"),
  subject: z.string().max(150).optional(),
  body: z.string().min(10, "Say a bit more — at least 10 characters").max(5000),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
