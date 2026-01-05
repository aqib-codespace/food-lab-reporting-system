import { z } from "zod";

export const employeeFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  role_id: z.string().min(1, "Role is required"),
  photo: z.string().min(1, "Employee photo is required"),
  signature: z.string().min(1, "Signature is required"),
});

export const roleFormSchema = z.object({
  name: z
    .string()
    .min(1, "Role name is required")
    .max(100, "Role name is too long"),
  description: z.string().optional(),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
export type RoleFormData = z.infer<typeof roleFormSchema>;
