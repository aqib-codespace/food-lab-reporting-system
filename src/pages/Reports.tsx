import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Download,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const reports = [
  { id: 'REF-001234', date: '2024-01-15', employee: 'Ahmed Khan', shop: 'Fish Shop', samples: 4, status: 'completed' },
  { id: 'REF-001235', date: '2024-01-15', employee: 'Sara Ali', shop: 'Veggies Shop', samples: 3, status: 'completed' },
  { id: 'REF-001236', date: '2024-01-14', employee: 'Mohammed Hassan', shop: 'Fish Shop', samples: 5, status: 'pending' },
  { id: 'REF-001237', date: '2024-01-14', employee: 'Fatima Noor', shop: 'Veggies Shop', samples: 2, status: 'completed' },
  { id: 'REF-001238', date: '2024-01-13', employee: 'Omar Rashid', shop: 'Fish Shop', samples: 6, status: 'completed' },
  { id: 'REF-001239', date: '2024-01-13', employee: 'Layla Ibrahim', shop: 'Veggies Shop', samples: 3, status: 'completed' },
  { id: 'REF-001240', date: '2024-01-12', employee: 'Ahmed Khan', shop: 'Fish Shop', samples: 4, status: 'pending' },
  { id: 'REF-001241', date: '2024-01-12', employee: 'Sara Ali', shop: 'Veggies Shop', samples: 2, status: 'completed' },
];

export default function Reports() {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Reports</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all generated reports.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export All
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by reference number..."
                className="pl-9"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Shop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shops</SelectItem>
                <SelectItem value="fish">Fish Shop</SelectItem>
                <SelectItem value="veggies">Veggies Shop</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header text-left py-4 px-6">Reference</th>
                  <th className="table-header text-left py-4 px-6">Date</th>
                  <th className="table-header text-left py-4 px-6">Employee</th>
                  <th className="table-header text-left py-4 px-6">Shop</th>
                  <th className="table-header text-left py-4 px-6">Samples</th>
                  <th className="table-header text-left py-4 px-6">Status</th>
                  <th className="table-header text-right py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr 
                    key={report.id} 
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <span className="font-medium text-foreground">{report.id}</span>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">{report.date}</td>
                    <td className="py-4 px-6 text-foreground">{report.employee}</td>
                    <td className="py-4 px-6">
                      <Badge variant="outline" className="font-normal">
                        {report.shop}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent/10 text-accent text-sm font-medium">
                        {report.samples}
                      </span>
                    </td>
                    <td className="py-4 px-6">
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
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="text-accent hover:text-accent/80">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80 hover:bg-destructive/10">
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
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing 1-8 of 1,247 reports
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-accent text-accent-foreground border-accent">
                1
              </Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <span className="px-2 text-muted-foreground">...</span>
              <Button variant="outline" size="sm">156</Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
