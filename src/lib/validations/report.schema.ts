import { z } from "zod";


export const containerEntrySchema = z.object({
  id: z.string(),
  quantity: z.number().optional(),
  type: z.string().optional(),
});


export const sampleSchema = z.object({
  id: z.string(),
  sampleNumber: z.string().optional(),
  sampleName: z.string().optional(),
  internalContainerCount: z.number().optional(),
  internalContainerType: z.string().optional(),
  netWeight: z.number().optional(),
  weightUnit: z.enum(["gram", "kg"]).optional(),
  pureOrTotal: z.enum(["pure", "total"]).optional(),
  weightUsed: z.number().optional(),
  colorCode: z.string().optional(),
  storageLocation: z.enum(["store", "fridge", "both"]).optional(),
});

export const employeeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Employee name is required"),
  initials: z.string().optional(),
  color: z.string().optional(),
  role: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  active: z.boolean().optional(),
  signature: z.string().optional(),
});


export const reportSchema = z.object({
  refNumber: z
    .string()
    .min(6, "Reference number must be 6 digits")
    .max(6, "Reference number must be 6 digits"),
  employee: employeeSchema.nullable().refine((val) => val !== null, {
    message: "Please select an employee",
  }),
  date: z.string().optional(),
  externalContainers: z.array(containerEntrySchema).optional(),
  senderShop: z.string().optional(),
  internalContainers: z.array(containerEntrySchema).optional(),
  samples: z.array(sampleSchema).optional(),
  barcodeNumber: z.string().optional().or(z.literal("")),
  producedDate: z.string().optional(),
  expiredDate: z.string().optional(),
  reportNumber: z.string().optional().default("In System"),
});


export type ContainerEntryInput = z.infer<typeof containerEntrySchema>;
export type SampleInput = z.infer<typeof sampleSchema>;
export type EmployeeInput = z.infer<typeof employeeSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
