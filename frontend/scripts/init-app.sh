#!/bin/bash

# SConnect Admin Application Initialization Script
# This script creates the complete application structure based on PROJECT_STRUCTURE.md

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "docs/architecture/PROJECT_STRUCTURE.md" ]; then
    log_error "PROJECT_STRUCTURE.md not found. Please run this script from the frontend directory."
    exit 1
fi

log_info "Starting SConnect Admin Application initialization..."

# Step 1: Create app folder
log_info "Creating app folder..."
mkdir -p app
cd app

# Step 2: Initialize package.json
log_info "Initializing package.json..."
cat > package.json << 'EOF'
{
  "name": "sconnect-admin",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "@tanstack/react-query": "^5.8.4",
    "@tanstack/react-table": "^8.10.7",
    "zustand": "^4.4.7",
    "axios": "^1.6.2",
    "react-hook-form": "^7.48.2",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.2",
    "@headlessui/react": "^1.7.17",
    "react-icons": "^4.12.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "class-variance-authority": "^0.7.0",
    "date-fns": "^2.30.0",
    "react-hot-toast": "^2.4.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "@vitejs/plugin-react": "^4.1.1",
    "vite": "^5.0.0",
    "typescript": "^5.2.2",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "eslint": "^8.53.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "prettier": "^3.1.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.1",
    "vitest": "^0.34.6",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^6.1.4",
    "@testing-library/user-event": "^14.5.1",
    "@vitest/coverage-v8": "^0.34.6",
    "@vitest/ui": "^0.34.6",
    "jsdom": "^23.0.1",
    "playwright": "^1.40.0",
    "@playwright/test": "^1.40.0",
    "husky": "^8.0.3",
    "lint-staged": "^15.1.0"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
EOF

# Step 3: Create TypeScript configuration
log_info "Creating TypeScript configuration..."
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@pages/*": ["./src/pages/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@services/*": ["./src/services/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"],
      "@stores/*": ["./src/stores/*"],
      "@constants/*": ["./src/constants/*"],
      "@lib/*": ["./src/lib/*"]
    }
  },
  "include": ["src", "tests"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

cat > tsconfig.node.json << 'EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOF

# Step 4: Create Vite configuration
log_info "Creating Vite configuration..."
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@lib': path.resolve(__dirname, './src/lib'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@headlessui/react', 'react-icons'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
});
EOF

# Step 5: Create Tailwind configuration
log_info "Creating Tailwind CSS configuration..."
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
EOF

cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Step 6: Create ESLint configuration
log_info "Creating ESLint configuration..."
cat > .eslintrc.json << 'EOF'
{
  "env": { "browser": true, "es2020": true },
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "ignorePatterns": ["dist", ".eslintrc.cjs"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["react-refresh", "prettier"],
  "rules": {
    "react-refresh/only-export-components": [
      "warn",
      { "allowConstantExport": true }
    ],
    "prettier/prettier": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
EOF

# Step 7: Create Prettier configuration
log_info "Creating Prettier configuration..."
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
EOF

# Step 8: Create Vitest configuration
log_info "Creating Vitest configuration..."
cat > vitest.config.ts << 'EOF'
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@lib': path.resolve(__dirname, './src/lib'),
    },
  },
});
EOF

# Step 9: Create Playwright configuration
log_info "Creating Playwright configuration..."
cat > playwright.config.ts << 'EOF'
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
EOF

# Step 10: Create public folder and assets
log_info "Creating public folder and assets..."
mkdir -p public/assets/{images,icons,fonts}

cat > public/index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SConnect Admin</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

cat > public/manifest.json << 'EOF'
{
  "name": "SConnect Admin",
  "short_name": "SConnect Admin",
  "description": "SConnect Administration Dashboard",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#2563eb",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOF

cat > public/robots.txt << 'EOF'
User-agent: *
Disallow: /
EOF

# Step 11: Create source directory structure
log_info "Creating source directory structure..."

# Main source directories
mkdir -p src/{components,pages,hooks,services,stores,types,utils,constants,styles,lib}

# Components subdirectories
mkdir -p src/components/{ui,layout,forms,data,domain}
mkdir -p src/components/ui/{Button,Input,Modal,Table,Card,Loading,Alert}
mkdir -p src/components/layout/{AppLayout,Sidebar,Header,Breadcrumbs}
mkdir -p src/components/forms/{FormField,SearchForm,BulkActions}
mkdir -p src/components/data/{DataTable,Charts,Metrics}
mkdir -p src/components/domain/{Button,Category,User}

# Pages subdirectories
mkdir -p src/pages/{dashboard,buttons,categories,relationships,users,favorites,settings,purge,admin,app-settings,auth,error}
mkdir -p src/pages/dashboard/{components,hooks}
mkdir -p src/pages/buttons/{components,hooks}
mkdir -p src/pages/categories/{components,hooks}
mkdir -p src/pages/relationships/{components,hooks}
mkdir -p src/pages/users/{components,hooks}
mkdir -p src/pages/favorites/{components,hooks}
mkdir -p src/pages/settings/{components,hooks}
mkdir -p src/pages/purge/{components,hooks}
mkdir -p src/pages/admin/{components,hooks}
mkdir -p src/pages/app-settings/{components,hooks}
mkdir -p src/pages/auth/{components,hooks}

# Hooks subdirectories
mkdir -p src/hooks/{api,auth,ui,form,navigation,data}

# Services subdirectories
mkdir -p src/services/{api,auth,domain,storage,validation,notification,analytics}

# Stores subdirectories
mkdir -p src/stores/{auth,ui,app}

# Types subdirectories
mkdir -p src/types/{api,domain,ui,auth}

# Utils subdirectories
mkdir -p src/utils/{api,auth,format,validation,dom,data}

# Styles subdirectories
mkdir -p src/styles/themes

# Step 12: Create main application files
log_info "Creating main application files..."

cat > src/main.tsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
EOF

cat > src/App.tsx << 'EOF'
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@contexts/AuthContext';
import { AppRoutes } from '@pages/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-right" />
        </AuthProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
EOF

cat > src/vite-env.d.ts << 'EOF'
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_TIMEOUT?: string;
  readonly VITE_ENABLE_DEBUG?: string;
  readonly VITE_ENVIRONMENT?: string;
  // Add more env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
EOF

# Step 13: Create CSS files
log_info "Creating CSS files..."

cat > src/styles/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: 'Inter', system-ui, sans-serif;
  }
  
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
  }
}

@layer components {
  .btn {
    @apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50;
  }
  
  .card {
    @apply rounded-lg border bg-card text-card-foreground shadow-sm;
  }
}
EOF

# Step 14: Create essential placeholder files
log_info "Creating essential placeholder files..."

# Create index files for major directories
echo "export {};" > src/components/index.ts
echo "export {};" > src/pages/index.ts
echo "export {};" > src/hooks/index.ts
echo "export {};" > src/services/index.ts
echo "export {};" > src/stores/index.ts
echo "export {};" > src/types/index.ts
echo "export {};" > src/utils/index.ts
echo "export {};" > src/constants/index.ts

# Create placeholder components
cat > src/components/ui/Button/Button.tsx << 'EOF'
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'default', 
  size = 'default',
  loading = false,
  disabled,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-primary-600 text-white hover:bg-primary-700',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    ghost: 'hover:bg-gray-100',
    link: 'text-primary-600 underline-offset-4 hover:underline',
  };
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button 
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};
EOF

echo 'export { Button } from "./Button";' > src/components/ui/Button/index.ts

# Create basic pages
cat > src/pages/AppRoutes.tsx << 'EOF'
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from './dashboard/DashboardPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
};
EOF

cat > src/pages/dashboard/DashboardPage.tsx << 'EOF'
import React from 'react';
import { Button } from '@components/ui/Button';

export const DashboardPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-4">Welcome to the SConnect Admin Dashboard</p>
      <Button>Get Started</Button>
    </div>
  );
};
EOF

# Step 15: Create test infrastructure
log_info "Creating test infrastructure..."
mkdir -p tests/{__mocks__,fixtures,utils,unit,integration,e2e}
mkdir -p tests/__mocks__/api
mkdir -p tests/unit/{components,hooks,services,utils,stores}
mkdir -p tests/integration/{api,auth,pages}

cat > tests/setup.ts << 'EOF'
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';

// Setup tests
beforeAll(() => {
  // Global test setup
});

afterEach(() => {
  cleanup();
});

afterAll(() => {
  // Global test cleanup
});
EOF

cat > tests/utils/renderWithProviders.tsx << 'EOF'
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
EOF

# Step 16: Create Git files
log_info "Creating Git configuration files..."
cat > .gitignore << 'EOF'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Testing
coverage
test-results

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Cache
.cache
.parcel-cache

# Build outputs
build/
out/

# Dependencies
node_modules/
.pnp
.pnp.js

# TypeScript
*.tsbuildinfo
next-env.d.ts
EOF

# Step 17: Create basic context files
log_info "Creating context files..."
mkdir -p src/contexts

cat > src/contexts/AuthContext.tsx << 'EOF'
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual login logic
      const mockUser: User = {
        id: '1',
        username,
        email: `${username}@example.com`,
        roles: ['admin'],
        permissions: ['read', 'write', 'delete'],
      };
      setUser(mockUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
EOF

# Step 18: Create README for the app
log_info "Creating application README..."
cat > README.md << 'EOF'
# SConnect Admin Application

Modern admin dashboard for the SConnect platform built with React, TypeScript, Vite, and Tailwind CSS.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Building
```bash
npm run build
```

### Testing
```bash
# Unit tests
npm run test

# E2E tests  
npm run test:e2e

# Coverage
npm run test:coverage
```

### Linting
```bash
npm run lint
npm run lint:fix
```

## Project Structure

See `../docs/PROJECT_STRUCTURE.md` for detailed information about the file organization.

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Headless UI** - Accessible components
- **React Query** - Server state management
- **Zustand** - Client state management
- **React Hook Form** - Form management
- **Zod** - Validation
- **Vitest** - Unit testing
- **Playwright** - E2E testing

## Features

- Button management
- Category management  
- User administration
- Data purging tools
- Analytics dashboard
- Role-based access control

## Development Guidelines

- Follow the architectural principles in `../docs/ARCHITECTURE.md`
- Use the code examples in `../docs/CODE_EXAMPLES.md`
- Refer to API documentation in `../docs/API_REFERENCE.md`
EOF

log_success "Application structure created successfully!"

# Step 19: Final validation
log_info "Validating created structure..."

VALIDATION_ERRORS=0

# Check critical files exist
CRITICAL_FILES=(
    "package.json"
    "tsconfig.json"
    "vite.config.ts"
    "src/main.tsx"
    "src/App.tsx"
    "public/index.html"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        log_error "Critical file missing: $file"
        VALIDATION_ERRORS=$((VALIDATION_ERRORS + 1))
    fi
done

# Check critical directories exist
CRITICAL_DIRS=(
    "src/components"
    "src/pages" 
    "src/hooks"
    "src/services"
    "tests"
)

for dir in "${CRITICAL_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        log_error "Critical directory missing: $dir"
        VALIDATION_ERRORS=$((VALIDATION_ERRORS + 1))
    fi
done

if [ $VALIDATION_ERRORS -eq 0 ]; then
    log_success "Structure validation passed!"
else
    log_error "Structure validation failed with $VALIDATION_ERRORS errors"
    exit 1
fi

# Step 20: Final instructions
log_success "SConnect Admin Application initialization complete!"
echo ""
log_info "Next steps:"
echo "1. cd app"
echo "2. npm install"
echo "3. npm run dev"
echo ""
log_info "The application will be available at http://localhost:3000"
echo ""
log_warning "Remember to:"
echo "- Update environment variables in .env files"
echo "- Configure API endpoints for your environment"
echo "- Set up authentication providers"
echo "- Review and customize the generated code"
EOF