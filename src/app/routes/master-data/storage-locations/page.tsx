import StorageLocations from "@/pages/StorageLocations";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Storage Locations | Master Data",
  description:
    "Manage storage locations including refrigerators, freezers, and storage rooms.",
};

export default function StorageLocationsPage() {
  return <StorageLocations />;
}
