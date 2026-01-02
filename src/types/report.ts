export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "analyst" | "technician" | "manager";
  initials: string;
  photo: string | null;
  signature: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface ContainerEntry {
  id: string;
  quantity: number;
  type: string;
}

export interface Sample {
  id: string;
  sampleNumber: string;
  sampleName: string;
  internalContainerCount: number;
  internalContainerType: string;
  netWeight: number;
  weightUnit: "gram" | "kg";
  pureOrTotal: "pure" | "total";
  weightUsed: number;
  colorCode: string;
  storageLocation: string;
}

export interface ReportData {
  refNumber: string;
  employee: Employee | null;
  date: string;
  externalContainers: ContainerEntry[];
  senderShop: string;
  internalContainers: ContainerEntry[];
  samples: Sample[];
  barcodeNumber: string;
  producedDate: string;
  expiredDate: string;
  reportNumber: string;
  pdfUrl?: string | null;
  wordUrl?: string | null;
}

export const SENDER_SHOPS = ["Fish Shop", "Veggies Shop"];

export const COLOR_OPTIONS = [
  { name: "Red", value: "#ef4444" },
  { name: "Light Green", value: "#84cc16" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Yellow", value: "#eab308" },
  { name: "Orange", value: "#f97316" },
  { name: "Purple", value: "#a855f7" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Pink", value: "#ec4899" },
];
