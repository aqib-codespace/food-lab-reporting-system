'use client';
import { 
  FileText, 
  Package, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useRouter } from "next/navigation";

const recentReports = [
  { id: 'REF-001234', date: '2024-01-15', employee: 'Ahmed Khan', samples: 4, status: 'completed' },
  { id: 'REF-001235', date: '2024-01-15', employee: 'Sara Ali', samples: 3, status: 'completed' },
  { id: 'REF-001236', date: '2024-01-14', employee: 'Mohammed Hassan', samples: 5, status: 'pending' },
  { id: 'REF-001237', date: '2024-01-14', employee: 'Fatima Noor', samples: 2, status: 'completed' },
];

const stats = [
  { 
    title: 'Total Reports', 
    value: '1,247', 
    change: '+12.5%', 
    trend: 'up', 
    icon: FileText,
    description: 'This month'
  },
  { 
    title: 'Total Samples', 
    value: '4,892', 
    change: '+8.2%', 
    trend: 'up', 
    icon: Package,
    description: 'Tracked this month'
  },
  { 
    title: 'Avg. Processing', 
    value: '2.4 min', 
    change: '-15%', 
    trend: 'down', 
    icon: Clock,
    description: 'Per report'
  },
  { 
    title: 'Efficiency', 
    value: '94.2%', 
    change: '+3.1%', 
    trend: 'up', 
    icon: TrendingUp,
    description: 'Completion rate'
  },
];

export default function Dashboard() {
  const route = useRouter();

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's your sample tracking overview.
          </p>
        </div>
        <Button 
          onClick={() => route.push('/new-report')}
          className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
        >
          <Plus className="w-4 h-4" />
          New Report
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="stat-card card-hover">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${
                    stat.trend === 'up' ? 'text-success' : 'text-destructive'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {stat.change}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold">Recent Reports</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground gap-1"
            onClick={() => route.push('/reports')}
          >
            View all
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header text-left py-3 px-4">Reference</th>
                  <th className="table-header text-left py-3 px-4">Date</th>
                  <th className="table-header text-left py-3 px-4">Employee</th>
                  <th className="table-header text-left py-3 px-4">Samples</th>
                  <th className="table-header text-left py-3 px-4">Status</th>
                  <th className="table-header text-right py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr 
                    key={report.id} 
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="font-medium text-foreground">{report.id}</span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{report.date}</td>
                    <td className="py-3 px-4 text-foreground">{report.employee}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-sm font-medium">
                        {report.samples}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={report.status === 'completed' ? 'default' : 'secondary'}
                        className={report.status === 'completed' 
                          ? 'bg-success/10 text-success border-success/20 hover:bg-success/20' 
                          : 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20'
                        }
                      >
                        {report.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className="card-hover cursor-pointer group"
          onClick={() => route.push('/new-report')}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <FileText className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Create Report</h3>
              <p className="text-sm text-muted-foreground">Generate a new sample report</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="card-hover cursor-pointer group"
          onClick={() => route.push('/samples')}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">View Samples</h3>
              <p className="text-sm text-muted-foreground">Browse all tracked samples</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="card-hover cursor-pointer group"
          onClick={() => route.push('/reports')}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">All Reports</h3>
              <p className="text-sm text-muted-foreground">View complete history</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
