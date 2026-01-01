import Samples from "@/pages/Samples";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Samples",
  description: "View and manage laboratory sample inventory and tracking.",
};

export default function SamplesPage() {
  return <Samples />;
}
