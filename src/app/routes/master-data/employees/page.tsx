import Employees from "@/pages/Employees";
import { Metadata } from "next";
import { AdminOnly } from "@/components/AdminOnly";

export const metadata: Metadata = {
  title: "Employees | Master Data",
  description:
    "Manage laboratory employees and staff with roles and permissions.",
};

export default function EmployeesPage() {
  return (
    <AdminOnly>
      <Employees />
    </AdminOnly>
  );
}
