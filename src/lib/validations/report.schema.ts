import { z } from "zod";

/**
 * Container Entry Schema
 */
export const containerEntrySchema = z.object({
  id: z.string(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  type: z.string().min(1, "Container type is required"),
});

/**
 * Sample Schema
 */
export const sampleSchema = z.object({
  id: z.string(),
  sampleNumber: z.string().min(1, "Sample number is required"),
  sampleName: z.string().min(1, "Sample name is required"),
  internalContainerCount: z.number().min(1, "At least 1 container required"),
  internalContainerType: z.string().min(1, "Container type is required"),
  netWeight: z.number().min(0, "Weight cannot be negative"),
  weightUnit: z.enum(["gram", "kg"]),
  pureOrTotal: z.enum(["pure", "total"]),
  weightUsed: z.number().min(0, "Weight used cannot be negative"),
  colorCode: z.string(),
  storageLocation: z.enum(["store", "fridge", "both"]),
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

/**
 * Main Report Data Schema
 */
export const reportSchema = z.object({
  refNumber: z.string().min(1, "Reference number is required"),
  employee: employeeSchema.nullable(),
  date: z.string().min(1, "Date is required"),
  externalContainers: z
    .array(containerEntrySchema)
    .min(1, "At least one external container required"),
  senderShop: z.string().min(1, "Sender shop is required"),
  internalContainers: z
    .array(containerEntrySchema)
    .min(1, "At least one internal container required"),
  samples: z.array(sampleSchema).min(1, "At least one sample required"),
  barcodeNumber: z.string().optional().or(z.literal("")),
  producedDate: z.string().min(1, "Production date is required"),
  expiredDate: z.string().min(1, "Expiration date is required"),
  reportNumber: z.string().default("In System"),
});

/**
 * TypeScript types inferred from Zod schemas
 */
export type ContainerEntryInput = z.infer<typeof containerEntrySchema>;
export type SampleInput = z.infer<typeof sampleSchema>;
export type EmployeeInput = z.infer<typeof employeeSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
