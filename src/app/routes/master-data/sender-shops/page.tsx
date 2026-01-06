"use client";
import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminOnly } from "@/components/AdminOnly";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Store,
  AlertTriangle,
  Loader2,
  MoreVertical,
  Upload,
} from "lucide-react";
import { useSenderShops } from "@/hooks/useSupabaseData";
import { uploadSenderShopImage } from "@/lib/supabase/storage";
import { toast } from "@/hooks/use-toast";
import DropdownMenu from "@/components/ui/dropdown-menu";
import type { Database } from "@/types/supabase";

type SenderShop = Database["public"]["Tables"]["sender_shops"]["Row"];

function SenderShops() {
  const {
    data: senderShops,
    loading,
    error,
    create,
    update,
    remove,
  } = useSenderShops();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingShop, setEditingShop] = useState<SenderShop | null>(null);
  const [deletingShopId, setDeletingShopId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  const filteredShops = useMemo(() => {
    if (!searchQuery.trim()) return senderShops;
    return senderShops.filter((shop) =>
      shop.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [senderShops, searchQuery]);

  const resetForm = () => {
    setFormData({ name: "", description: "", image: "" });
    setImageFile(null);
    setImagePreview("");
    setValidationErrors({});
    setEditingShop(null);
  };

  const handleAddClick = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditClick = (shop: SenderShop) => {
    setFormData({
      name: shop.name,
      description: shop.description || "",
      image: shop.image || "",
    });
    setImagePreview(shop.image || "");
    setEditingShop(shop);
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setValidationErrors({ name: "Shop name is required" });
      return;
    }

    setValidationErrors({});
    setIsSubmitting(true);

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        const tempId = editingShop?.id || `temp-${Date.now()}`;
        const uploadResult = await uploadSenderShopImage(imageFile, tempId);

        if (!uploadResult.success) {
          toast({
            title: "Image Upload Failed",
            description: uploadResult.error || "Failed to upload image",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        imageUrl = uploadResult.url || "";
      }

      const shopData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        image: imageUrl || null,
        status: "active" as const,
      };

      if (editingShop) {
        const updateResult = await update(editingShop.id, shopData);
        if (updateResult.success) {
          toast({
            title: "Success",
            description: "Sender shop updated successfully",
          });
          setIsModalOpen(false);
        } else {
          toast({
            title: "Error",
            description: updateResult.error || "Failed to update sender shop",
            variant: "destructive",
          });
        }
      } else {
        const createResult = await create(shopData);
        if (createResult.success) {
          toast({
            title: "Success",
            description: "Sender shop created successfully",
          });
          setIsModalOpen(false);
        } else {
          toast({
            title: "Error",
            description: createResult.error || "Failed to create sender shop",
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

  const handleDeleteClick = (shopId: string) => {
    setDeletingShopId(shopId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingShopId) {
      setIsSubmitting(true);
      const deleteResult = await remove(deletingShopId);
      if (deleteResult.success) {
        toast({
          title: "Success",
          description: "Sender shop deleted successfully",
        });
        setIsDeleteModalOpen(false);
        setDeletingShopId(null);
      } else {
        toast({
          title: "Error",
          description: deleteResult.error || "Failed to delete sender shop",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <AlertTriangle className="w-12 h-12 text-red-500" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        {!loading && !error && (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Sender Shops
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage sender shop locations with images ({senderShops.length}{" "}
                  total).
                </p>
              </div>
              <button
                onClick={handleAddClick}
                className="bg-gray-800 dark:bg-blue-700 text-white hover:shadow-lg transition-all gap-2 rounded-lg px-4 py-2 flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
                Add Sender Shop
              </button>
            </div>

            <div className="space-y-6">
              {filteredShops.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Store className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No sender shops found. Add your first shop to get started.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredShops.map((shop) => (
                    <Card
                      key={shop.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            {shop.image ? (
                              <img
                                src={shop.image}
                                alt={shop.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                                <Store className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                {shop.name}
                              </h3>
                              <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300 mt-1">
                                Active
                              </span>
                            </div>
                          </div>
                          <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                              <button className="p-2 rounded-md dark:bg-gray-700 hover:bg-gray-100 bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <MoreVertical className="w-4 h-4 dark:text-gray-200 text-gray-600" />
                              </button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                              <DropdownMenu.Item
                                onSelect={() => handleEditClick(shop)}
                                className="dark:text-gray-200"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>Edit</span>
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                onSelect={() => handleDeleteClick(shop.id)}
                                className="text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Root>
                        </div>
                        {shop.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {shop.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                  <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 shrink-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Store className="w-5 h-5 text-blue-600" />
                      {editingShop ? "Edit Sender Shop" : "Add Sender Shop"}
                    </h2>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Shop Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Shop name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white ${
                          validationErrors.name
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                      />
                      {validationErrors.name && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {validationErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Description
                      </label>
                      <textarea
                        placeholder="Shop description (optional)"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        rows={3}
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Shop Image
                      </label>
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview("");
                              setFormData((prev) => ({ ...prev, image: "" }));
                            }}
                            className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <Upload className="w-8 h-8 text-gray-400 mb-1" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Click to upload image
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800 shrink-0">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      disabled={isSubmitting}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : editingShop ? (
                        "Update"
                      ) : (
                        "Create"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md">
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      Confirm Deletion
                    </h2>
                    <button
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-400">
                      Are you sure you want to delete this sender shop? This
                      action cannot be undone.
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
                    <button
                      onClick={() => setIsDeleteModalOpen(false)}
                      disabled={isSubmitting}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function SenderShopsPage() {
  return (
    <AdminOnly>
      <SenderShops />
    </AdminOnly>
  );
}
