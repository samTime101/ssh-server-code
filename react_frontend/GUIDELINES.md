# React Frontend Development Guidelines

## Table of Contents
1. [Project Structure](#project-structure)
2. [Naming Conventions](#naming-conventions)
3. [Component Guidelines](#component-guidelines)
4. [Pages vs Components](#pages-vs-components)
5. [API Management](#api-management)
6. [State Management](#state-management)
7. [Styling Guidelines](#styling-guidelines)
8. [TypeScript Guidelines](#typescript-guidelines)
9. [File Organization](#file-organization)
10. [Code Quality](#code-quality)

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── user/           # User-specific components
│   ├── admin/          # Admin-specific components
│   └── teacher/        # Teacher-specific components
├── pages/              # Route-level page components
│   ├── user/           # User pages
│   ├── admin/          # Admin pages
│   └── teacher/        # Teacher pages
├── layouts/            # Layout components (UserLayout, AdminLayout)
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── services/           # API service functions
│   ├── user/           # User-specific API calls
│   ├── admin/          # Admin-specific API calls
│   └── auth.ts         # Authentication services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── config/             # Configuration files
└── lib/                # Third-party library configurations
```

---

## Naming Conventions

### Variables and Functions
- **camelCase** for variables, functions, and methods
```typescript
const currentPage = 1;
const fetchUsers = async () => {};
const handlePageChange = (page: number) => {};
```

### Components
- **PascalCase** for component names and files
```typescript
// ✅ Good
const AdminSidebar = () => {};
const QuestionBankSection = () => {};
const ManageUsersPage = () => {};

// ❌ Bad
const adminSidebar = () => {};
const question_bank_section = () => {};
```

### Files and Folders
- **PascalCase** for component files: `AdminSidebar.tsx`
- **camelCase** for utility files: `dateUtils.ts`
<!-- - **kebab-case** for service files: `addquestion-service.tsx` -->
- **lowercase** for folders: `components/admin/`

### State Variables
```typescript
// ✅ Good - Descriptive state names
const [isLoading, setIsLoading] = useState(false);
const [usersList, setUsersList] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [searchQuery, setSearchQuery] = useState("");

// ❌ Bad - Vague or inconsistent names
const [loading, setLoading] = useState(false);
const [users, setUsers] = useState([]);
const [page, setPage] = useState(1);
```

### Constants
- **UPPER_SNAKE_CASE** for constants
```typescript
export const API_BASE_URL = "http://localhost:8000/api";
export const LOCALE = "en-US";
export const DATE_OPTIONS = { /* ... */ };
```

---

## Component Guidelines

### Component Types

#### 1. UI Components (`/components/ui/`)
- Base reusable components (buttons, inputs, cards, etc.)
- Usually from component libraries like shadcn/ui
- Should be generic and not contain business logic

#### 2. Feature Components (`/components/{role}/`)
- Role-specific components
- Contain business logic
- Examples: `AdminSidebar`, `QuestionBankSection`

#### 3. Layout Components (`/layouts/`)
- High-level layout containers
- Handle routing and common UI structure
- Examples: `UserLayout`, `AdminLayout`

### Component Structure
```typescript
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

// Interface definitions at the top
interface ComponentProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const ComponentName = ({ title, isOpen, onClose }: ComponentProps) => {
  // Hooks first
  const { token } = useAuth();
  
  // State declarations
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [token]);
  
  // Event handlers
  const handleSubmit = async () => {
    // Handler logic
  };
  
  // Render
  return (
    <div>
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

---

## Pages vs Components

### Pages (`/pages/`)
- **Purpose**: Route-level components that represent full screens
- **Location**: `/pages/{role}/PageName.tsx`
- **Naming**: Always end with "Page" (e.g., `LoginPage`, `ManageUsersPage`)
- **Responsibility**: 
  - Handle route-specific logic
  - Fetch initial data
  - Compose multiple components
  - Handle route parameters

### Components (`/components/`)
- **Purpose**: Reusable UI pieces and feature sections
- **Location**: `/components/{ui|role}/ComponentName.tsx`
- **Naming**: Descriptive without "Page" suffix
- **Responsibility**:
  - Handle specific UI functionality
  - Receive props from parent
  - Manage local state only

### Examples
```typescript
// ✅ Page - handles route and composes components
const ManageUsersPage = () => {
  // Fetch data, handle routing logic
  return (
    <div>
      <UserSearchForm />
      <UserTable />
      <Paginator />
    </div>
  );
};

// ✅ Component - handles specific functionality
const UserTable = ({ users, isLoading }) => {
  // Handle table-specific logic
  return <Table>{/* table content */}</Table>;
};
```

---

## API Management

### Service Organization
```
services/
├── axios.ts              # Axios instance configuration
├── auth.ts               # Authentication services
├── user/
│   └── questionService.ts    # User-specific APIs
├── admin/
│   ├── addquestion-service.tsx
│   ├── category-service.tsx
│   └── subcategory-service.tsx
└── teacher/
    └── teacherService.ts     # Teacher-specific APIs
```

### API Service Structure
```typescript
// services/admin/user-service.ts
import axiosInstance from "@/services/axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { User } from "@/types/auth";

export interface FetchUsersParams {
  page: number;
  page_size: number;
  search?: string;
}

export interface UsersResponse {
  count: number;
  total_pages: number;
  results: User[];
  next: string | null;
  previous: string | null;
}

export const fetchUsers = async (
  params: FetchUsersParams, 
  token: string
): Promise<UsersResponse> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.usersList, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};
```

### API Configuration
```typescript
// config/apiConfig.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const API_ENDPOINTS = {
  // Auth
  login: `${API_BASE_URL}/signin/`,
  signup: `${API_BASE_URL}/signup/`,
  
  // Users
  usersList: `${API_BASE_URL}/user/`,
  userInfo: `${API_BASE_URL}/user/`,
  
  // Categories
  getCategories: `${API_BASE_URL}/get/categories/`,
  createCategory: `${API_BASE_URL}/create/category/`,
};
```

---

## State Management

### Local State (useState)
- Use for component-specific state
- Name state variables descriptively
```typescript
const [isLoading, setIsLoading] = useState(false);
const [usersList, setUsersList] = useState<User[]>([]);
const [currentPage, setCurrentPage] = useState(1);
```

### Context (React Context)
- Use for app-wide state (auth, theme, etc.)
- Place in `/contexts/` folder
```typescript
// contexts/AuthContext.tsx
export const AuthContext = createContext<{
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  token: string | null;
  user: User | null;
}>({
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  token: null,
  user: null,
});
```

### Custom Hooks
- Extract reusable stateful logic
- Place in `/hooks/` folder
- Prefix with "use"
```typescript
// hooks/useAuth.tsx
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

---

## Styling Guidelines

### CSS Classes
- Use **Tailwind CSS** for styling


### Conditional Styling
```typescript
// ✅ Good - Clear conditional logic
const buttonClasses = `
  px-4 py-2 rounded-lg transition-colors
  ${isActive 
    ? 'bg-blue-600 text-white shadow-md' 
    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
  }
  ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
`;

// For complex conditionals, use helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-600 bg-green-50';
    case 'inactive': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};
```

---

## TypeScript Guidelines

### Interface Definitions
- Define interfaces in `/types/` folder or at component top
- Use PascalCase for interface names
- Group related interfaces in the same file

```typescript
// types/user.ts
export interface User {
  userId: string;
  email: string;
  username: string;
  is_active: boolean;
}

export interface UserFilters {
  search?: string;
  role?: 'admin' | 'teacher' | 'user';
  status?: 'active' | 'inactive';
}
```

### Props and State Typing
```typescript
// Component props
interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem?: string;
}

// State typing
const [users, setUsers] = useState<User[]>([]);
const [filters, setFilters] = useState<UserFilters>({});
const [loading, setLoading] = useState<boolean>(false);
```

### API Response Typing
```typescript
interface ApiResponse<T> {
  count: number;
  total_pages: number;
  results: T[];
  next: string | null;
  previous: string | null;
}

type UsersResponse = ApiResponse<User>;
```

---

## File Organization

### Import Order
```typescript
// 1. React and React-related imports
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 2. Third-party libraries
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// 3. Internal imports (services, hooks, types)
import { useAuth } from "@/hooks/useAuth";
import { fetchUsers } from "@/services/admin/user-service";
import type { User } from "@/types/auth";

// 4. Local/relative imports
import AdminSidebar from "./AdminSidebar";
```

### Export Patterns
```typescript
// ✅ Default export for components
const AdminDashboard = () => {
  // Component logic
};

export default AdminDashboard;

// ✅ Named exports for utilities/services
export const formatDate = (date: string) => {};
export const validateEmail = (email: string) => {};

// ✅ Mixed exports for type definitions
export interface User { /* ... */ }
export type UserRole = 'admin' | 'teacher' | 'user';
export default UserService;
```

---

## Code Quality

### Error Handling
```typescript
// ✅ Good - Proper error handling
const fetchData = async () => {
  try {
    setIsLoading(true);
    const data = await apiCall();
    setData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    toast.error("Failed to fetch data");
  } finally {
    setIsLoading(false);
  }
};
```

### Performance Best Practices
```typescript
// ✅ Proper dependency arrays
useEffect(() => {
  fetchUsers();
}, [currentPage, pageSize, searchQuery]); // Include all dependencies
```

### Comments and Documentation
```typescript
// ✅ Good - Explain complex logic
useEffect(() => {
  // Reset to first page when page size changes to avoid empty results
  if (currentPage > 1 && pageSize !== previousPageSize) {
    setCurrentPage(1);
  }
}, [pageSize]);

// ✅ Document component purpose
/**
 * Reusable paginator component with page numbers and size selector
 * Handles all pagination logic and provides callbacks for parent components
 */
const Paginator = ({ currentPage, totalPages, onPageChange }: PaginatorProps) => {
```

---

## Environment and Configuration

### Environment Variables
```bash
# .env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Sisani EPS
```

### Usage in Code
```typescript
// config/apiConfig.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Use in components
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## Development Workflow

### Branch Naming
- `feat/feature-name` - New features
- `fix/bug-description` - Bug fixes  
- `refactor/component-name` - Code refactoring
- `docs/update-guidelines` - Documentation updates

### Commit Messages
```
feat: add user pagination component
fix: resolve authentication token expiry issue  
refactor: extract user API calls to service layer
docs: update component guidelines
```

### Code Review Checklist
- [ ] Follows naming conventions
- [ ] Proper TypeScript types
- [ ] Error handling implemented
- [ ] Components are in correct directories
- [ ] API calls are in service layer
- [ ] Loading and error states handled
- [ ] Responsive design implemented
- [ ] Accessibility considerations

---

## Common Patterns

### Modal/Dialog Pattern
```typescript
// Use state for modal control
const [isModalOpen, setIsModalOpen] = useState(false);

// Event handlers
const handleOpenModal = () => setIsModalOpen(true);
const handleCloseModal = () => setIsModalOpen(false);

// Component structure
return (
  <>
    <Button onClick={handleOpenModal}>Open Modal</Button>
    {isModalOpen && (
      <Modal onClose={handleCloseModal}>
        {/* Modal content */}
      </Modal>
    )}
  </>
);
```

### Data Fetching Pattern
```typescript
const [data, setData] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await apiService.getData(token);
      setData(result);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (token) {
    fetchData();
  }
}, [token]);
```

### Form Handling Pattern
```typescript
const [formData, setFormData] = useState(initialState);
const [isSubmitting, setIsSubmitting] = useState(false);

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    setIsSubmitting(true);
    await submitForm(formData);
    toast.success("Form submitted successfully");
  } catch (error) {
    toast.error("Failed to submit form");
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## Tools and Extensions

### Recommended VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Auto Rename Tag
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint

### Code Formatting
- Use **Prettier** for consistent formatting
---

This guidelines document should be updated as the project evolves and new patterns emerge. Always prioritize consistency and maintainability over brevity.