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
  MapPin,
  AlertTriangle,
  Thermometer,
  Loader2,
} from "lucide-react";
import { z } from "zod";
import { useStorageLocations } from "@/hooks/useSupabaseData";
import { useToast } from "@/hooks/use-toast";

const storageLocationFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  type: z.enum(["store", "fridge", "freezer", "room"]),
  code: z.string().optional(),
  capacity: z
    .number()
    .positive("Capacity must be positive")
    .optional()
    .or(z.literal(0)),
  temperature: z.string().optional(),
  description: z.string().optional(),
});

interface StorageLocation {
  id: string;
  name: string;
  type: "store" | "fridge" | "freezer" | "room";
  code?: string | null;
  capacity?: number | null;
  temperature?: string | null;
  description?: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

const TYPE_COLORS = {
  store: {
    bg: "bg-amber-100 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-300",
    icon: "text-amber-600",
  },
  fridge: {
    bg: "bg-blue-100 dark:bg-blue-900/20",
    text: "text-blue-700 dark:text-blue-300",
    icon: "text-blue-600",
  },
  freezer: {
    bg: "bg-cyan-100 dark:bg-cyan-900/20",
    text: "text-cyan-700 dark:text-cyan-300",
    icon: "text-cyan-600",
  },
  room: {
    bg: "bg-purple-100 dark:bg-purple-900/20",
    text: "text-purple-700 dark:text-purple-300",
    icon: "text-purple-600",
  },
};

export default function StorageLocations() {
  const {
    data: locations,
    loading,
    error,
    create,
    update,
    remove,
  } = useStorageLocations();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingLocation, setEditingLocation] =
    useState<StorageLocation | null>(null);
  const [deletingLocationId, setDeletingLocationId] = useState<string | null>(
    null
  );

  const [formData, setFormData] = useState({
    name: "",
    type: "store" as "store" | "fridge" | "freezer" | "room",
    code: "",
    capacity: 0,
    temperature: "",
    description: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    type?: string;
    code?: string;
    capacity?: string;
    temperature?: string;
    description?: string;
  }>({});

  const handleAddClick = () => {
    setEditingLocation(null);
    setFormData({
      name: "",
      type: "store",
      code: "",
      capacity: 0,
      temperature: "",
      description: "",
    });
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const handleEditClick = (location: StorageLocation) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      type: location.type,
      code: location.code || "",
      capacity: location.capacity || 0,
      temperature: location.temperature || "",
      description: location.description || "",
    });
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const handleSaveLocation = async () => {
    const result = storageLocationFormSchema.safeParse(formData);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue: z.ZodIssue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setIsSubmitting(true);

    try {
      if (editingLocation) {
        const updateResult = await update(editingLocation.id, formData);
        if (updateResult.success) {
          toast({
            title: "Success",
            description: "Storage location updated successfully",
          });
          setIsModalOpen(false);
        } else {
          toast({
            title: "Error",
            description:
              updateResult.error || "Failed to update storage location",
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
            description: "Storage location created successfully",
          });
          setIsModalOpen(false);
        } else {
          toast({
            title: "Error",
            description:
              createResult.error || "Failed to create storage location",
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

  const handleDeleteClick = (locationId: string) => {
    setDeletingLocationId(locationId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingLocationId) {
      setIsSubmitting(true);
      const deleteResult = await remove(deletingLocationId);
      if (deleteResult.success) {
        toast({
          title: "Success",
          description: "Storage location deleted successfully",
        });
        setIsDeleteModalOpen(false);
        setDeletingLocationId(null);
      } else {
        toast({
          title: "Error",
          description:
            deleteResult.error || "Failed to delete storage location",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    }
  };

  const filteredLocations = useMemo(() => {
    return locations.filter(
      (location) =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [locations, searchQuery]);

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
                Storage Locations
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage storage locations for samples and materials (
                {locations.length} total).
              </p>
            </div>
            <Button
              onClick={handleAddClick}
              className="bg-gray-800 text-white hover:shadow-lg transition-all gap-2 rounded-lg px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              Add Storage Location
            </Button>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 z-10" />
                <Input
                  placeholder="Search storage locations..."
                  className="w-full pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocations.map((location) => {
              const colors = TYPE_COLORS[location.type];
              return (
                <Card
                  key={location.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}
                      >
                        <MapPin className={`w-6 h-6 ${colors.icon}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {location.name}
                        </h3>
                        {location.code && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Code: {location.code}
                          </p>
                        )}
                        <Badge
                          variant="flat"
                          className={`${colors.bg} ${colors.text} text-xs px-4  mt-2`}
                        >
                          {location.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      {location.temperature && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Thermometer className="w-4 h-4" />
                          <span>{location.temperature}</span>
                        </div>
                      )}
                      {location.capacity && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Capacity: {location.capacity} units
                        </p>
                      )}
                      {location.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {location.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
                      <Badge
                        variant="flat"
                        color="success"
                        className="font-normal bg-green-100 px-2 py-1"
                      >
                        {location.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditClick(location)}
                          variant="outline"
                          size="sm"
                          className="gap-1 rounded-lg bg-blue-50 p-2 border-gray-300 dark:border-gray-700 hover:bg-blue-100"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(location.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-300 bg-red-50 p-2 rounded-lg text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredLocations.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  No storage locations found. Try adjusting your search.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Add/Edit Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0 bg-white dark:bg-gray-900">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    {editingLocation
                      ? "Edit Storage Location"
                      : "Add Storage Location"}
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
                      Location Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Main Refrigerator A"
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
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          type: e.target.value as
                            | "store"
                            | "fridge"
                            | "freezer"
                            | "room",
                        }))
                      }
                      className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        validationErrors.type
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                    >
                      <option value="store">Store</option>
                      <option value="fridge">Fridge</option>
                      <option value="freezer">Freezer</option>
                      <option value="room">Room</option>
                    </select>
                    {validationErrors.type && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {validationErrors.type}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Code
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., FRG-A"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            code: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Capacity (units)
                      </label>
                      <input
                        type="number"
                        placeholder="100"
                        value={formData.capacity || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            capacity: Number(e.target.value),
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Temperature Range
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 2-8°C"
                      value={formData.temperature}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          temperature: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Description
                    </label>
                    <textarea
                      placeholder="Location description (optional)"
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

                <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    variant="outline"
                    className="border-gray-300 border rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveLocation}
                    className="bg-gray-800 rounded-lg text-white"
                  >
                    {editingLocation ? "Update" : "Add"} Storage Location
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
                        Delete Storage Location
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        This action cannot be undone
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete this storage location? All
                    associated data will be permanently removed.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
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
                    Delete Storage Location
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
