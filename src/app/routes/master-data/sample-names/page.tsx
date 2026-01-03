import SampleNames from "@/pages/SampleNames";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sample Names | Master Data",
  description:
    "Manage sample names, codes, and categories for laboratory testing.",
};

export default function SampleNamesPage() {
  return <SampleNames />;
}
