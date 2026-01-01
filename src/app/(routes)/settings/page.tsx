import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ComingSoon from "@/pages/ComingSoon";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Configure system settings and preferences.",
};

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <ComingSoon />
    </DashboardLayout>
  );
}
