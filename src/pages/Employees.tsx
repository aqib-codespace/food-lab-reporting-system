"use client";
import { useState, useMemo, useCallback } from "react";
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
  User,
  FileSignature,
  AlertTriangle,
  Loader2,
  MoreVertical,
  Briefcase,
  UserPlus,
  Shield,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import {
  employeeFormSchema,
  roleFormSchema,
} from "@/lib/validations/employee.schema";
import { z } from "zod";
import { useEmployees, useRoles } from "@/hooks/useSupabaseData";
import { useToast } from "@/hooks/use-toast";
import DropdownMenu from "@/components/ui/dropdown-menu";
import {
  uploadEmployeePhoto,
  uploadEmployeeSignature,
} from "@/lib/supabase/employee-storage";

interface Employee {
  id: string;
  name: string;
  role_id: string | null;
  initials: string;
  photo?: string | null;
  signature?: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

interface Role {
  id: string;
  name: string;
  description: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export default function Employees() {
  const {
    data: employees,
    loading: employeesLoading,
    error: employeesError,
    create: createEmployee,
    update: updateEmployee,
    remove: removeEmployee,
  } = useEmployees();

  const {
    data: roles,
    loading: rolesLoading,
    error: rolesError,
    create: createRole,
    update: updateRole,
    remove: removeRole,
  } = useRoles();

  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteEmployeeModalOpen, setIsDeleteEmployeeModalOpen] =
    useState(false);
  const [isDeleteRoleModalOpen, setIsDeleteRoleModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<string | null>(
    null
  );
  const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Employee Form state
  const [employeeFormData, setEmployeeFormData] = useState({
    name: "",
    role_id: "",
    photo: null as File | null,
    signature: null as File | null,
  });

  // Role Form state
  const [roleFormData, setRoleFormData] = useState({
    name: "",
    description: "",
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [employeeValidationErrors, setEmployeeValidationErrors] = useState<{
    name?: string;
    role_id?: string;
    photo?: string;
    signature?: string;
  }>({});
  const [roleValidationErrors, setRoleValidationErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  const onDropPhoto = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setEmployeeFormData((prev) => ({ ...prev, photo: file }));
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
      setEmployeeFormData((prev) => ({ ...prev, signature: file }));
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

  // Employee Handlers
  const handleAddEmployeeClick = () => {
    setEditingEmployee(null);
    setEmployeeFormData({
      name: "",
      role_id: "",
      photo: null,
      signature: null,
    });
    setPhotoPreview(null);
    setSignaturePreview(null);
    setEmployeeValidationErrors({});
    setIsEmployeeModalOpen(true);
  };

  const handleEditEmployeeClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setEmployeeFormData({
      name: employee.name,
      role_id: employee.role_id || "",
      photo: null,
      signature: null,
    });
    setPhotoPreview(employee.photo || null);
    setSignaturePreview(employee.signature || null);
    setEmployeeValidationErrors({});
    setIsEmployeeModalOpen(true);
  };

  const handleSaveEmployee = async () => {
    const result = employeeFormSchema.safeParse({
      name: employeeFormData.name,
      role_id: employeeFormData.role_id,
      photo: photoPreview || "",
      signature: signaturePreview || "",
    });

    if (!result.success) {
      const errors: {
        name?: string;
        role_id?: string;
        photo?: string;
        signature?: string;
      } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as
          | "name"
          | "role_id"
          | "photo"
          | "signature";
        errors[field] = issue.message;
      });
      setEmployeeValidationErrors(errors);
      return;
    }

    setEmployeeValidationErrors({});
    setIsSubmitting(true);

    try {
      let photoUrl: string | null = null;
      let signatureUrl: string | null = null;

      if (editingEmployee) {
        // UPDATING EXISTING EMPLOYEE
        if (employeeFormData.photo) {
          const photoResult = await uploadEmployeePhoto(
            employeeFormData.photo,
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

        if (employeeFormData.signature) {
          const signatureResult = await uploadEmployeeSignature(
            employeeFormData.signature,
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

        const result = await updateEmployee(editingEmployee.id, {
          name: employeeFormData.name,
          role_id: employeeFormData.role_id || null,
          initials: generateInitials(employeeFormData.name),
          photo: photoUrl,
          signature: signatureUrl,
        });

        if (result.success) {
          toast({
            title: "Success",
            description: "Employee updated successfully",
          });
          setIsEmployeeModalOpen(false);
          resetEmployeeForm();
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update employee",
            variant: "destructive",
          });
        }
      } else {
        // CREATING NEW EMPLOYEE
        const result = await createEmployee({
          name: employeeFormData.name,
          role_id: employeeFormData.role_id || null,
          initials: generateInitials(employeeFormData.name),
          photo: null,
          signature: null,
          status: "active",
        });

        if (result.success && result.data) {
          const newEmployeeId = result.data.id;

          if (employeeFormData.photo) {
            const photoResult = await uploadEmployeePhoto(
              employeeFormData.photo,
              newEmployeeId
            );
            if (photoResult.success) {
              photoUrl = photoResult.url || null;
            }
          }

          if (employeeFormData.signature) {
            const signatureResult = await uploadEmployeeSignature(
              employeeFormData.signature,
              newEmployeeId
            );
            if (signatureResult.success) {
              signatureUrl = signatureResult.url || null;
            }
          }

          if (photoUrl || signatureUrl) {
            await updateEmployee(newEmployeeId, {
              photo: photoUrl,
              signature: signatureUrl,
            });
          }

          toast({
            title: "Success",
            description: "Employee created successfully",
          });
          setIsEmployeeModalOpen(false);
          resetEmployeeForm();
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

  const resetEmployeeForm = () => {
    setEmployeeFormData({
      name: "",
      role_id: "",
      photo: null,
      signature: null,
    });
    setPhotoPreview(null);
    setSignaturePreview(null);
    setEditingEmployee(null);
  };

  const handleDeleteEmployeeClick = (employeeId: string) => {
    setDeletingEmployeeId(employeeId);
    setIsDeleteEmployeeModalOpen(true);
  };

  const handleConfirmDeleteEmployee = async () => {
    if (deletingEmployeeId) {
      setIsSubmitting(true);
      const result = await removeEmployee(deletingEmployeeId);

      if (result.success) {
        toast({
          title: "Success",
          description: "Employee deleted successfully",
        });
        setIsDeleteEmployeeModalOpen(false);
        setDeletingEmployeeId(null);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete employee",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    }
  };

  // Role Handlers
  const handleAddRoleClick = () => {
    setEditingRole(null);
    setRoleFormData({
      name: "",
      description: "",
    });
    setRoleValidationErrors({});
    setIsRoleModalOpen(true);
  };

  const handleEditRoleClick = (role: Role) => {
    setEditingRole(role);
    setRoleFormData({
      name: role.name,
      description: role.description || "",
    });
    setRoleValidationErrors({});
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = async () => {
    const result = roleFormSchema.safeParse(roleFormData);

    if (!result.success) {
      const errors: {
        name?: string;
        description?: string;
      } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as "name" | "description";
        errors[field] = issue.message;
      });
      setRoleValidationErrors(errors);
      return;
    }

    setRoleValidationErrors({});
    setIsSubmitting(true);

    try {
      if (editingRole) {
        const result = await updateRole(editingRole.id, {
          name: roleFormData.name,
          description: roleFormData.description || null,
        });

        if (result.success) {
          toast({
            title: "Success",
            description: "Role updated successfully",
          });
          setIsRoleModalOpen(false);
          resetRoleForm();
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update role",
            variant: "destructive",
          });
        }
      } else {
        const result = await createRole({
          name: roleFormData.name,
          description: roleFormData.description || null,
          status: "active",
        });

        if (result.success) {
          toast({
            title: "Success",
            description: "Role created successfully",
          });
          setIsRoleModalOpen(false);
          resetRoleForm();
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to create role",
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

  const resetRoleForm = () => {
    setRoleFormData({
      name: "",
      description: "",
    });
    setEditingRole(null);
  };

  const handleDeleteRoleClick = (roleId: string) => {
    setDeletingRoleId(roleId);
    setIsDeleteRoleModalOpen(true);
  };

  const handleConfirmDeleteRole = async () => {
    if (deletingRoleId) {
      setIsSubmitting(true);
      const result = await removeRole(deletingRoleId);

      if (result.success) {
        toast({
          title: "Success",
          description: "Role deleted successfully",
        });
        setIsDeleteRoleModalOpen(false);
        setDeletingRoleId(null);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete role",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [employees, searchQuery]);

  const getRoleNameById = (roleId: string | null) => {
    if (!roleId) return "No Role";
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : "Unknown Role";
  };

  const loading = employeesLoading || rolesLoading;
  const error = employeesError || rolesError;

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Employee Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage lab personnel and roles ({employees.length} employees,{" "}
            {roles.length} roles)
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleAddRoleClick}
            className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 rounded-lg text-white"
          >
            <Shield className="w-4 h-4 mr-2" />
            Add Role
          </Button>
          <Button
            onClick={handleAddEmployeeClick}
            className="bg-gray-800 dark:bg-blue-700 hover:bg-gray-900 rounded-lg text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400">
              Failed to load data. Please try again.
            </p>
          </div>
        </div>
      )}

      {/* Data State */}
      {!loading && !error && (
        <>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Employees
              </h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map((employee) => (
                <Card
                  key={employee.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4 flex-1">
                        {employee.photo ? (
                          <img
                            src={employee.photo}
                            alt={employee.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-blue-200 dark:border-blue-700"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold bg-linear-to-br from-blue-500 to-purple-600 text-white shrink-0">
                            {employee.initials}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate text-lg">
                            {employee.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant="flat"
                              className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                            >
                              <Briefcase className="w-3 h-3 mr-1 inline" />
                              {getRoleNameById(employee.role_id)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <button className="p-2 rounded-md dark:text-white dark:bg-gray-800 hover:bg-gray-100 bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <MoreVertical className="w-4 h-4 dark:text-gray-100 text-gray-600" />
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DropdownMenu.Item
                            className="dark:text-gray-200"
                            onSelect={() => handleEditEmployeeClick(employee)}
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            onSelect={() =>
                              handleDeleteEmployeeClick(employee.id)
                            }
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </div>

                    {employee.signature && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                          <FileSignature className="w-3 h-3" />
                          Digital Signature
                        </p>
                        <img
                          src={employee.signature}
                          alt="Signature"
                          className="w-full h-16 object-contain bg-gray-50 dark:bg-gray-800 rounded px-2 py-1"
                        />
                      </div>
                    )}
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
          </div>

          {/* Roles Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Organization Roles
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {roles.length} roles available
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {roles.map((role) => {
                const employeeCount = employees.filter(
                  (emp) => emp.role_id === role.id
                ).length;

                return (
                  <Card
                    key={role.id}
                    className="hover:shadow-lg transition-all  group"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-gray-500 to-black flex items-center justify-center text-white font-bold">
                            {role.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                              {role.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {employeeCount}{" "}
                              {employeeCount === 1 ? "person" : "people"}
                            </p>
                          </div>
                        </div>

                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger>
                            <button className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity dark:text-white dark:bg-gray-800 hover:bg-gray-100 bg-gray-50 dark:hover:bg-gray-700">
                              <MoreVertical className="w-3.5 h-3.5 dark:text-gray-100 text-gray-600" />
                            </button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            <DropdownMenu.Item
                              className="dark:text-gray-200"
                              onSelect={() => handleEditRoleClick(role)}
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              onSelect={() => handleDeleteRoleClick(role.id)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                      </div>

                      {role.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {role.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {roles.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No roles defined yet. Add roles to organize your team.
                  </p>
                  <Button
                    onClick={handleAddRoleClick}
                    className="bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Role
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Employee Modal */}
          {isEmployeeModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    {editingEmployee ? "Edit Employee" : "Add Employee"}
                  </h2>
                  <button
                    onClick={() => setIsEmployeeModalOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Photo <span className="text-red-500">*</span>
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
                              setEmployeeFormData((prev) => ({
                                ...prev,
                                photo: null,
                              }));
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
                              : employeeValidationErrors.photo
                              ? "border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20"
                              : "border-gray-300 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          <input {...getPhotoInputProps()} />
                          <Upload className="w-8 h-8 text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">
                            Drop photo here or click to upload
                          </span>
                        </div>
                      )}
                      {employeeValidationErrors.photo && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {employeeValidationErrors.photo}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Signature <span className="text-red-500">*</span>
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
                              setEmployeeFormData((prev) => ({
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
                              : employeeValidationErrors.signature
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
                      {employeeValidationErrors.signature && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {employeeValidationErrors.signature}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={employeeFormData.name}
                        onChange={(e) =>
                          setEmployeeFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all ${
                          employeeValidationErrors.name
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                      />
                      {employeeValidationErrors.name && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {employeeValidationErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Role <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={employeeFormData.role_id}
                        onChange={(e) =>
                          setEmployeeFormData((prev) => ({
                            ...prev,
                            role_id: e.target.value,
                          }))
                        }
                        className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white transition-all ${
                          employeeValidationErrors.role_id
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                      >
                        <option value="">Select a role</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                      {employeeValidationErrors.role_id && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {employeeValidationErrors.role_id}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center rounded-b-xl justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <Button
                    onClick={() => setIsEmployeeModalOpen(false)}
                    variant="outline"
                    className="border-gray-300 dark:text-white border rounded-lg dark:border-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEmployee}
                    disabled={isSubmitting}
                    className="bg-gray-800 dark:bg-blue-700 rounded-lg text-white hover:shadow-lg transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {editingEmployee ? "Update Employee" : "Add Employee"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Role Modal */}
          {isRoleModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    {editingRole ? "Edit Role" : "Add Role"}
                  </h2>
                  <button
                    onClick={() => setIsRoleModalOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Role Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Senior Expert, Technician"
                      value={roleFormData.name}
                      onChange={(e) =>
                        setRoleFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all ${
                        roleValidationErrors.name
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                    />
                    {roleValidationErrors.name && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {roleValidationErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Description (Optional)
                    </label>
                    <textarea
                      placeholder="Describe the responsibilities and duties of this role..."
                      value={roleFormData.description}
                      onChange={(e) =>
                        setRoleFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center rounded-b-xl justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <Button
                    onClick={() => setIsRoleModalOpen(false)}
                    variant="outline"
                    className="border-gray-300 dark:text-white border rounded-lg dark:border-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveRole}
                    disabled={isSubmitting}
                    className="bg-blue-600 dark:bg-blue-700 rounded-lg text-white hover:shadow-lg transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>{editingRole ? "Update Role" : "Add Role"}</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isDeleteEmployeeModalOpen && (
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

                <div className="flex rounded-b-xl items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <Button
                    onClick={() => setIsDeleteEmployeeModalOpen(false)}
                    variant="outline"
                    className="border-gray-300 dark:text-white border rounded-lg dark:border-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmDeleteEmployee}
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

          {/* Delete Role Modal */}
          {isDeleteRoleModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Delete Role
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        This action cannot be undone
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete this role? Employees
                    assigned to this role will have no role assigned.
                  </p>
                </div>

                <div className="flex rounded-b-xl items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <Button
                    onClick={() => setIsDeleteRoleModalOpen(false)}
                    variant="outline"
                    className="border-gray-300 dark:text-white border rounded-lg dark:border-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmDeleteRole}
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
                        Delete Role
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
