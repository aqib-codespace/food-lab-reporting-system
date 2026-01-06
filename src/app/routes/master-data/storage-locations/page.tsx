import StorageLocations from "@/pages/StorageLocations";
import { Metadata } from "next";
import { AdminOnly } from "@/components/AdminOnly";

export const metadata: Metadata = {
  title: "Storage Locations | Master Data",
  description: "Configure storage locations and zones for sample organization.",
};

export default function StorageLocationsPage() {
  return (
    <AdminOnly>
      <StorageLocations />
    </AdminOnly>
  );
}
