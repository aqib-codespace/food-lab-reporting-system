import { z } from "zod";

export const employeeFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[\d\s\-()]+$/, "Invalid phone number format"),
  role: z.enum(["admin", "analyst", "technician", "manager"], {
    message: "Please select a role",
  }),
  photo: z.string().min(1, "Employee photo is required"),
  signature: z.string().min(1, "Signature is required"),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
