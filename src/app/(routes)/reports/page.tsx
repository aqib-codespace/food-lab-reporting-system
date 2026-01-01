import Reports from "@/pages/Reports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Reports",
  description:
    "View and manage all laboratory reports with advanced filtering and export options.",
};

export default function ReportsPage() {
  return <Reports />;
}
