import Reports from "@/pages/Reports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Cases - Examination Team",
  description:
    "View and manage all laboratory cases with advanced filtering and export options.",
};

export default function ReportsPage() {
  return <Reports />;
}
