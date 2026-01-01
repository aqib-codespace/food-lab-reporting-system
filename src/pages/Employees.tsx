import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import { EMPLOYEES } from "@/types/report";

export default function Employees() {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employees</h1>
          <p className="text-muted-foreground mt-1">
            Manage employees for report generation.
          </p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
          <Plus className="w-4 h-4" />
          Add Employee
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="pl-9 max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {EMPLOYEES.map((employee) => (
          <Card key={employee.id} className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-primary-foreground"
                    style={{ backgroundColor: employee.color }}
                  >
                    {employee.initials}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">Employee ID: EMP-{employee.id.padStart(4, '0')}</p>
                    <Badge variant="secondary" className="mt-2 font-normal">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <Edit2 className="w-3 h-3" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive/80 hover:bg-destructive/10">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
