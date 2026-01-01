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
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-1 h-auto p-2">
          <TabsTrigger value="overview" className="gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="getting-started" className="gap-2">
            <PlayCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Getting Started</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>

          <TabsTrigger value="employees" className="gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Employees</span>
          </TabsTrigger>
          <TabsTrigger value="export" className="gap-2">
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
                The Food Lab Reporting System is a modern, easy-to-use web
                application designed to help food testing laboratories manage
                their daily operations efficiently. Whether you're testing food
                samples, tracking containers, or generating professional
                reports, this system simplifies your workflow.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <FeatureCard
                  icon={<FileText className="w-6 h-6" />}
                  title="Create Reports"
                  description="Generate detailed food lab reports quickly and easily"
                  color="blue"
                />

                <FeatureCard
                  icon={<BarChart3 className="w-6 h-6" />}
                  title="View Analytics"
                  description="Get insights into lab performance and productivity"
                  color="purple"
                />
                <FeatureCard
                  icon={<Download className="w-6 h-6" />}
                  title="Export Reports"
                  description="Download reports as PDF or Word documents"
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
                <BenefitItem text="Save time with automated report generation" />
                <BenefitItem text="Reduce errors with built-in validation" />
                <BenefitItem text="Access data anytime, anywhere" />
                <BenefitItem text="Professional, standardized reports" />
                <BenefitItem text="Easy team collaboration" />
                <BenefitItem text="Secure data storage" />
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
                title="Access the Dashboard"
                description="When you first open the application, you'll see the Dashboard. This is your main hub showing all important information at a glance."
                tips={[
                  "View total number of reports and samples",
                  "See recent activity and statistics",
                  "Quick access to create new reports",
                ]}
              />

              <StepCard
                number="2"
                title="Create Your First Report"
                description="Click on 'New Report' in the sidebar or the dashboard to start creating a report."
                tips={[
                  "Fill in the reference number (e.g., REF-001)",
                  "Select the employee responsible for the report",
                  "Choose the report date",
                  "Add container and sample information",
                ]}
              />

              <StepCard
                number="3"
                title="Fill in Sample Details"
                description="Add information about the samples being tested. You can add multiple samples to a single report."
                tips={[
                  "Enter sample name and number",
                  "Record weight measurements",
                  "Assign a color code for easy identification",
                  "Specify storage location (store, fridge, or both)",
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
                title="Export Your Report"
                description="Once saved, you can export your report in professional formats."
                tips={[
                  "Go to 'All Reports' to view your saved reports",
                  "Click on any report to view details",
                  "Use the export buttons to download as PDF or Word",
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
                Managing Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Section
                title="Creating a New Report"
                icon={<Plus className="w-5 h-5 text-green-600" />}
              >
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  To create a new report, follow these sections:
                </p>
                <div className="space-y-3">
                  <InfoBox
                    title="Basic Information"
                    items={[
                      "Reference Number: A unique identifier for your report (e.g., REF-2026-001)",
                      "Employee: Select who is responsible for this report",
                      "Date: Choose the date when the samples were received",
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
                title="Viewing Reports"
                icon={<Eye className="w-5 h-5 text-purple-600" />}
              >
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  All your saved reports can be accessed from the "All Reports"
                  page:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      Use the search bar to find reports by reference number
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Click on any report to view full details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      Sort reports by date, employee, or reference number
                    </span>
                  </li>
                </ul>
              </Section>

              <Section
                title="Editing Reports"
                icon={<Settings className="w-5 h-5 text-amber-600" />}
              >
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2 text-sm">
                      <p className="font-medium text-blue-900 dark:text-blue-300">
                        Currently, reports cannot be edited after saving.
                      </p>
                      <p className="text-blue-800 dark:text-blue-400">
                        Make sure to preview your report carefully before
                        saving. If you need to make changes, you can create a
                        new report with the correct information.
                      </p>
                    </div>
                  </div>
                </div>
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
              <Section title="About Employee Profiles">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Each employee in the system has a profile that includes:
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
                        Job Role
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                        Initials
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                        Color Code
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Contact Details
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                        Email Address
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                        Phone Number
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                        Active Status
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                        Digital Signature
                      </li>
                    </ul>
                  </div>
                </div>
              </Section>

              <Section title="Assigning Employees to Reports">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  When creating a report, you need to assign an employee:
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
                        all available employees
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
                        Each employee shows their name, role, and color code for
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
                        Digital Signature
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        The selected employee's digital signature will
                        automatically appear on the report
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
                Exporting Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Section title="Export Formats">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  You can export your reports in two professional formats:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <ExportFormatCard
                    format="PDF"
                    icon="📄"
                    features={[
                      "Professional formatting with company branding",
                      "Cannot be edited (preserves report integrity)",
                      "Perfect for official documentation",
                      "Easy to share via email",
                      "Includes employee signatures",
                      "Print-ready format",
                    ]}
                    useCases={[
                      "Official report submissions",
                      "Client deliverables",
                      "Archive copies",
                      "Regulatory compliance",
                    ]}
                  />
                  <ExportFormatCard
                    format="Word Document"
                    icon="📝"
                    features={[
                      "Fully editable content",
                      "Professional table formatting",
                      "Compatible with Microsoft Word",
                      "Easy to customize",
                      "Add additional notes",
                      "Flexible layout modifications",
                    ]}
                    useCases={[
                      "Draft reports needing revisions",
                      "Internal documentation",
                      "Custom report templates",
                      "Collaborative editing",
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

function FieldExplanation({
  field,
  explanation,
}: {
  field: string;
  explanation: string;
}) {
  return (
    <div className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-600 mt-2"></div>
      <div>
        <p className="font-medium text-gray-900 dark:text-gray-100">{field}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {explanation}
        </p>
      </div>
    </div>
  );
}

function TipCard({ tip, description }: { tip: string; description: string }) {
  return (
    <div className="flex gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-medium text-amber-900 dark:text-amber-300">{tip}</p>
        <p className="text-sm text-amber-800 dark:text-amber-400 mt-1">
          {description}
        </p>
      </div>
    </div>
  );
}

function RoleCard({
  role,
  description,
}: {
  role: string;
  description: string;
}) {
  return (
    <div className="p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
      <p className="font-medium text-purple-900 dark:text-purple-300">{role}</p>
      <p className="text-sm text-purple-800 dark:text-purple-400 mt-1">
        {description}
      </p>
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

function ChecklistItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded">
      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
      <span className="text-sm text-gray-700 dark:text-gray-300">{text}</span>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-start gap-2">
        <HelpCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
        <span>{question}</span>
      </h3>
      <p className="text-gray-700 dark:text-gray-300 text-sm pl-7">{answer}</p>
    </div>
  );
}
