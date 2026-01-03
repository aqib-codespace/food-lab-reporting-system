import NewReport from "@/pages/NewReport";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Report",
  description:
    "Create a new laboratory report with sample tracking and professional PDF/Word export.",
};

export default function NewReportPage() {
  return <NewReport />;
}
