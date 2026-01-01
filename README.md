<div align="center">

# 🧪 Food Lab Reporting System

### _Streamline Your Laboratory Operations with Intelligent Report Management_

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2.11.2-764ABC?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Features in Detail](#-features-in-detail)
- [Scripts](#-scripts)
- [Export Formats](#-export-formats)
- [State Management](#-state-management)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔬 Overview

**Food Lab Reporting System** is a comprehensive, modern web application designed to revolutionize laboratory operations in food testing facilities. Built with cutting-edge technologies, it provides an intuitive interface for managing samples, generating detailed reports, and tracking laboratory activities with efficiency and precision.

This system empowers lab technicians, quality analysts, and supervisors to:

- 📝 Create and manage detailed food sample reports
- 📊 Track samples through their entire lifecycle
- 👥 Manage employee assignments and signatures
- 📄 Export reports in multiple professional formats (PDF, Word)
- 📈 Visualize laboratory metrics and performance
- 🌓 Work comfortably with dark/light mode support

---

## ✨ Key Features

### 🎯 Core Functionality

<table>
<tr>
<td width="50%">

#### Report Management

- ✅ Create comprehensive food lab reports
- ✅ Track reference numbers and dates
- ✅ Assign employees with digital signatures
- ✅ Record container information (external/internal)
- ✅ Manage sender shop details

</td>
<td width="50%">

#### Sample Tracking

- ✅ Multi-sample support per report
- ✅ Weight tracking (gram/kg, pure/total)
- ✅ Color-coded sample organization
- ✅ Storage location management (store/fridge/both)
- ✅ Barcode integration

</td>
</tr>
<tr>
<td>

#### Employee Management

- ✅ Employee profiles with roles
- ✅ Digital signature support
- ✅ Contact information tracking
- ✅ Active/inactive status management
- ✅ Color-coded employee identification

</td>
<td>

#### Data Persistence

- ✅ Redux Toolkit state management
- ✅ Redux Persist for data retention
- ✅ Real-time updates across components
- ✅ Optimistic UI updates
- ✅ Local storage integration

</td>
</tr>
</table>

### 🎨 User Experience

- 🌓 **Dark/Light Mode** - Seamless theme switching with next-themes
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile
- 🎭 **Modern UI Components** - Built with Radix UI and shadcn/ui
- 🚀 **Fast Performance** - Server-side rendering with Next.js 16
- ♿ **Accessible** - WCAG compliant components
- 🎯 **Intuitive Navigation** - Clean sidebar and header layout

### 📤 Export Capabilities

- 📄 **PDF Export** - Professional reports with jsPDF and autoTable
- 📝 **Word Export** - Editable documents with docx library
- 🖼️ **Preview Mode** - Real-time report preview before export
- 📋 **Batch Operations** - Export multiple reports at once

---

## 🛠️ Tech Stack

### Frontend Framework

```
Next.js 16.1.1 (React 19.2.3)
├── App Router Architecture
├── Server-Side Rendering
├── TypeScript 5.x
└── React Hooks & Context
```

### State Management

```
Redux Toolkit 2.11.2
├── Redux Persist
├── Typed Hooks
└── Slice Pattern
```

### UI & Styling

```
Tailwind CSS 4.0
├── Radix UI Components
├── shadcn/ui
├── Lucide Icons
├── Rizzui
└── next-themes
```

### Form Management

```
React Hook Form 7.69.0
├── Zod Schema Validation
├── @hookform/resolvers
└── Custom Validators
```

### Export & Documents

```
Document Generation
├── jsPDF 3.0.4
├── jspdf-autotable 5.0.2
├── docx 9.5.1
└── file-saver 2.0.5
```

### Utilities & Tools

```
Supporting Libraries
├── date-fns 4.1.0
├── class-variance-authority
├── tailwind-merge
├── cmdk
└── react-select 5.10.2
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** 20.x or higher
- **npm** / **yarn** / **pnpm** / **bun**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/food-lab-reporting-system.git
   cd food-lab-reporting-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Setup

The application works out of the box with no environment variables required. All data is persisted locally using Redux Persist.

---

## 📁 Project Structure

```
food-lab-reporting-system/
│
├── public/                      # Static assets
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (routes)/           # Grouped routes
│   │   │   ├── documentation/  # API documentation
│   │   │   ├── employees/      # Employee management
│   │   │   ├── new-report/     # Report creation
│   │   │   ├── reports/        # Report listing & detail
│   │   │   ├── samples/        # Sample management
│   │   │   └── settings/       # Application settings
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   │
│   ├── components/
│   │   ├── form/               # Form components
│   │   ├── layout/             # Layout components
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── report/             # Report-specific components
│   │   │   └── ReportPreview.tsx
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── Logo.tsx
│   │   ├── NavLink.tsx
│   │   ├── redux-provider.tsx
│   │   └── theme-provider.tsx
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── lib/
│   │   ├── export/             # Export utilities
│   │   │   ├── report-pdf.ts
│   │   │   ├── report-pdf-html.ts
│   │   │   └── report-word.ts
│   │   ├── validations/        # Zod schemas
│   │   │   ├── employee.schema.ts
│   │   │   └── report.schema.ts
│   │   └── utils.ts            # Helper functions
│   │
│   ├── pages/                  # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Employees.tsx
│   │   ├── NewReport.tsx
│   │   ├── Reports.tsx
│   │   ├── Samples.tsx
│   │   └── ComingSoon.tsx
│   │
│   ├── store/                  # Redux store
│   │   ├── store.ts
│   │   ├── hooks.ts
│   │   └── slices/
│   │       └── reportsSlice.ts
│   │
│   └── types/                  # TypeScript definitions
│       └── report.ts
│
├── eslint.config.mjs           # ESLint configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies
├── postcss.config.mjs          # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

---

## 🎯 Features in Detail

### 📊 Dashboard

The dashboard provides a comprehensive overview of laboratory operations:

- **Statistics Cards**: Display total reports, samples, processing time, and efficiency metrics
- **Recent Reports**: Quick access to the most recent laboratory reports
- **Visual Analytics**: Trend indicators showing performance changes
- **Quick Actions**: Direct navigation to create new reports or view all reports

### 📝 New Report Creation

A multi-section form for creating detailed food lab reports:

1. **Basic Information**

   - Reference number
   - Employee assignment (with profile pictures and signatures)
   - Report date selection

2. **Container Management**

   - External containers (type and quantity)
   - Internal containers (type and quantity)
   - Sender shop information

3. **Sample Details**

   - Multiple samples per report
   - Sample identification (number, name)
   - Weight measurements (gram/kg, pure/total)
   - Color coding system
   - Storage location tracking

4. **Product Information**
   - Barcode integration
   - Production date
   - Expiration date

### 📄 Reports Management

- **Search & Filter**: Find reports quickly by reference number
- **List View**: Comprehensive table with all report details
- **Actions**: View, export (PDF/Word), and delete reports
- **Pagination**: Efficient handling of large report lists

### 👥 Employee Management

- **Employee Profiles**: Name, role, contact information
- **Digital Signatures**: SVG-based signature generation
- **Status Management**: Active/inactive employee tracking
- **Color Coding**: Visual identification system

### 📤 Export System

#### PDF Export

- Professional formatting with jsPDF
- Auto-generated tables
- Color-coded sections
- Employee signatures included
- Company branding

#### Word Export

- Fully editable documents
- Structured tables
- Professional styling
- Compatible with Microsoft Word and LibreOffice

---

## 📜 Scripts

| Command         | Description                                       |
| --------------- | ------------------------------------------------- |
| `npm run dev`   | Start development server on http://localhost:3000 |
| `npm run build` | Build production-ready application                |
| `npm run start` | Start production server                           |
| `npm run lint`  | Run ESLint for code quality checks                |

---

## 📤 Export Formats

### PDF Features

- ✅ A4 page format
- ✅ Professional header with company branding
- ✅ Color-coded sections
- ✅ Automatic table generation
- ✅ Multi-page support
- ✅ Employee signature integration
- ✅ Date formatting

### Word Features

- ✅ Fully editable content
- ✅ Professional table formatting
- ✅ Structured headings
- ✅ Compatible with Microsoft Word
- ✅ Print-ready layout
- ✅ Maintains data integrity

---

## 🗃️ State Management

### Redux Architecture

```typescript
Store Structure
├── reports
│   └── reportsSlice
│       ├── reports: SavedReport[]
│       ├── addReport()
│       ├── deleteReport()
│       ├── updateReport()
│       └── setReports()
└── [Future slices...]
```

### Data Persistence

The application uses **Redux Persist** to maintain data across browser sessions:

- Reports stored in localStorage
- Automatic rehydration on app load
- Configurable persistence settings
- Seamless state recovery

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Push your code to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel will auto-detect Next.js and configure settings
   - Click "Deploy"

### Alternative Platforms

The application can also be deployed on:

- **Netlify**
- **AWS Amplify**
- **Railway**
- **DigitalOcean App Platform**
- **Docker** (containerized deployment)

### Build Command

```bash
npm run build
```

### Start Command

```bash
npm run start
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Code Standards

- Follow TypeScript best practices
- Maintain existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** - For the incredible React framework
- **Vercel** - For hosting and deployment platform
- **shadcn/ui** - For beautiful, accessible UI components
- **Radix UI** - For unstyled, accessible components
- **Redux Team** - For powerful state management
- **Tailwind Labs** - For the utility-first CSS framework

<div align="center">

### Made with ❤️ for Laboratory Professionals

**[⬆ Back to Top](#-food-lab-reporting-system)**

</div>
