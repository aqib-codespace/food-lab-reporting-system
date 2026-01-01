"use client";
import {
  FileText,
  Package,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ChevronRight,
  Users,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, Badge } from "rizzui";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const recentReports = [
  {
    id: "REF-001234",
    date: "2024-01-15",
    employee: "Ahmed Khan",
    samples: 4,
    status: "completed",
  },
  {
    id: "REF-001235",
    date: "2024-01-15",
    employee: "Sara Ali",
    samples: 3,
    status: "completed",
  },
  {
    id: "REF-001236",
    date: "2024-01-14",
    employee: "Mohammed Hassan",
    samples: 5,
    status: "pending",
  },
  {
    id: "REF-001237",
    date: "2024-01-14",
    employee: "Fatima Noor",
    samples: 2,
    status: "completed",
  },
];

const stats = [
  {
    title: "Total Reports",
    value: "1,247",
    change: "+12.5%",
    trend: "up",
    icon: FileText,
    description: "This month",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Total Samples",
    value: "4,892",
    change: "+8.2%",
    trend: "up",
    icon: Package,
    description: "Tracked this month",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Avg. Processing",
    value: "2.4 min",
    change: "-15%",
    trend: "down",
    icon: Clock,
    description: "Per report",
    color: "from-amber-500 to-amber-600",
  },
  {
    title: "Efficiency",
    value: "94.2%",
    change: "+3.1%",
    trend: "up",
    icon: TrendingUp,
    description: "Completion rate",
    color: "from-purple-500 to-purple-600",
  },
];

export default function Dashboard() {
  const route = useRouter();

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-base">
            Welcome back! Here's your sample tracking overview.
          </p>
        </div>
        <Button
          onClick={() => route.push("/new-report")}
          size="lg"
          className="bg-linear-to-r px-4 py-2 rounded-lg from-blue-600 to-teal-500 text-white hover:opacity-90 transition-opacity shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Report
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
          return (
            <Card
              key={index}
              className="relative overflow-hidden hover:shadow-xl transition-shadow duration-300 border-0"
            >
              <div
                className={cn(
                  "absolute top-0 right-0 w-32 h-32 bg-linear-to-br opacity-10",
                  stat.color
                )}
                style={{ borderRadius: "0 0 0 100%" }}
              />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={cn(
                      "p-3 rounded-xl bg-linear-to-br shadow-lg",
                      stat.color
                    )}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold",
                      stat.trend === "up"
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                    )}
                  >
                    <TrendIcon className="w-3 h-3" />
                    {stat.change}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {stat.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Reports */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Recent Reports
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Your latest sample tracking activities
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => route.push("/reports")}
              className="gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer group"
                onClick={() => route.push(`/reports/${report.id}`)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-600 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {report.id}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-3 h-3 text-gray-500" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {report.employee}
                      </p>
                      <span className="text-gray-400">•</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {report.date}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {report.samples} samples
                    </p>
                    <Badge
                      color={
                        report.status === "completed" ? "success" : "warning"
                      }
                      className="mt-1"
                    >
                      {report.status}
                    </Badge>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
