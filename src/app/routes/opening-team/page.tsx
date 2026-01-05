import NewReport from "@/pages/NewReport";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Case - Opening Team",
  description:
    "Create a new laboratory case with sample tracking and professional PDF/Word export.",
};

export default function NewReportPage() {
  return <NewReport />;
}
