import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Package } from "lucide-react";

// Mock data
const samples = [
  { id: 'S1', name: 'Food', container: 'Plastic Bag', weight: '12.58g', type: 'pure', used: '0.03g', storage: 'Fridge', color: '#ef4444' },
  { id: 'S2', name: 'Drink', container: 'White Cartoon Box', weight: '100g', type: 'total', used: '66.7g', storage: 'Store', color: '#22c55e' },
  { id: 'S3', name: 'Vegetable', container: 'Paper Bag', weight: '7890.08g', type: 'pure', used: '500g', storage: 'Fridge', color: '#3b82f6' },
  { id: 'S4', name: 'Meat', container: 'Plastic Bag', weight: '2.5kg', type: 'total', used: '1.2kg', storage: 'Fridge', color: '#eab308' },
  { id: 'S5', name: 'Fish', container: 'Brown Cartoon Box', weight: '450g', type: 'pure', used: '200g', storage: 'Fridge', color: '#06b6d4' },
  { id: 'S6', name: 'Dairy', container: 'Plastic Bag', weight: '1kg', type: 'total', used: '500g', storage: 'Fridge', color: '#a855f7' },
];

export default function Samples() {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Samples</h1>
          <p className="text-muted-foreground mt-1">
            View all tracked samples across reports.
          </p>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search samples..."
              className="pl-9 max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      {/* Samples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {samples.map((sample) => (
          <Card key={sample.id} className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-primary-foreground font-bold"
                    style={{ backgroundColor: sample.color }}
                  >
                    {sample.id}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{sample.name}</h3>
                    <p className="text-sm text-muted-foreground">{sample.container}</p>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={sample.type === 'pure' 
                    ? 'bg-success/10 text-success border-success/20' 
                    : 'bg-accent/10 text-accent border-accent/20'
                  }
                >
                  {sample.type}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Net Weight</span>
                  <span className="font-medium text-foreground">{sample.weight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight Used</span>
                  <span className="font-medium text-foreground">{sample.used}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage</span>
                  <Badge variant="secondary" className="font-normal">
                    {sample.storage}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
