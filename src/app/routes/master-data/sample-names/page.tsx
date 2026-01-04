import SampleNames from "@/pages/SampleNames";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sample Names | Master Data",
  description:
    "Manage sample names and images for laboratory testing.",
};

export default function SampleNamesPage() {
  return <SampleNames />;
}
