"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BookOpen,
  PlayCircle,
  Users,
  FileText,
  Download,
  Settings,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Package,
  BarChart3,
  Shield,
  Plus,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Documentation() {
  return (
    <div className="w-full mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
          Documentation
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
          Everything you need to know about using the Food Lab Reporting System
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="w-full ">
        <TabsList className="flex gap-1 overflow-x-auto overflow-y-hidden scrollbar-thin-light p-2 sm:grid sm:grid-cols-3 lg:grid-cols-7">
          <TabsTrigger
            value="overview"
            className="gap-2 min-w-[120px] sm:min-w-0"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="getting-started"
            className="gap-2 min-w-[120px] sm:min-w-0"
          >
            <PlayCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Getting Started</span>
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="gap-2 min-w-[120px] sm:min-w-0"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Cases</span>
          </TabsTrigger>

          <TabsTrigger
            value="employees"
            className="gap-2 min-w-[120px] sm:min-w-0"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Employees</span>
          </TabsTrigger>
          <TabsTrigger
            value="export"
            className="gap-2 min-w-[120px] sm:min-w-0"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                What is Food Lab Reporting System?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                The Food Lab Reporting System is a modern, enterprise-grade web
                application designed to streamline food testing laboratory
                operations. The system uses a two-team workflow: the Opening
                Team handles initial sample intake and container processing,
                while the Examination Team conducts detailed examinations and
                finalizes reports. With role-based access control, master data
                management, and professional export capabilities, this system
                ensures efficient laboratory operations.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <FeatureCard
                  icon={<Users className="w-6 h-6" />}
                  title="Two-Team Workflow"
                  description="Opening Team and Examination Team collaborate for efficient processing"
                  color="green"
                />
                <FeatureCard
                  icon={<FileText className="w-6 h-6" />}
                  title="Create Reports"
                  description="Generate detailed food lab reports with comprehensive sample tracking"
                  color="blue"
                />

                <FeatureCard
                  icon={<BarChart3 className="w-6 h-6" />}
                  title="Master Data"
                  description="Centralized management of employees, containers, and sample types"
                  color="purple"
                />
                <FeatureCard
                  icon={<Download className="w-6 h-6" />}
                  title="Export Reports"
                  description="Download reports as PDF or Word documents with signatures"
                  color="amber"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Key Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <BenefitItem text="Two-team workflow for efficient laboratory operations" />
                <BenefitItem text="Role-based access control (Admin, Opener, Examiner)" />
                <BenefitItem text="Master data management for standardization" />
                <BenefitItem text="Professional reports with digital signatures" />
                <BenefitItem text="Supabase-powered real-time data storage" />
                <BenefitItem text="Secure JWT-based authentication" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Getting Started Tab */}
        <TabsContent value="getting-started" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-blue-600" />
                Getting Started Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700 dark:text-gray-300">
                Follow these simple steps to start using the Food Lab Reporting
                System:
              </p>

              <StepCard
                number="1"
                title="Login and Access Dashboard"
                description="Log in with your credentials. Your role (Admin, Opener, or Examiner) determines which features you can access."
                tips={[
                  "View total cases and samples on the dashboard",
                  "Access opening team or examination team views based on your role",
                  "Admins can manage master data and employees",
                ]}
              />

              <StepCard
                number="2"
                title="Opening Team - Initial Processing"
                description="The Opening Team handles the initial intake of samples and containers."
                tips={[
                  "Click 'Opening Team' in the sidebar",
                  "Enter system case number and barcode information",
                  "Record external and internal containers",
                  "Add sample details with weights and storage locations",
                ]}
              />

              <StepCard
                number="3"
                title="Examination Team - Finalize Reports"
                description="The Examination Team reviews and completes the reports with examination details."
                tips={[
                  "Access reports through 'Examination Team' view",
                  "Review sample information and add examination notes",
                  "Select the examining employee for signature inclusion",
                  "Verify all data before finalizing",
                ]}
              />

              <StepCard
                number="4"
                title="Preview and Save"
                description="Before saving, preview your report to ensure all information is correct."
                tips={[
                  "Click 'Preview' to see how the report will look",
                  "Make any necessary corrections",
                  "Click 'Save Report' to store it in the system",
                ]}
              />

              <StepCard
                number="5"
                title="Export Professional Reports"
                description="Once saved, export your reports in PDF or Word format with employee signatures."
                tips={[
                  "Navigate to the examination team view to find completed reports",
                  "Click on any report to view full details",
                  "Use export buttons for PDF (read-only) or Word (editable)",
                  "Employee signatures are automatically included in exports",
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Managing Cases
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Section
                title="Creating a New Case"
                icon={<Plus className="w-5 h-5 text-green-600" />}
              >
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  To create a new case, follow these sections:
                </p>
                <div className="space-y-3">
                  <InfoBox
                    title="Basic Information"
                    items={[
                      "System Case Number: Unique identifier for tracking the case",
                      "Barcode Number: Barcode tracking number for sample identification",
                      "Bag Number: Optional bag identification number",
                      "Dispatch Number: Dispatch tracking number",
                      "Date Received: When samples were received by the department",
                      "System Registration Date: Date of system registration",
                    ]}
                  />
                  <InfoBox
                    title="Container Details"
                    items={[
                      "External Containers: What packaging did the samples arrive in?",
                      "Internal Containers: How are samples stored in the lab?",
                      "Sender Shop: Where did the samples come from?",
                    ]}
                  />
                  <InfoBox
                    title="Sample Information"
                    items={[
                      "Add multiple samples using the '+ Add Sample' button",
                      "Each sample can have its own properties and measurements",
                      "Use color codes to quickly identify different samples",
                    ]}
                  />
                </div>
              </Section>

              <Section
                title="Viewing and Managing Cases"
                icon={<Eye className="w-5 h-5 text-purple-600" />}
              >
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Cases can be accessed through the Opening Team and Examination
                  Team views:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      Opening Team view shows all cases for initial processing
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      Examination Team view displays cases ready for examination
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      Use search and filter options to find specific cases
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      Click on any case to view complete details including all
                      samples
                    </span>
                  </li>
                </ul>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employees Tab */}
        <TabsContent value="employees" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Employee Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700 dark:text-gray-300">
                Employee management is available to administrators only. This
                section allows you to manage laboratory staff, assign roles, and
                maintain digital signatures for official documents.
              </p>

              <Section title="About Employee Profiles">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Each employee in the system has a comprehensive profile that
                  includes:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Basic Information
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                        Full Name
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                        System Role (Admin/Opener/Examiner/User)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                        Initials
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                        Active/Inactive Status
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Digital Assets
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                        Profile Photo (Optional)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                        Digital Signature (Required)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                        Supabase Storage Integration
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                        Automatic Export Inclusion
                      </li>
                    </ul>
                  </div>
                </div>
              </Section>

              <Section title="User Roles">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  The system uses role-based access control with four distinct
                  roles:
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <p className="font-medium text-purple-900 dark:text-purple-300">
                      Admin
                    </p>
                    <p className="text-sm text-purple-800 dark:text-purple-400 mt-1">
                      Full system access including master data management
                      (employees, container types, sample names, sender shops)
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="font-medium text-blue-900 dark:text-blue-300">
                      Examiner
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-400 mt-1">
                      Examination Team access for sample examination and report
                      finalization
                    </p>
                  </div>
                </div>
              </Section>

              <Section title="Assigning Employees to Reports">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  When creating a report, you need to assign an examiner:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Select from Dropdown
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click the employee dropdown in the report form to see
                        all active employees
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        View Employee Details
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Each employee shows their name, role, and initials for
                        easy identification
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Digital Signature Inclusion
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        The selected employee's digital signature will
                        automatically appear on exported PDF and Word documents
                      </p>
                    </div>
                  </div>
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                Exporting Cases
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Section title="Export Formats">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  You can export your cases in two professional formats:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <ExportFormatCard
                    format="PDF"
                    icon="📄"
                    features={[
                      "Professional Arabic formatting with right-to-left text",
                      "Cannot be edited (preserves report integrity)",
                      "Includes employee digital signatures automatically",
                      "Perfect for official documentation and compliance",
                      "Generated using jsPDF library",
                      "Print-ready A4 format",
                    ]}
                    useCases={[
                      "Official report submissions to authorities",
                      "Client deliverables and final reports",
                      "Archive copies for records",
                      "Regulatory compliance documentation",
                    ]}
                  />
                  <ExportFormatCard
                    format="Word Document"
                    icon="📝"
                    features={[
                      "Fully editable .docx format",
                      "Professional table formatting with Arabic support",
                      "Compatible with Microsoft Word and LibreOffice",
                      "Includes employee signatures in document",
                      "Easy to customize and add annotations",
                      "Generated using docx library",
                    ]}
                    useCases={[
                      "Draft reports needing revisions or additions",
                      "Internal documentation and collaboration",
                      "Custom report templates and modifications",
                      "Reports requiring additional management notes",
                    ]}
                  />
                </div>
              </Section>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    amber: "from-amber-500 to-amber-600",
  };

  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
      <div
        className={cn(
          "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center text-white mb-3",
          colorClasses[color as keyof typeof colorClasses]
        )}
      >
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
      <span className="text-gray-700 dark:text-gray-300">{text}</span>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
  tips,
}: {
  number: string;
  title: string;
  description: string;
  tips: string[];
}) {
  return (
    <div className="relative pl-12 pb-6 border-l-2 border-gray-200 dark:border-gray-700 last:border-l-0 last:pb-0">
      <div className="absolute left-0 top-0 -translate-x-1/2 w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-lg shadow-lg">
        {number}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-3">{description}</p>
        <div className="space-y-1">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
            >
              <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div className=" dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <h4 className="font-medium text-gray-900 dark:text-blue-300 mb-2">
        {title}
      </h4>
      <ul className="space-y-1 text-sm text-gray-800 dark:text-blue-400">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExportFormatCard({
  format,
  icon,
  features,
  useCases,
}: {
  format: string;
  icon: string;
  features: string[];
  useCases: string[];
}) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{icon}</span>
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
          {format}
        </h3>
      </div>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
            Features:
          </h4>
          <ul className="space-y-1">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
            Best for:
          </h4>
          <ul className="space-y-1">
            {useCases.map((useCase, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>{useCase}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
