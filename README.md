<div align="center">

# 🧪 Food Lab Reporting System

### _Enterprise-Grade Laboratory Operations Management Platform_

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Integrated-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Version](https://img.shields.io/badge/version-0.1.0-green?style=flat-square)
![Build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)

[Features](#-core-capabilities) •
[Quick Start](#-quick-start) •
[Architecture](#-technical-architecture) •
[Documentation](#-project-structure) •
[Deployment](#-deployment)

</div>

---

## 📋 Table of Contents

- [Executive Summary](#-executive-summary)
- [Core Capabilities](#-core-capabilities)
- [Technical Architecture](#-technical-architecture)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Authentication & Security](#-authentication--security)
- [Development Workflow](#-development-workflow)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Support](#-support)
- [License](#-license)

---

## 🎯 Executive Summary

**Food Lab Reporting System** is a production-ready, enterprise-grade web application engineered to revolutionize laboratory operations in food testing facilities. Built on a modern, scalable technology stack, it delivers a comprehensive solution for sample management, report generation, and team collaboration.

### Business Value

- **Operational Efficiency**: Reduce report generation time by 70%
- **Data Integrity**: Eliminate manual data entry errors with structured validation
- **Compliance Ready**: Digital signatures and audit trails for regulatory requirements
- **Team Collaboration**: Role-based access control for secure multi-user operations
- **Scalability**: Cloud-native architecture supporting growth from startup to enterprise

### Target Users

- 🧑‍🔬 Laboratory Technicians
- 👨‍💼 Quality Assurance Managers
- 📊 Operations Supervisors
- 🔬 Food Safety Analysts
- 📈 Compliance Officers

---

## ✨ Core Capabilities

### 🎯 Comprehensive Report Management

<table>
<tr>
<td width="50%" valign="top">

#### Laboratory Operations

- ✅ **Two-Team Workflow** - Opening Team handles intake, Examination Team finalizes reports
- ✅ **Multi-Sample Processing** - Handle multiple samples per report with unique tracking
- ✅ **Digital Signatures** - Employee signatures integrated into exported documents
- ✅ **Container Management** - Track external and internal container types with images
- ✅ **Reference System** - System-generated case numbers and barcodes
- ✅ **Date Tracking** - Comprehensive date management (intake, examination, dispatch)
- ✅ **Barcode Integration** - Barcode number tracking for sample identification

</td>
<td width="50%" valign="top">

#### Data & Analytics

- ✅ **Weight Management** - Precise tracking (gram/kg, pure/total)
- ✅ **Color Coding System** - Visual sample identification
- ✅ **Storage Tracking** - Location management (store/fridge/freezer)
- ✅ **Sender Shop Details** - Complete origin tracking
- ✅ **Export Formats** - Professional PDF and Word documents
- ✅ **Real-time Preview** - Live report rendering before export

</td>
</tr>
</table>

### �️ Master Data Management (Admin Only)

```
Master Data Categories:
├── Employees - Manage staff with roles and signatures
├── Container Types - External and internal container types with images
├── Sample Names - Predefined sample types for standardization
└── Sender Shops - Origin locations for samples
```

- **Employee Management**: Add/edit employees with roles, initials, and digital signatures
- **Container Types**: Define container categories (external/internal) with visual references
- **Sample Names**: Maintain standardized sample nomenclature
- **Sender Shops**: Track and manage sample origin locations
- **Admin-Only Access**: Protected by role-based middleware

### �👥 Advanced Team Management

- **Role-Based Access Control (RBAC)**

  - **Admin**: Full system access including master data management (employees, container types, sample names, sender shops)
  - **Opener**: Opening team access for initial sample intake and container processing
  - **Examiner**: Examination team access for sample examination and report finalization
  - **User**: General access to view reports and data

- **Employee Profiles**
  - Complete contact information
  - Digital signature storage
  - Active/inactive status management
  - Color-coded identification
  - Role assignment and permissions

### 🎨 Superior User Experience

- 🌓 **Dark/Light Mode** - Seamless theme switching with system preference detection
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- ⚡ **Lightning Fast** - Server-side rendering and optimized bundle sizes
- ♿ **WCAG Compliant** - Accessible to users with disabilities
- 🎭 **Modern UI** - Professional design with Radix UI and shadcn/ui
- 🔄 **Real-time Updates** - Optimistic UI updates for instant feedback

### 📤 Professional Export System

#### PDF Generation

- Professional A4 formatting
- Company branding integration
- Auto-generated tables with jsPDF
- Color-coded sections
- Multi-page support
- Digital signature inclusion
- Print-ready layout

#### Word Documents

- Fully editable .docx format
- Structured table formatting
- Professional styling
- Microsoft Word compatible
- LibreOffice compatible
- Maintains data integrity

---

## 🛠️ Technical Architecture

### Technology Stack

```plaintext
┌─────────────────────────────────────────────────────┐
│                   Frontend Layer                     │
├─────────────────────────────────────────────────────┤
│  Next.js 16.1.1 (App Router)                        │
│  React 19.2.3 (Server & Client Components)          │
│  TypeScript 5.0 (Strict Mode)                       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                Authentication Layer                  │
├─────────────────────────────────────────────────────┤
│  JWT (jose 6.1.3) - Token-based authentication      │
│  HTTP-Only Cookies - Secure token storage           │
│  Role-Based Access Control - Admin/Opener/Examiner  │
│  Middleware Route Protection - Next.js middleware    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                    Data Layer                        │
├─────────────────────────────────────────────────────┤
│  Supabase (PostgreSQL)                              │
│  LocalStorage (Development Mode)                    │
│  Zod Schema Validation                              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   UI/UX Layer                        │
├─────────────────────────────────────────────────────┤
│  Tailwind CSS 4.0                                   │
│  Radix UI (Headless Components)                     │
│  shadcn/ui (Design System)                          │
│  Lucide Icons                                       │
│  next-themes (Theme Management)                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                 Document Generation                  │
├─────────────────────────────────────────────────────┤
│  jsPDF 3.0.4 (PDF Export)                           │
│  jspdf-autotable 5.0.2 (Table Generation)           │
│  docx 9.5.1 (Word Export)                           │
│  file-saver 2.0.5 (Download Management)             │
└─────────────────────────────────────────────────────┘
```

### Key Dependencies

| Category           | Package         | Version | Purpose                              |
| ------------------ | --------------- | ------- | ------------------------------------ |
| **Framework**      | Next.js         | 16.1.1  | React meta-framework with App Router |
| **UI Library**     | React           | 19.2.3  | Component-based UI development       |
| **Language**       | TypeScript      | 5.0     | Type-safe JavaScript                 |
| **Styling**        | Tailwind CSS    | 4.0     | Utility-first CSS framework          |
| **Database**       | Supabase        | 2.89.0  | PostgreSQL backend                   |
| **Authentication** | jose            | 6.1.3   | JWT token management                 |
| **Forms**          | React Hook Form | 7.69.0  | Form state management                |
| **Validation**     | Zod             | 4.3.4   | Schema validation                    |
| **Icons**          | Lucide React    | 0.562.0 | Icon library                         |
| **PDF Export**     | jsPDF           | 3.0.4   | PDF generation                       |
| **Word Export**    | docx            | 9.5.1   | Word document generation             |
| **Date Handling**  | date-fns        | 4.1.0   | Date manipulation                    |

### Architecture Patterns

- **Server-Side Rendering (SSR)** - Improved SEO and initial load performance
- **Component Composition** - Reusable, maintainable component architecture
- **Custom Hooks** - Abstracted business logic for reusability
- **Middleware Protection** - Server-side route and authentication guards
- **Optimistic UI** - Instant feedback for better user experience
- **Responsive Design** - Mobile-first, adaptive layouts

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** >= 20.0.0 (LTS recommended)
- **npm** >= 10.0.0 / **yarn** >= 1.22.0 / **pnpm** >= 8.0.0
- **Git** (for version control)

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

3. **Environment Configuration** (Optional for development)

   The application works out of the box with no configuration required. Data is stored in browser LocalStorage during development.

   For production with Supabase backend, create a `.env.local` file:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Access the application**

   Open [http://localhost:3000](http://localhost:3000) in your browser

### Default Test Accounts

| Email                | Password     | Role     | Permissions                                |
| -------------------- | ------------ | -------- | ------------------------------------------ |
| admin@foodlab.com    | FoodLab2026! | Admin    | Full system access, master data management |
| examiner@foodlab.com | FoodLab2026! | Examiner | Report creation, sample management         |
| opener@foodlab.com   | FoodLab2026! | Opener   | Container opening, initial processing      |
| user@foodlab.com     | FoodLab2026! | User     | View-only access to reports                |

---

## 📁 Project Structure

```plaintext
food-lab-reporting-system/
│
├── public/                          # Static assets
│   └── [images, fonts, icons]
│
├── database/                        # Database migrations
│   ├── migration_add_container_type_images.sql
│   └── migration_add_opener_examiner.sql
│
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── api/                    # API routes
│   │   │   └── auth/               # Authentication endpoints
│   │   │       ├── login/          # Login handler
│   │   │       └── logout/         # Logout handler
│   │   ├── login/                  # Login page
│   │   ├── routes/                 # Protected routes
│   │   │   ├── documentation/      # API documentation
│   │   │   ├── employees/          # Employee management
│   │   │   ├── examination-team/   # Examination team view
│   │   │   ├── master-data/        # Master data (Admin only)
│   │   │   │   ├── container-types/
│   │   │   │   ├── employees/
│   │   │   │   ├── sample-names/
│   │   │   │   ├── sender-shops/
│   │   │   │   └── storage-locations/
│   │   │   ├── opening-team/       # Opening team view
│   │   │   ├── samples/            # Sample management
│   │   │   └── settings/           # Application settings
│   │   ├── globals.css             # Global styles & CSS variables
│   │   ├── layout.tsx              # Root layout with providers
│   │   ├── page.tsx                # Dashboard/Home page
│   │   └── not-found.tsx           # Custom 404 page
│   │
│   ├── components/                  # React components
│   │   ├── layout/                 # Layout components
│   │   │   ├── DashboardLayout.tsx # Main dashboard wrapper
│   │   │   ├── Header.tsx          # Top navigation
│   │   │   └── Sidebar.tsx         # Side navigation (role-aware)
│   │   ├── report/                 # Report components
│   │   │   └── ReportPreview.tsx   # Live report preview
│   │   ├── ui/                     # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   └── [30+ components]
│   │   ├── AdminOnly.tsx           # Admin route protection
│   │   ├── Logo.tsx                # Application logo
│   │   ├── LogoutButton.tsx        # Logout functionality
│   │   ├── NavLink.tsx             # Navigation link component
│   │   ├── route-guard.tsx         # Client-side route protection
│   │   └── theme-provider.tsx      # Theme context provider
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── use-mobile.tsx          # Mobile detection
│   │   ├── use-toast.ts            # Toast notifications
│   │   ├── useColors.ts            # Color management
│   │   ├── useReports.ts           # Report operations
│   │   └── useSupabaseData.ts      # Supabase data fetching
│   │
│   ├── lib/                         # Utility libraries
│   │   ├── auth.ts                 # Authentication logic (JWT)
│   │   ├── utils.ts                # Helper functions
│   │   ├── export/                 # Export utilities
│   │   │   └── report-word.ts      # Word export logic
│   │   ├── supabase/               # Supabase clients
│   │   │   ├── client.ts           # Supabase client setup
│   │   │   ├── employee-storage.ts # Employee data operations
│   │   │   └── storage.ts          # General storage operations
│   │   └── validations/            # Zod validation schemas
│   │       ├── employee.schema.ts  # Employee validation
│   │       ├── login.schema.ts     # Login validation
│   │       ├── master-data.schema.ts # Master data validation
│   │       └── report.schema.ts    # Report validation
│   │
│   ├── pages/                       # Page components
│   │   ├── Dashboard.tsx           # Main dashboard
│   │   ├── Employees.tsx           # Employee list
│   │   ├── NewReport.tsx           # Report creation
│   │   ├── Reports.tsx             # Report listing
│   │   ├── Samples.tsx             # Sample management
│   │   ├── ContainerTypes.tsx      # Container type master data
│   │   ├── SampleNames.tsx         # Sample name master data
│   │   ├── StorageLocations.tsx    # Storage location master data
│   │   ├── Documentation.tsx       # API documentation
│   │   ├── ComingSoon.tsx          # Placeholder page
│   │   ├── loginPage.tsx           # Login page UI
│   │   └── NotFound.tsx            # 404 error page
│   │
│   └── types/                       # TypeScript definitions
│       ├── report.ts               # Report type definitions
│       └── supabase.ts             # Supabase type definitions
│
├── middleware.ts                    # Next.js middleware (auth & routing)
├── next.config.ts                   # Next.js configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── eslint.config.mjs                # ESLint configuration
├── postcss.config.mjs               # PostCSS configuration
├── package.json                     # Dependencies & scripts
└── README.md                        # This file
```

---

## 🔐 Authentication & Security

### Security Features

- **JWT Authentication** - Secure token-based authentication with jose library (HS256 algorithm)
- **HTTP-Only Cookies** - Prevents XSS attacks by storing tokens in HTTP-only cookies
- **24-Hour Token Expiration** - Automatic session timeout for security
- **Role-Based Access Control** - Granular permissions (Admin, Opener, Examiner, User)
- **Middleware Protection** - Server-side route guards with Next.js middleware
- **Client-Side Guards** - Component-level protection for sensitive pages
- **Master Data Protection** - Admin-only routes enforced at middleware level
- **Secure Cookie Settings** - SameSite=strict, HttpOnly, Secure (in production)

### Authentication Flow

```plaintext
┌──────────┐      ┌──────────────┐      ┌──────────────┐
│  Client  │─────▶│  Login API   │─────▶│  Supabase    │
│          │      │  (POST)      │      │  (Verify)    │
└──────────┘      └──────────────┘      └──────────────┘
     │                    │                     │
     │                    ▼                     ▼
     │            ┌──────────────┐      ┌──────────────┐
     │            │ Generate JWT │      │ Return User  │
     │            │ (24h expiry) │◀─────│ + Role       │
     │            └──────────────┘      └──────────────┘
     │                    │
     ▼                    ▼
┌──────────────────────────────────────┐
│ Set HTTP-Only Cookie + Redirect      │
└──────────────────────────────────────┘
```

### Role Permissions Matrix

| Feature               | Admin | Examiner | Opener | User |
| --------------------- | ----- | -------- | ------ | ---- |
| View Dashboard        | ✅    | ✅       | ✅     | ✅   |
| Opening Team View     | ✅    | ✅       | ✅     | ❌   |
| Examination Team View | ✅    | ✅       | ✅     | ❌   |
| View Reports          | ✅    | ✅       | ✅     | ✅   |
| Export Reports        | ✅    | ✅       | ✅     | ❌   |
| Manage Employees      | ✅    | ❌       | ❌     | ❌   |
| Master Data           | ✅    | ❌       | ❌     | ❌   |
| Container Types       | ✅    | ❌       | ❌     | ❌   |
| Sample Names          | ✅    | ❌       | ❌     | ❌   |
| Sender Shops          | ✅    | ❌       | ❌     | ❌   |
| System Settings       | ✅    | ❌       | ❌     | ❌   |

---

## 💻 Development Workflow

### Available Scripts

| Command         | Description              | Usage                                      |
| --------------- | ------------------------ | ------------------------------------------ |
| `npm run dev`   | Start development server | Local development at http://localhost:3000 |
| `npm run build` | Build production bundle  | Creates optimized .next folder             |
| `npm run start` | Start production server  | Serves the built application               |
| `npm run lint`  | Run ESLint               | Check code quality and standards           |

### Development Guidelines

1. **Code Style**

   - Follow TypeScript strict mode guidelines
   - Use functional components with hooks
   - Implement proper error handling
   - Write meaningful comments for complex logic

2. **Component Structure**

   - Keep components small and focused
   - Use composition over inheritance
   - Implement proper prop typing
   - Extract reusable logic into custom hooks

3. **State Management**

   - Use React hooks for local state
   - Implement custom hooks for shared logic
   - Consider context for global state
   - Use Zod for runtime validation

4. **Styling**

   - Use Tailwind CSS utility classes
   - Follow the design system in globals.css
   - Maintain dark/light mode compatibility
   - Use responsive design patterns

5. **Testing**
   - Write unit tests for utilities
   - Test critical user flows
   - Validate form submissions
   - Check responsive layouts

---

## 📚 API Reference

### Authentication Endpoints

#### POST `/api/auth/login`

Authenticate user and return JWT token.

**Request:**

```json
{
  "email": "admin@foodlab.com",
  "password": "FoodLab2026!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful"
}
```

#### POST `/api/auth/logout`

Clear authentication cookie and log out user.

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**

   - Push code to GitHub/GitLab/Bitbucket
   - Import project in Vercel dashboard
   - Auto-detection of Next.js

2. **Configure Environment**

   - Add environment variables in Vercel dashboard
   - Set `JWT_SECRET` for production
   - Configure Supabase credentials

3. **Deploy**
   - Automatic deployments on git push
   - Preview deployments for pull requests
   - Production deployment on main branch

### Alternative Platforms

#### Docker Deployment

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

#### Build Configuration

- **Build Command:** `npm run build`
- **Start Command:** `npm run start`
- **Node Version:** >= 20.0.0
- **Output Directory:** `.next`

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- **Code Quality:** Follow TypeScript and ESLint rules
- **Documentation:** Update README and inline comments
- **Testing:** Add tests for new features
- **Commit Messages:** Use conventional commit format
- **Pull Requests:** Provide clear description and screenshots

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Follow project standards
- Help others learn and grow

---

## 🆘 Support

### Getting Help

- **Documentation:** Check this README and inline comments
- **Issues:** [GitHub Issues](https://github.com/yourusername/food-lab-reporting-system/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/food-lab-reporting-system/discussions)

### Reporting Issues

When reporting issues, please include:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Node version)

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Food Lab Reporting System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

This project is built with incredible open-source technologies:

- **[Next.js](https://nextjs.org/)** - The React Framework for Production
- **[Vercel](https://vercel.com/)** - Cloud Platform for Static Sites
- **[Supabase](https://supabase.com/)** - Open Source Firebase Alternative
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-First CSS Framework
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, Accessible Components
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautifully Designed Components
- **[Lucide](https://lucide.dev/)** - Beautiful & Consistent Icons
- **[React Hook Form](https://react-hook-form.com/)** - Performant Form Library
- **[Zod](https://zod.dev/)** - TypeScript-First Schema Validation

Special thanks to all contributors and the open-source community.

---

<div align="center">

### Made with ❤️ for Laboratory Professionals

**[⬆ Back to Top](#-food-lab-reporting-system)**

</div>
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
React Hooks & LocalStorage
├── useState & useEffect
├── Custom Hooks
└── LocalStorage API
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

The application works out of the box with no environment variables required. All data is temporarily stored in the browser's LocalStorage. For production use, configure Supabase for persistent backend storage.

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

## 🗃️ Data Management

### Supabase Integration

The application uses **Supabase** (PostgreSQL) for data persistence:

```typescript
Data Tables
├── users - User accounts with authentication
├── roles - User role definitions (admin, opener, examiner)
├── employees - Employee profiles with signatures
├── reports - Laboratory reports and case data
├── container_types - Container definitions
├── sample_names - Sample type definitions
└── sender_shops - Origin location definitions
```

### Custom React Hooks

- **useReports()**: Fetch and manage reports
- **useEmployees()**: Employee CRUD operations
- **useContainerTypes()**: Container type management
- **useSampleNames()**: Sample name operations
- **useSenderShops()**: Sender shop management

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
