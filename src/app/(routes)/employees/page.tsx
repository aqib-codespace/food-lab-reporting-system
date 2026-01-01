import Employees from "@/pages/Employees";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employees",
  description: "Manage laboratory employees and staff information.",
};

export default function EmployeesPage() {
  return <Employees />;
}
