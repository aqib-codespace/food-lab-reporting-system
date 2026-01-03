import ContainerTypes from "@/pages/ContainerTypes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Container Types | Master Data",
  description:
    "Manage external and internal container types for laboratory samples.",
};

export default function ContainerTypesPage() {
  return <ContainerTypes />;
}
