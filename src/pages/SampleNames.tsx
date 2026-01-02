"use client";
import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge, Button } from "rizzui";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  TestTube2,
  AlertTriangle,
  Loader2,
  MoreVertical,
} from "lucide-react";
import { z } from "zod";
import { useSampleNames } from "@/hooks/useSupabaseData";
import { useToast } from "@/hooks/use-toast";
import DropdownMenu from "@/components/ui/dropdown-menu";

const sampleNameFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  code: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
});

interface SampleName {
  id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  category?: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export default function SampleNames() {
  const {
    data: samples,
    loading,
    error,
    create,
    update,
    remove,
  } = useSampleNames();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSample, setEditingSample] = useState<SampleName | null>(null);
  const [deletingSampleId, setDeletingSampleId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "",
    description: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    code?: string;
    category?: string;
    description?: string;
  }>({});

  const handleAddClick = () => {
    setEditingSample(null);
    setFormData({ name: "", code: "", category: "", description: "" });
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const handleEditClick = (sample: SampleName) => {
    setEditingSample(sample);
    setFormData({
      name: sample.name,
      code: sample.code || "",
      category: sample.category || "",
      description: sample.description || "",
    });
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const handleSaveSample = async () => {
    const result = sampleNameFormSchema.safeParse(formData);

    if (!result.success) {
      const errors: {
        name?: string;
        code?: string;
        category?: string;
        description?: string;
      } = {};
      result.error.issues.forEach((issue: z.ZodIssue) => {
        const field = issue.path[0] as
          | "name"
          | "code"
          | "category"
          | "description";
        errors[field] = issue.message;
      });
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setIsSubmitting(true);

    try {
      if (editingSample) {
        const updateResult = await update(editingSample.id, formData);
        if (updateResult.success) {
          toast({
            title: "Success",
            description: "Sample name updated successfully",
          });
          setIsModalOpen(false);
        } else {
          toast({
            title: "Error",
            description: updateResult.error || "Failed to update sample name",
            variant: "destructive",
          });
        }
      } else {
        const createResult = await create({
          ...formData,
          status: "active",
        });
        if (createResult.success) {
          toast({
            title: "Success",
            description: "Sample name created successfully",
          });
          setIsModalOpen(false);
        } else {
          toast({
            title: "Error",
            description: createResult.error || "Failed to create sample name",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (sampleId: string) => {
    setDeletingSampleId(sampleId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingSampleId) {
      setIsSubmitting(true);
      const deleteResult = await remove(deletingSampleId);
      if (deleteResult.success) {
        toast({
          title: "Success",
          description: "Sample name deleted successfully",
        });
        setIsDeleteModalOpen(false);
        setDeletingSampleId(null);
      } else {
        toast({
          title: "Error",
          description: deleteResult.error || "Failed to delete sample name",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    }
  };

  const filteredSamples = useMemo(() => {
    return samples.filter(
      (sample) =>
        sample.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sample.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sample.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [samples, searchQuery]);

  return (
    <DashboardLayout>
      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <AlertTriangle className="w-12 h-12 text-red-500" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      {!loading && !error && (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Sample Names
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage sample names and categories ({samples.length} total).
              </p>
            </div>
            <Button
              onClick={handleAddClick}
              className="bg-gray-800 text-white hover:shadow-lg transition-all gap-2 rounded-lg px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              Add Sample Name
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSamples.map((sample) => (
              <Card
                key={sample.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                        <TestTube2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {sample.name}
                        </h3>
                        {sample.code && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Code: {sample.code}
                          </p>
                        )}
                        {sample.category && (
                          <Badge
                            variant="flat"
                            className="bg-gray-100 px-4 text-blue-700 dark:bg-teal-900/20 dark:text-teal-300 text-xs mt-2"
                          >
                            {sample.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <button className="p-2 rounded-md hover:bg-gray-100 bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DropdownMenu.Item
                            onSelect={() => handleEditClick(sample)}
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            onSelect={() => handleDeleteClick(sample.id)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </div>
                  </div>
                  {sample.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {sample.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSamples.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <TestTube2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  No sample names found.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Add/Edit Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <TestTube2 className="w-5 h-5 text-teal-600" />
                    {editingSample ? "Edit Sample Name" : "Add Sample Name"}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Sample Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Milk Sample"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
                        validationErrors.name
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                    />
                    {validationErrors.name && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {validationErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Category
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Dairy"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Description
                    </label>
                    <textarea
                      placeholder="Sample description (optional)"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                <div className="flex rounded-b-xl items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    variant="outline"
                    className="border-gray-300 border rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveSample}
                    className="bg-gray-800 rounded-lg text-white"
                  >
                    {editingSample ? "Update" : "Add"} Sample Name
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Modal */}
          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Delete Sample Name
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        This action cannot be undone
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete this sample name? All
                    associated data will be permanently removed.
                  </p>
                </div>

                <div className="flex  rounded-b-xl items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <Button
                    onClick={() => setIsDeleteModalOpen(false)}
                    variant="outline"
                    className="border-gray-300 border rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmDelete}
                    className="bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Sample Name
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}