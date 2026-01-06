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
import { format } from "date-fns";
import { useReports } from "@/hooks/useReports";
import { useEmployees } from "@/hooks/useSupabaseData";

export default function Dashboard() {
  const route = useRouter();
  const { reports, loading } = useReports();
  const { data: employees, loading: employeesLoading } = useEmployees();

  const recentReports = reports.slice(0, 4);

  const totalReports = reports.length;
  const totalSamples = reports.reduce(
    (acc, report) => acc + (report.samples?.length || 0),
    0
  );
  const totalEmployees = employees?.length || 0;

  // Calculate completed and pending cases
  const completedCases = reports.filter(
    (report) => report.status === "completed"
  ).length;
  const pendingCases = reports.filter(
    (report) => report.status === "pending"
  ).length;

  // Calculate percentage changes (comparing to previous period - can be customized)
  const completedPercentage =
    totalReports > 0 ? ((completedCases / totalReports) * 100).toFixed(1) : "0";
  const pendingPercentage =
    totalReports > 0 ? ((pendingCases / totalReports) * 100).toFixed(1) : "0";

  const stats = [
    {
      title: "Total Cases",
      value: totalReports.toString(),
      change: "+12.5%",
      trend: "up" as const,
      icon: FileText,
      description: "All Time",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Employees",
      value: totalEmployees.toString(),
      change: "+8.2%",
      trend: "up" as const,
      icon: Users,
      description: "Active employees",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Completed Cases",
      value: completedCases.toString(),
      change: `${completedPercentage}%`,
      trend: "up" as const,
      icon: Package,
      description: "Successfully Processed",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Pending Cases",
      value: pendingCases.toString(),
      change: `${pendingPercentage}%`,
      trend:
        pendingCases > completedCases ? ("up" as const) : ("down" as const),
      icon: Clock,
      description: "Awaiting Processing",
      color: "from-amber-500 to-amber-600",
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
            Welcome back! Here's an overview of your lab activities.
          </p>
        </div>
        <Button
          onClick={() => route.push("/routes/opening-team")}
          size="lg"
          className="bg-gray-800 dark:bg-blue-700 px-4 py-2 rounded-lg  text-white hover:opacity-90 transition-opacity shadow-lg w-full sm:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Case
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                  "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10",
                  stat.color
                )}
                style={{ borderRadius: "0 0 0 100%" }}
              />
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div
                    className={cn(
                      "p-3 rounded-xl bg-gradient-to-br shadow-lg",
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
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
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

      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Recent Cases
              </CardTitle>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                Your latest sample tracking activities
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => route.push("/routes/examination-team")}
              className="gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 min-h-[400px]">
          <div className="space-y-4">
            {recentReports.length === 0 ? (
              <div className="py-20 text-center">
                <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No cases yet. Create your first case to get started.
                </p>
                <Button
                  onClick={() => route.push("/routes/opening-team")}
                  size="sm"
                  className="bg-gray-800 px-4 rounded-lg  text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Case
                </Button>
              </div>
            ) : (
              recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer group"
                  onClick={() =>
                    route.push(`/routes/examination-team/${report.id}`)
                  }
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-800 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                        {report.ref_number}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Users className="w-3 h-3 text-gray-500 shrink-0" />
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                          {report.employee?.name || "N/A"}
                        </p>
                        <span className="text-gray-400 hidden sm:inline">
                          •
                        </span>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {format(new Date(report.created_at), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                        {report.samples?.length || 0} samples
                      </p>
                      <Badge
                        color={
                          report.status === "pending" ? "warning" : "success"
                        }
                        className={cn(
                          "mt-1 px-3 text-xs",
                          report.status === "pending"
                            ? "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400"
                            : "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400"
                        )}
                      >
                        {report.status === "pending" ? "Pending" : "Completed"}
                      </Badge>
                    </div>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
