export interface Employee {
  id: string;
  name: string;
  initials: string;
  color: string;
  role?: string;
  email?: string;
  phone?: string;
  active?: boolean;
  signature?: string; // image data URI or URL for a handwritten signature
}

export const makeSignature = (text: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='360' height='80'><text x='0' y='55' font-family='Pacifico, cursive' font-size='48' fill='#000'>${text}</text></svg>`
  )}`;

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
  weightUnit: 'gram' | 'kg';
  pureOrTotal: 'pure' | 'total';
  weightUsed: number;
  colorCode: string;
  storageLocation: 'store' | 'fridge' | 'both';
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
}

export const EXTERNAL_CONTAINER_TYPES = [
  'White Plastic Bag',
  'Transparent Plastic Bag',
  'White Cartoon Box',
  'Brown Cartoon Box',
  'Brown Paper Bag',
];

export const INTERNAL_CONTAINER_TYPES = [
  'Plastic Bag',
  'Paper Plastic Bag',
  'White Cartoon Box',
  'Brown Cartoon Box',
];

export const SENDER_SHOPS = [
  'Fish Shop',
  'Veggies Shop',
];

export const SAMPLE_NAMES = [
  'Food',
  'Drink',
  'Vegetable',
  'Fruit',
  'Meat',
  'Fish',
  'Dairy',
];

export const COLOR_OPTIONS = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Light Green', value: '#84cc16' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Pink', value: '#ec4899' },
];

export const EMPLOYEES: Employee[] = [
  { id: '1', name: 'Ahmed Khan', initials: 'AK', color: '#3b82f6', role: 'Lab Supervisor', email: 'ahmed.khan@example.com', phone: '+971 50 000 001', active: true, signature: makeSignature('Ahmed Khan') },
  { id: '2', name: 'Sara Ali', initials: 'SA', color: '#10b981', role: 'Quality Analyst', email: 'sara.ali@example.com', phone: '+971 50 000 002', active: true, signature: makeSignature('Sara Ali') },
  { id: '3', name: 'Mohammed Hassan', initials: 'MH', color: '#8b5cf6', role: 'Field Collector', email: 'mohammed.hassan@example.com', phone: '+971 50 000 003', active: false, signature: makeSignature('Mohammed Hassan') },
  { id: '4', name: 'Fatima Noor', initials: 'FN', color: '#f59e0b', role: 'Lab Technician', email: 'fatima.noor@example.com', phone: '+971 50 000 004', active: true, signature: makeSignature('Fatima Noor') },
  { id: '5', name: 'Omar Rashid', initials: 'OR', color: '#ef4444', role: 'Operations Lead', email: 'omar.rashid@example.com', phone: '+971 50 000 005', active: true, signature: makeSignature('Omar Rashid') },
  { id: '6', name: 'Layla Ibrahim', initials: 'LI', color: '#ec4899', role: 'Reporting Officer', email: 'layla.ibrahim@example.com', phone: '+971 50 000 006', active: false, signature: makeSignature('Layla Ibrahim') },
];
