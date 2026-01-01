import Dashboard from "@/pages/Dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of lab operations, recent reports, and key metrics.",
};

export default function Home() {
  return <Dashboard />;
}
