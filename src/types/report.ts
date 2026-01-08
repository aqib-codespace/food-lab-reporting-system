export interface Employee {
  id: string;
  name: string;
  role_id: string | null;
  initials: string;
  photo: string | null;
  signature: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  roles?: {
    id: string;
    name: string;
    description: string | null;
  };
}

export interface ContainerEntry {
  id: string;
  quantity: number;
  type: string;
}

export interface InternalContainerEntry {
  id: string;
  quantity: number;
  type: string;
}

export interface Sample {
  id: string;
  sampleNumber: string;
  sampleName: string;
  internalContainers: InternalContainerEntry[];
  netWeight: number | string;
  weightUnit: "gram" | "kg";
  pureOrTotal: "pure" | "total";
  weightUsed: number | string;
  colorCode: string;
  storageLocation: string;
  systemCaseNumber?: string;
  weightNotes?: string;
  isSwabOnly?: boolean;
}

export interface ReportData {
  id?: string;
  refNumber: string;
  employee: Employee | null;
  date: string;
  externalContainers: ContainerEntry[];
  senderShop: string;
  internalContainers: ContainerEntry[];
  samples: Sample[];
  barcodeNumber: string;
  bagNumber?: string;
  dispatchNumber?: string;
  dateReceivedByDepartment?: string;
  systemRegistrationDate?: string;
  consumerNotes?: string;
  unexaminedItems?: string;
  reportNumber: string;
  status?: "pending" | "completed";
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
