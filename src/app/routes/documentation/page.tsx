import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Documentation from "@/pages/Documentation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Comprehensive documentation and guides for the Food Lab Reporting System.",
};

export default function DocumentationPage() {
  return (
    <DashboardLayout>
      <Documentation />
    </DashboardLayout>
  );
}
