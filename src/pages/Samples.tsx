"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Search, Plus, Package } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const samples = [
  {
    id: "S1",
    name: "Food",
    container: "Plastic Bag",
    weight: "12.58g",
    type: "pure",
    used: "0.03g",
    storage: "Fridge",
    color: "#ef4444",
  },
  {
    id: "S2",
    name: "Drink",
    container: "White Cartoon Box",
    weight: "100g",
    type: "total",
    used: "66.7g",
    storage: "Store",
    color: "#22c55e",
  },
  {
    id: "S3",
    name: "Vegetable",
    container: "Paper Bag",
    weight: "7890.08g",
    type: "pure",
    used: "500g",
    storage: "Fridge",
    color: "#3b82f6",
  },
  {
    id: "S4",
    name: "Meat",
    container: "Plastic Bag",
    weight: "2.5kg",
    type: "total",
    used: "1.2kg",
    storage: "Fridge",
    color: "#eab308",
  },
  {
    id: "S5",
    name: "Fish",
    container: "Brown Cartoon Box",
    weight: "450g",
    type: "pure",
    used: "200g",
    storage: "Fridge",
    color: "#06b6d4",
  },
  {
    id: "S6",
    name: "Dairy",
    container: "Plastic Bag",
    weight: "1kg",
    type: "total",
    used: "500g",
    storage: "Fridge",
    color: "#a855f7",
  },
];

export default function Samples() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Samples
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View all tracked samples across reports.
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 z-10" />
            <Input placeholder="Search samples..." className="w-full pl-9" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {samples.map((sample) => (
          <Card key={sample.id} className="hover:shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: sample.color }}
                  >
                    {sample.id}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {sample.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {sample.container}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                    sample.type === "pure"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  )}
                >
                  {sample.type}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Net Weight</span>
                  <span className="font-medium text-foreground">
                    {sample.weight}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight Used</span>
                  <span className="font-medium text-foreground">
                    {sample.used}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage</span>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                      "bg-gray-100 text-gray-800"
                    )}
                  >
                    {sample.storage}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
