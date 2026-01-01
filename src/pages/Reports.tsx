"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { Button, Badge } from "rizzui";
import {
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const reports = [
  {
    id: "REF-001234",
    date: "2024-01-15",
    employee: "Ahmed Khan",
    shop: "Fish Shop",
    samples: 4,
    status: "completed",
  },
  {
    id: "REF-001235",
    date: "2024-01-15",
    employee: "Sara Ali",
    shop: "Veggies Shop",
    samples: 3,
    status: "completed",
  },
  {
    id: "REF-001236",
    date: "2024-01-14",
    employee: "Mohammed Hassan",
    shop: "Fish Shop",
    samples: 5,
    status: "pending",
  },
  {
    id: "REF-001237",
    date: "2024-01-14",
    employee: "Fatima Noor",
    shop: "Veggies Shop",
    samples: 2,
    status: "completed",
  },
  {
    id: "REF-001238",
    date: "2024-01-13",
    employee: "Omar Rashid",
    shop: "Fish Shop",
    samples: 6,
    status: "completed",
  },
  {
    id: "REF-001239",
    date: "2024-01-13",
    employee: "Layla Ibrahim",
    shop: "Veggies Shop",
    samples: 3,
    status: "completed",
  },
  {
    id: "REF-001240",
    date: "2024-01-12",
    employee: "Ahmed Khan",
    shop: "Fish Shop",
    samples: 4,
    status: "pending",
  },
  {
    id: "REF-001241",
    date: "2024-01-12",
    employee: "Sara Ali",
    shop: "Veggies Shop",
    samples: 2,
    status: "completed",
  },
];

export default function Reports() {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-3 bg-linear-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
            All Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            View and manage all generated reports
          </p>
        </div>
        <Button className="gap-2 bg-linear-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transition-all">
          <Download className="w-4 h-4" />
          Export All
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
              <Input
                placeholder="Search by reference number..."
                className="w-full pl-9 h-11 border-gray-200 dark:border-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <Select
              options={[
                { label: "All Status", value: "all" },
                { label: "Completed", value: "completed" },
                { label: "Pending", value: "pending" },
              ]}
              placeholder="Status"
            />
            <Select
              options={[
                { label: "All Shops", value: "all" },
                { label: "Fish Shop", value: "fish" },
                { label: "Veggies Shop", value: "veggies" },
              ]}
              placeholder="Shop"
            />
            <Button
              variant="outline"
              className="gap-2 h-11 border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
            >
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card className="border-0 shadow-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Reference
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Date
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Employee
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Shop
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Samples
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900">
                {reports.map((report, index) => (
                  <tr
                    key={report.id}
                    className={cn(
                      "border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50/50 dark:hover:bg-gray-800/50 transition-all duration-200",
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-900"
                        : "bg-gray-50/30 dark:bg-gray-900/50"
                    )}
                  >
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {report.id}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                      {report.date}
                    </td>
                    <td className="py-4 px-6 text-gray-900 dark:text-white font-medium">
                      {report.employee}
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant="outline"
                        className="font-normal border-gray-300 dark:border-gray-700"
                      >
                        {report.shop}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                        {report.samples}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant="flat"
                        className={cn(
                          "font-medium",
                          report.status === "completed"
                            ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                            : "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                        )}
                      >
                        {report.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="text"
                          size="sm"
                          className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 p-2 rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="text"
                          size="sm"
                          className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-all"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="text"
                          size="sm"
                          className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 p-2 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Showing 1-8 of 1,247 reports
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-gray-300 dark:border-gray-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                className="bg-linear-to-r from-blue-600 to-teal-600 text-white border-0 hover:from-blue-700 hover:to-teal-700"
              >
                1
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 dark:border-gray-700 hover:border-blue-500"
              >
                2
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 dark:border-gray-700 hover:border-blue-500"
              >
                3
              </Button>
              <span className="px-2 text-gray-400">...</span>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 dark:border-gray-700 hover:border-blue-500"
              >
                156
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 dark:border-gray-700 hover:border-blue-500"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
