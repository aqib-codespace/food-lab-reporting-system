"use client";
import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
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
  Upload,
  Mail,
  Phone,
  User,
  FileSignature,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { employeeFormSchema } from "@/lib/validations/employee.schema";
import { z } from "zod";
import { useEmployees } from "@/hooks/useSupabaseData";
import { useToast } from "@/hooks/use-toast";
import {
  uploadEmployeePhoto,
  uploadEmployeeSignature,
} from "@/lib/supabase/employee-storage";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "analyst" | "technician" | "manager";
  initials: string;
  photo?: string | null;
  signature?: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export default function Employees() {
  const t = useTranslations("employees");
  const {
    data: employees,
    loading,
    error,
    create,
    update,
    remove,
  } = useEmployees();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "analyst" as "admin" | "analyst" | "technician" | "manager",
    photo: null as File | null,
    signature: null as File | null,
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    photo?: string;
    signature?: string;
  }>({});

  const onDropPhoto = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const {
    getRootProps: getPhotoRootProps,
    getInputProps: getPhotoInputProps,
    isDragActive: isPhotoDragActive,
  } = useDropzone({
    onDrop: onDropPhoto,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif"] },
    multiple: false,
  });

  const onDropSignature = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFormData((prev) => ({ ...prev, signature: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const {
    getRootProps: getSignatureRootProps,
    getInputProps: getSignatureInputProps,
    isDragActive: isSignatureDragActive,
  } = useDropzone({
    onDrop: onDropSignature,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif"] },
    multiple: false,
  });

  const generateInitials = (name: string) => {
    const words = name.trim().split(" ");
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const handleAddClick = () => {
    setEditingEmployee(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "analyst",
      photo: null,
      signature: null,
    });
    setPhotoPreview(null);
    setSignaturePreview(null);
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      photo: null,
      signature: null,
    });
    setPhotoPreview(employee.photo || null);
    setSignaturePreview(employee.signature || null);
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const handleSaveEmployee = async () => {
    const result = employeeFormSchema.safeParse({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      photo: photoPreview || "",
      signature: signaturePreview || "",
    });

    if (!result.success) {
      const errors: {
        name?: string;
        email?: string;
        phone?: string;
        role?: string;
        photo?: string;
        signature?: string;
      } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as
          | "name"
          | "email"
          | "phone"
          | "role"
          | "photo"
          | "signature";
        errors[field] = issue.message;
      });
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setIsSubmitting(true);

    try {
      let photoUrl: string | null = null;
      let signatureUrl: string | null = null;

      if (editingEmployee) {
        // UPDATING EXISTING EMPLOYEE

        // Upload new photo if provided
        if (formData.photo) {
          const photoResult = await uploadEmployeePhoto(
            formData.photo,
            editingEmployee.id
          );
          if (photoResult.success) {
            photoUrl = photoResult.url || null;
          } else {
            toast({
              title: "Warning",
              description: "Photo upload failed, keeping existing photo",
              variant: "destructive",
            });
            photoUrl = editingEmployee.photo || null;
          }
        } else {
          photoUrl = editingEmployee.photo || null;
        }

        // Upload new signature if provided
        if (formData.signature) {
          const signatureResult = await uploadEmployeeSignature(
            formData.signature,
            editingEmployee.id
          );
          if (signatureResult.success) {
            signatureUrl = signatureResult.url || null;
          } else {
            toast({
              title: "Warning",
              description:
                "Signature upload failed, keeping existing signature",
              variant: "destructive",
            });
            signatureUrl = editingEmployee.signature || null;
          }
        } else {
          signatureUrl = editingEmployee.signature || null;
        }

        // Update employee with all data
        const result = await update(editingEmployee.id, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          initials: generateInitials(formData.name),
          photo: photoUrl,
          signature: signatureUrl,
        });

        if (result.success) {
          toast({
            title: "Success",
            description: "Employee updated successfully",
          });
          setIsModalOpen(false);
          resetForm();
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update employee",
            variant: "destructive",
          });
        }
      } else {
        // CREATING NEW EMPLOYEE

        // Create employee first without images
        const result = await create({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          initials: generateInitials(formData.name),
          photo: null,
          signature: null,
          status: "active",
        });

        if (result.success && result.data) {
          const newEmployeeId = result.data.id;

          // Upload photo if provided
          if (formData.photo) {
            const photoResult = await uploadEmployeePhoto(
              formData.photo,
              newEmployeeId
            );
            if (photoResult.success) {
              photoUrl = photoResult.url || null;
            }
          }

          // Upload signature if provided
          if (formData.signature) {
            const signatureResult = await uploadEmployeeSignature(
              formData.signature,
              newEmployeeId
            );
            if (signatureResult.success) {
              signatureUrl = signatureResult.url || null;
            }
          }

          // Update employee with image URLs if any were uploaded
          if (photoUrl || signatureUrl) {
            await update(newEmployeeId, {
              photo: photoUrl,
              signature: signatureUrl,
            });
          }

          toast({
            title: "Success",
            description: "Employee created successfully",
          });
          setIsModalOpen(false);
          resetForm();
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to create employee",
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

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "analyst",
      photo: null,
      signature: null,
    });
    setPhotoPreview(null);
    setSignaturePreview(null);
    setEditingEmployee(null);
  };

  const handleDeleteClick = (employeeId: string) => {
    setDeletingEmployeeId(employeeId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingEmployeeId) {
      setIsSubmitting(true);
      const result = await remove(deletingEmployeeId);

      if (result.success) {
        toast({
          title: t("success", { ns: "common" }),
          description: t("successDeleted"),
        });
        setIsDeleteModalOpen(false);
        setDeletingEmployeeId(null);
      } else {
        toast({
          title: t("error", { ns: "common" }),
          description: result.error || t("errorDelete"),
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.phone.includes(searchQuery)
    );
  }, [employees, searchQuery]);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("subtitle")} ({employees.length} total)
          </p>
        </div>

        <Button
          onClick={handleAddClick}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("addEmployee")}
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400">
              {t("loadingError")}
            </p>
          </div>
        </div>
      )}

      {/* Data State */}
      {!loading && !error && (
        <>
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 z-10" />
                <Input
                  placeholder={t("searchEmployees")}
                  className="w-full pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((employee) => (
              <Card
                key={employee.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {employee.photo ? (
                      <img
                        src={employee.photo}
                        alt={employee.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold bg-accent/10 text-accent shrink-0">
                        {employee.initials}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {employee.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="flat"
                          className={`text-xs font-medium px-2 py-0.5 ${
                            employee.role === "admin"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                              : employee.role === "manager"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                              : employee.role === "analyst"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                              : "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
                          }`}
                        >
                          {employee.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate flex items-center gap-1 mt-1">
                        <Mail className="w-3 h-3" />
                        {employee.email}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3" />
                        {employee.phone}
                      </p>
                    </div>
                  </div>

                  {employee.signature && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                        <FileSignature className="w-3 h-3" />
                        Signature:
                      </p>
                      <img
                        src={employee.signature}
                        alt="Signature"
                        className="h-8 object-contain bg-gray-50 dark:bg-gray-800 rounded px-2 py-1"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                    <Badge
                      variant="flat"
                      color="success"
                      className="font-normal bg-green-100 px-2 py-1"
                    >
                      {employee.status}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditClick(employee)}
                        variant="outline"
                        size="sm"
                        className="gap-1 rounded-lg bg-blue-50 p-2 border-gray-300 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(employee.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-300 bg-red-50 p-2 rounded-lg dark:border-red-900 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  No employees found. Try adjusting your search.
                </p>
              </CardContent>
            </Card>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    {editingEmployee ? t("editEmployee") : t("addEmployee")}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("photo")} <span className="text-red-500">*</span>
                      </label>
                      {photoPreview ? (
                        <div className="relative w-full h-32 mx-auto">
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-full h-32 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-700"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPhotoPreview(null);
                              setFormData((prev) => ({ ...prev, photo: null }));
                            }}
                            className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          {...getPhotoRootProps()}
                          className={`w-full h-32 mx-auto border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                            isPhotoDragActive
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : validationErrors.photo
                              ? "border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20"
                              : "border-gray-300 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          <input {...getPhotoInputProps()} />
                          <Upload className="w-8 h-8 text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">
                            {t("uploadPhoto")}
                          </span>
                        </div>
                      )}
                      {validationErrors.photo && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {validationErrors.photo}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("signature")} <span className="text-red-500">*</span>
                      </label>
                      {signaturePreview ? (
                        <div className="relative w-full h-32 mx-auto">
                          <div className="w-full h-32 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center p-3">
                            <img
                              src={signaturePreview}
                              alt="Signature"
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSignaturePreview(null);
                              setFormData((prev) => ({
                                ...prev,
                                signature: null,
                              }));
                            }}
                            className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          {...getSignatureRootProps()}
                          className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                            isSignatureDragActive
                              ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                              : validationErrors.signature
                              ? "border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20"
                              : "border-gray-300 dark:border-gray-700 hover:border-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          <input {...getSignatureInputProps()} />
                          <FileSignature className="w-8 h-8 text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">
                            Upload Signature
                          </span>
                        </div>
                      )}
                      {validationErrors.signature && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {validationErrors.signature}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        {t("name")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder={t("namePlaceholder")}
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all ${
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          {t("email")} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            placeholder={t("emailPlaceholder")}
                            value={formData.email}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all ${
                              validationErrors.email
                                ? "border-red-500 dark:border-red-500"
                                : "border-gray-300 dark:border-gray-700"
                            }`}
                          />
                        </div>
                        {validationErrors.email && (
                          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {validationErrors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          {t("phone")} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            placeholder={t("phonePlaceholder")}
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all ${
                              validationErrors.phone
                                ? "border-red-500 dark:border-red-500"
                                : "border-gray-300 dark:border-gray-700"
                            }`}
                          />
                        </div>
                        {validationErrors.phone && (
                          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {validationErrors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        {t("role")} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            role: e.target.value as
                              | "admin"
                              | "analyst"
                              | "technician"
                              | "manager",
                          }))
                        }
                        className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white transition-all ${
                          validationErrors.role
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                      >
                        <option value="analyst">{t("analyst")}</option>
                        <option value="technician">{t("technician")}</option>
                        <option value="manager">{t("manager")}</option>
                        <option value="admin">{t("admin")}</option>
                      </select>
                      {validationErrors.role && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {validationErrors.role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    variant="outline"
                    className="border-gray-300 border rounded-lg dark:border-gray-700"
                  >
                    {t("cancel", { ns: "common" })}
                  </Button>
                  <Button
                    onClick={handleSaveEmployee}
                    disabled={isSubmitting}
                    className="bg-gray-800 rounded-lg text-white hover:shadow-lg transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {editingEmployee ? t("saving") : t("saving")}
                      </>
                    ) : (
                      <>
                        {editingEmployee
                          ? t("edit") + " " + t("title", { ns: "employees" })
                          : t("addEmployee")}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

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
                        Delete Employee
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        This action cannot be undone
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete this employee? All
                    associated data will be permanently removed.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <Button
                    onClick={() => setIsDeleteModalOpen(false)}
                    variant="outline"
                    className="border-gray-300 border rounded-lg dark:border-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmDelete}
                    disabled={isSubmitting}
                    className="bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Employee
                      </>
                    )}
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
