import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ComingSoon from "@/pages/ComingSoon";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Comprehensive documentation and guides for the Food Lab Reporting System.",
};

export default function DocumentationPage() {
  return (
    <DashboardLayout>
      <ComingSoon />
    </DashboardLayout>
  );
}
