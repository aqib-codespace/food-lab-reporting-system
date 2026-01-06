"use client";
import { useState, useMemo, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  uploadSampleImage,
  deleteSampleImage,
} from "@/lib/supabase/employee-storage";
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
  Upload,
} from "lucide-react";
import { z } from "zod";
import { useSampleNames } from "@/hooks/useSupabaseData";
import { useToast } from "@/hooks/use-toast";
import DropdownMenu from "@/components/ui/dropdown-menu";

const sampleNameFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().optional(),
});

interface SampleName {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
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
    description: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    description?: string;
    image?: string;
  }>({});

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
      }
    },
  });

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    // if no local selected file but editingSample has image, set preview
    if (editingSample && editingSample.image) {
      setPreviewUrl(editingSample.image);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile, editingSample]);

  const handleAddClick = () => {
    setEditingSample(null);
    setFormData({ name: "", description: "" });
    setValidationErrors({});
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (sample: SampleName) => {
    setEditingSample(sample);
    setFormData({
      name: sample.name,
      description: sample.description || "",
    });
    setValidationErrors({});
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleSaveSample = async () => {
    const result = sampleNameFormSchema.safeParse(formData);

    if (!result.success) {
      const errors: { name?: string; description?: string } = {};
      result.error.issues.forEach((issue: z.ZodIssue) => {
        const field = issue.path[0] as "name" | "description";
        errors[field] = issue.message;
      });
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setIsSubmitting(true);

    try {
      // upload image if user selected one
      let imageUrl: string | null = editingSample?.image ?? null;

      if (selectedFile) {
        const identifier =
          editingSample?.id ?? `${formData.name}-${Date.now()}`;
        const uploadResult = await uploadSampleImage(selectedFile, identifier);
        if (!uploadResult.success) {
          toast({
            title: "Error",
            description: uploadResult.error || "Failed to upload image",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        imageUrl = uploadResult.url || null;

        // delete previous image if updating and had an image
        if (editingSample && editingSample.image) {
          try {
            await deleteSampleImage(editingSample.id || editingSample.name);
          } catch (err) {
            // non-fatal
            console.warn("Failed to delete old sample image:", err);
          }
        }
      }

      if (editingSample) {
        const updatePayload = { ...formData } as any;
        if (imageUrl) updatePayload.image = imageUrl;

        const updateResult = await update(editingSample.id, updatePayload);
        if (updateResult.success) {
          toast({
            title: "Success",
            description: "Sample name updated successfully",
          });
          setIsModalOpen(false);
          setSelectedFile(null);
          setPreviewUrl(null);
          setEditingSample(null);
          setValidationErrors({});
        } else {
          toast({
            title: "Error",
            description: updateResult.error || "Failed to update sample name",
            variant: "destructive",
          });
        }
      } else {
        const createPayload: any = {
          ...formData,
          status: "active",
        };
        if (imageUrl) createPayload.image = imageUrl;

        const createResult = await create(createPayload);
        if (createResult.success) {
          toast({
            title: "Success",
            description: "Sample name created successfully",
          });
          setIsModalOpen(false);
          setSelectedFile(null);
          setPreviewUrl(null);
          setValidationErrors({});
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

      // try to delete associated image from storage (non-fatal)
      try {
        const sampleToDelete = samples.find((s) => s.id === deletingSampleId);
        if (sampleToDelete && (sampleToDelete.image || sampleToDelete.name)) {
          await deleteSampleImage(sampleToDelete.id || sampleToDelete.name);
        }
      } catch (err) {
        console.warn("Failed to delete sample image (non-fatal):", err);
      }

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
        sample.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [samples, searchQuery]);

  // whether modal currently lacks an image (used to control submit state)
  const modalImageMissing = !previewUrl && !editingSample?.image;

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
                Manage sample names ({samples.length} total).
              </p>
            </div>
            <Button
              onClick={handleAddClick}
              className="bg-gray-800 dark:bg-blue-700 text-white hover:shadow-lg transition-all gap-2 rounded-lg px-4 py-2"
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
                      {sample.image ? (
                        <img
                          src={sample.image}
                          alt={sample.name}
                          className="w-20 h-20 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                          <TestTube2 className="w-6 h-6 text-blue-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {sample.name}
                        </h3>
                        <p className="text-xs  text-gray-700 mt-2 max-w-[150px] dark:text-gray-300  ">
                          {sample.description || "No description available."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <button className="p-2 rounded-md dark:bg-gray-700 hover:bg-gray-100 bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <MoreVertical className="w-4 h-4 dark:text-gray-100 text-gray-600" />
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DropdownMenu.Item
                            onSelect={() => handleEditClick(sample)}
                            className="dark:text-gray-200"
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
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
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

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
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
                      className={`w-full dark:text-gray-300 px-4 py-2.5 bg-white dark:bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
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

                  <div className="flex flex-col md:flex-row gap-4 mb-4 items-stretch">
                    <div className="md:w-1/2 h-56 flex-shrink-0">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Image <span className="text-red-500">*</span>
                      </label>

                      {previewUrl ? (
                        <div
                          onClick={() => open()}
                          role="button"
                          className="relative w-full h-48 md:h-56 rounded-lg overflow-hidden border bg-gray-50 dark:bg-gray-800 cursor-pointer"
                        >
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />

                          <button
                            aria-label="Remove image"
                            onClick={async (e) => {
                              e.stopPropagation();
                              // if the preview is from a freshly selected file
                              if (selectedFile) {
                                setSelectedFile(null);
                                setPreviewUrl(null);
                                setValidationErrors((s) => ({
                                  ...s,
                                  image: undefined,
                                }));
                                return;
                              }

                              // otherwise, delete from storage when editing
                              if (editingSample && editingSample.image) {
                                try {
                                  const del = await deleteSampleImage(
                                    editingSample.id || editingSample.name
                                  );
                                  if (del.success) {
                                    toast({
                                      title: "Success",
                                      description: "Image deleted from storage",
                                    });
                                    setPreviewUrl(null);
                                    setEditingSample({
                                      ...editingSample,
                                      image: null,
                                    });
                                    setValidationErrors((s) => ({
                                      ...s,
                                      image: "Image is required",
                                    }));
                                  } else {
                                    toast({
                                      title: "Error",
                                      description:
                                        del.error || "Could not delete image",
                                      variant: "destructive",
                                    });
                                  }
                                } catch (err) {
                                  toast({
                                    title: "Error",
                                    description: "Failed to delete image",
                                    variant: "destructive",
                                  });
                                }
                              }
                            }}
                            className="absolute top-2 right-2 bg-white/90 dark:bg-gray-700 p-1 rounded-full hover:bg-white"
                          >
                            <X className="w-4 h-4 text-gray-800 dark:text-white" />
                          </button>

                          <div className="absolute bottom-2 left-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                open();
                              }}
                              className="text-xs bg-white/80 dark:bg-gray-700 px-2 py-1 rounded"
                            >
                              Replace
                            </button>
                          </div>

                          {validationErrors.image && (
                            <p className="absolute bottom-2 right-2 text-xs text-red-600">
                              {validationErrors.image}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div
                          {...getRootProps()}
                          className={`w-full h-48 md:h-56 flex items-center justify-center px-4 bg-white dark:bg-gray-800 border border-dashed rounded-lg cursor-pointer text-center border-gray-300 dark:border-gray-700 ${
                            validationErrors.image ? "border-red-500" : ""
                          }`}
                        >
                          <input {...getInputProps()} />
                          <div className="flex flex-col items-center justify-center">
                            <Upload className="h-8 w-8 text-center mb-2  dark:text-gray-100 text-gray-800" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {isDragActive
                                ? "Drop the image here..."
                                : "Drag 'n' drop an image here, or click to select one"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="md:w-1/2 h-56">
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
                        className="w-full h-full px-4 dark:text-gray-300 dark:placeholder:text-gray-400 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex rounded-b-xl items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    variant="outline"
                    className="border-gray-300 dark:text-white border rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveSample}
                    disabled={isSubmitting || modalImageMissing}
                    className={`rounded-lg text-white ${
                      isSubmitting || modalImageMissing
                        ? "opacity-50 cursor-not-allowed bg-gray-500 dark:bg-blue-900"
                        : "bg-gray-800 dark:bg-blue-700"
                    }`}
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
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
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
                    className="border-gray-300 dark:text-white border rounded-lg"
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
