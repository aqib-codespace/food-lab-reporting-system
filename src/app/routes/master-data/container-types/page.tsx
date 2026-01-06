import ContainerTypes from "@/pages/ContainerTypes";
import { Metadata } from "next";
import { AdminOnly } from "@/components/AdminOnly";

export const metadata: Metadata = {
  title: "Container Types | Master Data",
  description:
    "Manage external and internal container types for laboratory samples.",
};

export default function ContainerTypesPage() {
  return (
    <AdminOnly>
      <ContainerTypes />
    </AdminOnly>
  );
}
