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
  Package,
  AlertTriangle,
  Loader2,
  MoreVertical,
} from "lucide-react";
import { z } from "zod";
import { useContainerTypes } from "@/hooks/useSupabaseData";
import { useToast } from "@/hooks/use-toast";
import DropdownMenu from "@/components/ui/dropdown-menu";

const containerTypeFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().optional(),
  category: z.enum(["external", "internal"]),
});

interface ContainerType {
  id: string;
  name: string;
  description?: string | null;
  category: "external" | "internal";
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export default function ContainerTypes() {
  const {
    data: containers,
    loading,
    error,
    create,
    update,
    remove,
  } = useContainerTypes();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingContainer, setEditingContainer] =
    useState<ContainerType | null>(null);
  const [deletingContainerId, setDeletingContainerId] = useState<string | null>(
    null
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "external" as "external" | "internal",
  });

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    description?: string;
    category?: string;
  }>({});

  const handleAddClick = () => {
    setEditingContainer(null);
    setFormData({ name: "", description: "", category: "external" });
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const handleEditClick = (container: ContainerType) => {
    setEditingContainer(container);
    setFormData({
      name: container.name,
      description: container.description || "",
      category: container.category,
    });
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const handleSaveContainer = async () => {
    const result = containerTypeFormSchema.safeParse(formData);

    if (!result.success) {
      const errors: { name?: string; description?: string; category?: string } =
        {};
      result.error.issues.forEach((issue: z.ZodIssue) => {
        const field = issue.path[0] as "name" | "description" | "category";
        errors[field] = issue.message;
      });
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setIsSubmitting(true);

    try {
      if (editingContainer) {
        const updateResult = await update(editingContainer.id, formData);
        if (updateResult.success) {
          toast({
            title: "Success",
            description: "Container type updated successfully",
          });
          setIsModalOpen(false);
        } else {
          toast({
            title: "Error",
            description:
              updateResult.error || "Failed to update container type",
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
            description: "Container type created successfully",
          });
          setIsModalOpen(false);
        } else {
          toast({
            title: "Error",
            description:
              createResult.error || "Failed to create container type",
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

  const handleDeleteClick = (containerId: string) => {
    setDeletingContainerId(containerId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingContainerId) {
      setIsSubmitting(true);
      const deleteResult = await remove(deletingContainerId);
      if (deleteResult.success) {
        toast({
          title: "Success",
          description: "Container type deleted successfully",
        });
        setIsDeleteModalOpen(false);
        setDeletingContainerId(null);
      } else {
        toast({
          title: "Error",
          description: deleteResult.error || "Failed to delete container type",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    }
  };

  const filteredContainers = useMemo(() => {
    return containers.filter(
      (container) =>
        container.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        container.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        container.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [containers, searchQuery]);

  const externalContainers = filteredContainers.filter(
    (c) => c.category === "external"
  );
  const internalContainers = filteredContainers.filter(
    (c) => c.category === "internal"
  );

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
                Container Types
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage container types for external and internal use (
                {containers.length} total).
              </p>
            </div>
            <Button
              onClick={handleAddClick}
              className="bg-gray-800 text-white hover:shadow-lg transition-all gap-2 rounded-lg px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              Add Container Type
            </Button>
          </div>

          <div className="space-y-6">
            {/* External Containers */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                External Containers ({externalContainers.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {externalContainers.map((container) => (
                  <Card
                    key={container.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {container.name}
                            </h3>
                            <Badge
                              variant="flat"
                              className="bg-blue-100 px-4 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 text-xs mt-1"
                            >
                              External
                            </Badge>
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
                                onSelect={() => handleEditClick(container)}
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>Edit</span>
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                onSelect={() => handleDeleteClick(container.id)}
                                className="text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Root>
                        </div>
                      </div>
                      {container.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {container.description}
                        </p>
                      )}
                     
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            {filteredContainers.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No container types found.
                  </p>
                </CardContent>
              </Card>
            )}

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Internal Containers ({internalContainers.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {internalContainers.map((container) => (
                  <Card
                    key={container.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                            <Package className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {container.name}
                            </h3>
                            <Badge
                              variant="flat"
                              className="bg-purple-100 px-4 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 text-xs mt-1"
                            >
                              Internal
                            </Badge>
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
                                onSelect={() => handleEditClick(container)}
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>Edit</span>
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                onSelect={() => handleDeleteClick(container.id)}
                                className="text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Root>
                        </div>
                      </div>
                      {container.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {container.description}
                        </p>
                      )}
                   
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {filteredContainers.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  No container types found.
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
                    <Package className="w-5 h-5 text-blue-600" />
                    {editingContainer
                      ? "Edit Container Type"
                      : "Add Container Type"}
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
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Container name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
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
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value as "external" | "internal",
                        }))
                      }
                      className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        validationErrors.category
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                    >
                      <option value="external">External</option>
                      <option value="internal">Internal</option>
                    </select>
                    {validationErrors.category && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {validationErrors.category}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Description
                    </label>
                    <textarea
                      placeholder="Container description (optional)"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="flex items-center rounded-b-xl justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    variant="outline"
                    className="border-gray-300 border rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveContainer}
                    className="bg-gray-800 rounded-lg text-white"
                  >
                    {editingContainer ? "Update" : "Add"} Container Type
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
                        Delete Container Type
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        This action cannot be undone
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete this container type? All
                    associated data will be permanently removed.
                  </p>
                </div>

                <div className="flex rounded-b-xl items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
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
                    Delete Container Type
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

