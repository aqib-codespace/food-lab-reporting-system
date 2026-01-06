import SampleNames from "@/pages/SampleNames";
import { Metadata } from "next";
import { AdminOnly } from "@/components/AdminOnly";

export const metadata: Metadata = {
  title: "Sample Names | Master Data",
  description:
    "Define and manage sample types and categories for laboratory testing.",
};

export default function SampleNamesPage() {
  return (
    <AdminOnly>
      <SampleNames />
    </AdminOnly>
  );
}
