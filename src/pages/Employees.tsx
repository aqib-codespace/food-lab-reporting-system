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
  Mail,
  Phone,
  User,
  FileSignature,
  AlertTriangle,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { employeeFormSchema } from "@/lib/validations/employee.schema";
import { z } from "zod";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  initials: string;
  color: string;
  photo?: string;
  signature?: string;
  status: "active" | "inactive";
  createdAt: Date;
}

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "1",
    name: "Sara",
    email: "sara@foodlab.com",
    phone: "+1 234 567 8900",
    initials: "SA",
    color: "#10b981",
    status: "active",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Mohammed",
    email: "mohammed@foodlab.com",
    phone: "+1 234 567 8901",
    initials: "MH",
    color: "#8b5cf6",
    status: "active",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "3",
    name: "Fatima",
    email: "fatima@foodlab.com",
    phone: "+1 234 567 8902",
    initials: "FN",
    color: "#f59e0b",
    status: "active",
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "4",
    name: "Omar",
    email: "omar@foodlab.com",
    phone: "+1 234 567 8903",
    initials: "OR",
    color: "#ef4444",
    status: "active",
    createdAt: new Date("2024-04-05"),
  },
  {
    id: "5",
    name: "Layla",
    email: "layla@foodlab.com",
    phone: "+1 234 567 8904",
    initials: "LI",
    color: "#ec4899",
    status: "active",
    createdAt: new Date("2024-05-12"),
  },
];

const RANDOM_COLORS = [
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#3b82f6",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#6366f1",
];

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<string | null>(
    null
  );

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    photo: null as File | null,
    signature: null as File | null,
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    photo?: string;
    signature?: string;
  }>({});

  // Photo dropzone
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

  // Signature dropzone
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

  // Generate initials from name
  const generateInitials = (name: string) => {
    const words = name.trim().split(" ");
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  // Generate random color
  const getRandomColor = () => {
    return RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)];
  };

  // Open modal for adding
  const handleAddClick = () => {
    setEditingEmployee(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      photo: null,
      signature: null,
    });
    setPhotoPreview(null);
    setSignaturePreview(null);
    setValidationErrors({});
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      photo: null,
      signature: null,
    });
    setPhotoPreview(employee.photo || null);
    setSignaturePreview(employee.signature || null);
    setValidationErrors({});
    setIsModalOpen(true);
  };

  // Save employee (add or edit)
  const handleSaveEmployee = () => {
    // Validate using Zod
    const result = employeeFormSchema.safeParse({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      photo: photoPreview || "",
      signature: signaturePreview || "",
    });

    if (!result.success) {
      // Extract errors and set them in state
      const errors: {
        name?: string;
        email?: string;
        phone?: string;
        photo?: string;
        signature?: string;
      } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as
          | "name"
          | "email"
          | "phone"
          | "photo"
          | "signature";
        errors[field] = issue.message;
      });
      setValidationErrors(errors);
      return;
    }

    // Clear validation errors on success
    setValidationErrors({});

    if (editingEmployee) {
      // Edit existing employee
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingEmployee.id
            ? {
                ...emp,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                initials: generateInitials(formData.name),
                photo: photoPreview || emp.photo,
                signature: signaturePreview || emp.signature,
              }
            : emp
        )
      );
    } else {
      // Add new employee
      const newEmployee: Employee = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        initials: generateInitials(formData.name),
        color: getRandomColor(),
        photo: photoPreview || undefined,
        signature: signaturePreview || undefined,
        status: "active",
        createdAt: new Date(),
      };
      setEmployees((prev) => [newEmployee, ...prev]);
    }

    setIsModalOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      photo: null,
      signature: null,
    });
    setPhotoPreview(null);
    setSignaturePreview(null);
  };

  // Open delete confirmation
  const handleDeleteClick = (employeeId: string) => {
    setDeletingEmployeeId(employeeId);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (deletingEmployeeId) {
      setEmployees((prev) =>
        prev.filter((emp) => emp.id !== deletingEmployeeId)
      );
      setIsDeleteModalOpen(false);
      setDeletingEmployeeId(null);
    }
  };

  // Filter employees
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
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Employees
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage employees for report generation ({employees.length} total).
          </p>
        </div>
        <Button
          onClick={handleAddClick}
          className="bg-linear-to-r from-blue-600 to-teal-500 text-white hover:shadow-lg transition-all gap-2 rounded-lg px-4 py-2"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 z-10" />
            <Input
              placeholder="Search employees..."
              className="w-full pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                {employee.photo ? (
                  <img
                    src={employee.photo}
                    alt={employee.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0"
                    style={{ backgroundColor: employee.color }}
                  >
                    {employee.initials}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {employee.name}
                  </h3>
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                {editingEmployee ? "Edit Employee" : "Add New Employee"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Photo and Signature Upload Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Employee Photo <span className="text-red-500">*</span>
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
                        Upload Photo
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

                {/* Signature Upload */}
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
                          setFormData((prev) => ({ ...prev, signature: null }));
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
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
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
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        placeholder="john@foodlab.com"
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

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="+1 234 567 8900"
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
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="outline"
                className="border-gray-300 border rounded-lg dark:border-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEmployee}
                className="bg-linear-to-r from-blue-600 to-teal-500 rounded-lg text-white hover:shadow-lg transition-all"
              >
                {editingEmployee ? "Update Employee" : "Add Employee"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
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

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this employee? All associated
                data will be permanently removed.
              </p>
            </div>

            {/* Modal Footer */}
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
                className="bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg transition-all"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Employee
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
