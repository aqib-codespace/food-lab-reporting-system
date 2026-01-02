import { z } from "zod";

// Container Type Schema
export const containerTypeFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().optional(),
  category: z.enum(["external", "internal"]).refine((val) => val, {
    message: "Please select a category",
  }),
});

export type ContainerTypeFormData = z.infer<typeof containerTypeFormSchema>;

// Sample Name Schema
export const sampleNameFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  code: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
});

export type SampleNameFormData = z.infer<typeof sampleNameFormSchema>;

// Storage Location Schema
export const storageLocationFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  type: z.enum(["store", "fridge", "freezer", "room"]).refine((val) => val, {
    message: "Please select a type",
  }),
  code: z.string().optional(),
  capacity: z
    .number()
    .positive("Capacity must be positive")
    .optional()
    .or(z.literal(0)),
  temperature: z.string().optional(),
  description: z.string().optional(),
});

export type StorageLocationFormData = z.infer<typeof storageLocationFormSchema>;
