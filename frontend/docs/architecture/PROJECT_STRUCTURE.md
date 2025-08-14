# SConnect Admin Application - Project Structure

## 📁 Complete File and Folder Organization

This document serves as the centralized reference for all file organization within the SConnect Admin application. The structure follows domain-driven design principles, SOLID principles, and React best practices for maintainability and scalability.

## 🏗️ Root Directory Structure

```
frontend/
├── REQUIREMENTS.md                    # Project requirements document
├── docs/                             # Complete documentation suite
│   ├── README.md                     # Comprehensive requirements analysis
│   ├── IMPLEMENTATION_PLAN.md        # Phase-by-phase implementation guide
│   ├── PROJECT_STRUCTURE.md          # This file - centralized structure reference
│   ├── ARCHITECTURE.md               # SOLID principles and design patterns
│   ├── API_REFERENCE.md              # Complete API documentation
│   └── CODE_EXAMPLES.md              # Implementation pattern examples
├── scripts/                          # Development and deployment scripts
│   ├── init-app.sh                   # Application initialization script
│   ├── build.sh                      # Production build script
│   ├── deploy.sh                     # Deployment automation script
│   └── test.sh                       # Testing automation script
└── app/                              # Main application directory (created by init script)
    ├── [Complete Application Structure] # Detailed below
    └── tests/                        # Test infrastructure
```

## 🎯 Application Directory Structure

```
app/
├── public/                           # Static assets and public files
│   ├── index.html                    # Main HTML template
│   ├── favicon.ico                   # Application favicon
│   ├── manifest.json                 # PWA manifest
│   ├── robots.txt                    # Search engine directives
│   └── assets/                       # Static assets
│       ├── images/                   # Static images
│       ├── icons/                    # Application icons
│       └── fonts/                    # Custom fonts (if needed)
├── src/                              # Source code directory
│   ├── main.tsx                      # Application entry point
│   ├── App.tsx                       # Root application component
│   ├── vite-env.d.ts                 # Vite environment types
│   ├── components/                   # Reusable UI components
│   ├── pages/                        # Page components organized by domain
│   ├── hooks/                        # Custom React hooks
│   ├── services/                     # API and business logic services
│   ├── stores/                       # State management
│   ├── types/                        # TypeScript type definitions
│   ├── utils/                        # Utility functions
│   ├── constants/                    # Application constants
│   ├── styles/                       # Global styles and theme
│   └── lib/                          # Third-party library configurations
├── tests/                            # Test infrastructure
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── vite.config.ts                    # Vite build configuration
├── vitest.config.ts                  # Vitest testing configuration
├── .eslintrc.json                    # ESLint configuration
├── .prettierrc                       # Prettier configuration
├── .gitignore                        # Git ignore rules
└── README.md                         # Application-specific documentation
```

## 🧩 Components Directory Structure - **SINGLE SOURCE OF TRUTH**

```
src/components/
├── ui/                               # Basic UI building blocks
│   ├── Button/                       # Button component family
│   │   ├── Button.tsx                # Main button component
│   │   ├── Button.test.tsx           # Button tests
│   │   ├── ButtonGroup.tsx           # Button group component
│   │   └── index.ts                  # Public exports
│   ├── Input/                        # Input component family
│   │   ├── Input.tsx                 # Basic input component
│   │   ├── TextArea.tsx              # Textarea component
│   │   ├── Select.tsx                # Select dropdown component
│   │   ├── Checkbox.tsx              # Checkbox component
│   │   ├── Radio.tsx                 # Radio button component
│   │   └── index.ts                  # Public exports
│   ├── Modal/                        # Modal component family
│   │   ├── Modal.tsx                 # Base modal component
│   │   ├── ConfirmModal.tsx          # Confirmation modal
│   │   ├── FormModal.tsx             # Form modal wrapper
│   │   └── index.ts                  # Public exports
│   ├── Table/                        # Data table components
│   │   ├── Table.tsx                 # Main table component
│   │   ├── TableHeader.tsx           # Table header component
│   │   ├── TableRow.tsx              # Table row component
│   │   ├── TableCell.tsx             # Table cell component
│   │   ├── TablePagination.tsx       # Pagination component
│   │   └── index.ts                  # Public exports
│   ├── Card/                         # Card component family
│   │   ├── Card.tsx                  # Basic card component
│   │   ├── StatsCard.tsx             # Statistics card
│   │   ├── InfoCard.tsx              # Information card
│   │   └── index.ts                  # Public exports
│   ├── Loading/                      # Loading state components
│   │   ├── Spinner.tsx               # Loading spinner
│   │   ├── Skeleton.tsx              # Skeleton loader
│   │   ├── ProgressBar.tsx           # Progress indicator
│   │   └── index.ts                  # Public exports
│   ├── Alert/                        # Alert and notification components
│   │   ├── Alert.tsx                 # Alert component
│   │   ├── Toast.tsx                 # Toast notification
│   │   ├── Banner.tsx                # Banner notification
│   │   └── index.ts                  # Public exports
│   └── index.ts                      # UI components public exports
├── layout/                           # Layout-specific components
│   ├── AppLayout/                    # Main application layout
│   │   ├── AppLayout.tsx             # Main layout component
│   │   ├── AppLayout.test.tsx        # Layout tests
│   │   └── index.ts                  # Public exports
│   ├── Sidebar/                      # Navigation sidebar
│   │   ├── Sidebar.tsx               # Sidebar component
│   │   ├── SidebarItem.tsx           # Sidebar navigation item
│   │   ├── SidebarGroup.tsx          # Sidebar group component
│   │   └── index.ts                  # Public exports
│   ├── Header/                       # Application header
│   │   ├── Header.tsx                # Header component
│   │   ├── UserProfile.tsx           # User profile dropdown
│   │   ├── NotificationCenter.tsx    # Notification center
│   │   └── index.ts                  # Public exports
│   ├── Breadcrumbs/                  # Breadcrumb navigation
│   │   ├── Breadcrumbs.tsx           # Breadcrumb component
│   │   ├── BreadcrumbItem.tsx        # Individual breadcrumb
│   │   └── index.ts                  # Public exports
│   └── index.ts                      # Layout components public exports
├── forms/                            # Form-related components
│   ├── FormField/                    # Form field wrapper
│   │   ├── FormField.tsx             # Form field component
│   │   ├── FormLabel.tsx             # Form label component
│   │   ├── FormError.tsx             # Form error display
│   │   └── index.ts                  # Public exports
│   ├── SearchForm/                   # Search functionality
│   │   ├── SearchForm.tsx            # Search form component
│   │   ├── SearchFilters.tsx         # Search filters
│   │   ├── AdvancedSearch.tsx        # Advanced search modal
│   │   └── index.ts                  # Public exports
│   ├── BulkActions/                  # Bulk operation components
│   │   ├── BulkActionBar.tsx         # Bulk action toolbar
│   │   ├── BulkSelector.tsx          # Bulk selection component
│   │   ├── BulkConfirm.tsx           # Bulk operation confirmation
│   │   └── index.ts                  # Public exports
│   └── index.ts                      # Form components public exports
├── data/                             # Data display components
│   ├── DataTable/                    # Advanced data table
│   │   ├── DataTable.tsx             # Main data table component
│   │   ├── DataTableFilters.tsx      # Table filtering
│   │   ├── DataTableSort.tsx         # Table sorting
│   │   ├── DataTableExport.tsx       # Export functionality
│   │   └── index.ts                  # Public exports
│   ├── Charts/                       # Data visualization
│   │   ├── BarChart.tsx              # Bar chart component
│   │   ├── LineChart.tsx             # Line chart component
│   │   ├── PieChart.tsx              # Pie chart component
│   │   └── index.ts                  # Public exports
│   ├── Metrics/                      # Metrics display
│   │   ├── MetricCard.tsx            # Individual metric card
│   │   ├── MetricGrid.tsx            # Metrics grid layout
│   │   ├── MetricTrend.tsx           # Trend indicator
│   │   └── index.ts                  # Public exports
│   └── index.ts                      # Data components public exports
├── domain/                           # Domain-specific components (SINGLE LOCATION)
│   ├── auth/                         # Authentication components
│   │   ├── LoginForm.tsx             # Login form component
│   │   └── index.ts                  # Public exports
│   ├── dashboard/                    # Dashboard components
│   │   ├── SystemMetrics.tsx         # System metrics widget
│   │   ├── QuickActions.tsx          # Quick action buttons
│   │   ├── RecentActivity.tsx        # Recent activity feed
│   │   ├── UsageAnalytics.tsx        # Usage analytics charts
│   │   └── index.ts                  # Public exports
│   ├── buttons/                      # Button management components
│   │   ├── ButtonForm.tsx            # Button create/edit form
│   │   ├── ButtonList.tsx            # Button listing component
│   │   ├── ButtonFilters.tsx         # Button filtering
│   │   ├── ButtonActions.tsx         # Button action buttons
│   │   ├── ButtonRelationships.tsx   # Button-category relationships
│   │   └── index.ts                  # Public exports
│   ├── categories/                   # Category management components
│   │   ├── CategoryForm.tsx          # Category create/edit form
│   │   ├── CategoryList.tsx          # Category listing component
│   │   ├── CategoryHierarchy.tsx     # Category hierarchy view
│   │   ├── CategoryAssignments.tsx   # Button assignments view
│   │   └── index.ts                  # Public exports
│   ├── relationships/                # Relationship management components
│   │   ├── RelationshipMatrix.tsx    # Relationship matrix view
│   │   ├── DragDropAssignment.tsx    # Drag-drop assignment
│   │   ├── BulkAssignment.tsx        # Bulk assignment tool
│   │   ├── RelationshipConfig.tsx    # Relationship configuration
│   │   └── index.ts                  # Public exports
│   ├── users/                        # User management components
│   │   ├── UserList.tsx              # User listing component
│   │   ├── UserProfile.tsx           # User profile display
│   │   ├── UserActivity.tsx          # User activity log
│   │   ├── UserBulkActions.tsx       # User bulk operations
│   │   └── index.ts                  # Public exports
│   ├── favorites/                    # Favorites management components
│   │   ├── FavoriteList.tsx          # Favorites listing
│   │   ├── FavoriteModeration.tsx    # Moderation tools
│   │   ├── FavoriteAnalytics.tsx     # Usage analytics
│   │   ├── FavoriteBulkActions.tsx   # Bulk operations
│   │   └── index.ts                  # Public exports
│   ├── settings/                     # Settings management components
│   │   ├── SettingList.tsx           # Settings listing
│   │   ├── SettingForm.tsx           # Settings form
│   │   ├── SettingTemplates.tsx      # Settings templates
│   │   ├── SettingAudit.tsx          # Audit trail display
│   │   └── index.ts                  # Public exports
│   ├── purge/                        # Data purge components
│   │   ├── DataAnalysis.tsx          # Data analysis display
│   │   ├── PurgePreview.tsx          # Purge preview component
│   │   ├── PurgeConfirmation.tsx     # Multi-step confirmation
│   │   ├── PurgeAudit.tsx            # Purge audit trail
│   │   ├── CascadeAnalysis.tsx       # CASCADE impact analysis
│   │   └── index.ts                  # Public exports
│   ├── admin/                        # System administration components
│   │   ├── AdminUserList.tsx         # Admin user listing
│   │   ├── RoleEditor.tsx            # Role editing component
│   │   ├── PermissionMatrix.tsx      # Permission matrix
│   │   ├── SecuritySettings.tsx      # Security configuration
│   │   └── index.ts                  # Public exports
│   ├── app-settings/                 # Application settings components
│   │   ├── EnvironmentSettings.tsx   # Environment configuration
│   │   ├── DebugSettings.tsx         # Debug mode settings
│   │   ├── ThemeSettings.tsx         # Theme customization
│   │   ├── FeatureFlags.tsx          # Feature flag management
│   │   ├── LogViewer.tsx             # Log viewing component
│   │   └── index.ts                  # Public exports
│   └── index.ts                      # Domain components public exports
└── index.ts                          # All components public exports
```

## 📄 Pages Directory Structure - **CLEAN PAGES ONLY**

```
src/pages/
├── dashboard/                        # Dashboard domain
│   ├── DashboardPage.tsx             # Main dashboard page (imports from components/domain/dashboard)
│   └── index.ts                      # Dashboard page exports
├── buttons/                          # Button management domain
│   ├── ButtonListPage.tsx            # Button listing page (imports from components/domain/buttons)
│   ├── ButtonCreatePage.tsx          # Button creation page
│   ├── ButtonEditPage.tsx            # Button editing page
│   ├── ButtonDetailPage.tsx          # Button detail view
│   └── index.ts                      # Button pages exports
├── categories/                       # Category management domain  
│   ├── CategoryListPage.tsx          # Category listing page (imports from components/domain/categories)
│   ├── CategoryCreatePage.tsx        # Category creation page
│   ├── CategoryEditPage.tsx          # Category editing page
│   ├── CategoryDetailPage.tsx        # Category detail view
│   └── index.ts                      # Category pages exports
├── relationships/                    # Button-Category relationship domain
│   ├── RelationshipManagePage.tsx    # Relationship management page (imports from components/domain/relationships)
│   └── index.ts                      # Relationship pages exports
├── users/                            # User management domain
│   ├── UserListPage.tsx              # User listing page (imports from components/domain/users)
│   ├── UserDetailPage.tsx            # User detail view
│   ├── UserEditPage.tsx              # User editing page
│   └── index.ts                      # User pages exports
├── favorites/                        # Favorites management domain
│   ├── FavoriteListPage.tsx          # Favorites listing page (imports from components/domain/favorites)
│   ├── FavoriteDetailPage.tsx        # Favorite detail view
│   └── index.ts                      # Favorite pages exports
├── settings/                         # Settings management domain
│   ├── SettingListPage.tsx           # Settings listing page (imports from components/domain/settings)
│   ├── SettingEditPage.tsx           # Settings editing page
│   └── index.ts                      # Setting pages exports
├── purge/                            # Data purge domain
│   ├── PurgeManagePage.tsx           # Purge management page (imports from components/domain/purge)
│   └── index.ts                      # Purge pages exports
├── admin/                            # System administration domain
│   ├── AdminDashboardPage.tsx        # Admin dashboard (imports from components/domain/admin)
│   ├── AdminUserPage.tsx             # Admin user management
│   ├── RoleManagePage.tsx            # Role management
│   ├── PermissionPage.tsx            # Permission management
│   └── index.ts                      # Admin pages exports
├── app-settings/                     # Application settings domain
│   ├── AppSettingsPage.tsx           # Application settings page (imports from components/domain/app-settings)
│   └── index.ts                      # App settings exports
├── auth/                             # Authentication domain
│   ├── LoginPage.tsx                 # Login page (imports from components/domain/auth)
│   ├── LogoutPage.tsx                # Logout confirmation
│   └── index.ts                      # Auth pages exports
├── error/                            # Error handling pages
│   ├── NotFoundPage.tsx              # 404 error page
│   ├── ErrorPage.tsx                 # General error page
│   ├── UnauthorizedPage.tsx          # 401 unauthorized page
│   └── index.ts                      # Error pages exports
└── index.ts                          # All pages public exports
```

## 🔧 Hooks Directory Structure - **SINGLE SOURCE OF TRUTH**

```
src/hooks/
├── api/                              # API-related hooks
│   ├── useApi.ts                     # Base API hook
│   ├── useQuery.ts                   # Query hook wrapper
│   ├── useMutation.ts                # Mutation hook wrapper
│   ├── useInfiniteQuery.ts           # Infinite query hook
│   └── index.ts                      # API hooks exports
├── auth/                             # Authentication hooks
│   ├── useAuth.ts                    # Authentication state
│   ├── useAuthContext.ts             # Auth context hook
│   ├── usePermissions.ts             # Permission checking
│   └── index.ts                      # Auth hooks exports
├── ui/                               # UI-related hooks
│   ├── useModal.ts                   # Modal state management
│   ├── useToast.ts                   # Toast notification hook
│   ├── useLocalStorage.ts            # Local storage hook
│   ├── useSessionStorage.ts          # Session storage hook
│   ├── useDebounce.ts                # Debounce hook
│   ├── useThrottle.ts                # Throttle hook
│   ├── useClipboard.ts               # Clipboard operations
│   └── index.ts                      # UI hooks exports
├── form/                             # Form-related hooks
│   ├── useForm.ts                    # Form state management
│   ├── useFormValidation.ts          # Form validation
│   ├── useFieldArray.ts              # Dynamic field arrays
│   └── index.ts                      # Form hooks exports
├── navigation/                       # Navigation hooks
│   ├── useRouter.ts                  # Router utilities
│   ├── useBreadcrumbs.ts             # Breadcrumb generation
│   ├── useActiveRoute.ts             # Active route detection
│   └── index.ts                      # Navigation hooks exports
├── data/                             # Data management hooks
│   ├── useTable.ts                   # Table state management
│   ├── usePagination.ts              # Pagination logic
│   ├── useSort.ts                    # Sorting logic
│   ├── useFilter.ts                  # Filtering logic
│   ├── useSearch.ts                  # Search functionality
│   └── index.ts                      # Data hooks exports
├── domain/                           # Domain-specific hooks (SINGLE LOCATION)
│   ├── dashboard/                    # Dashboard hooks
│   │   ├── useDashboardData.ts       # Dashboard data fetching
│   │   ├── useMetrics.ts             # Metrics data hook
│   │   └── index.ts                  # Dashboard hooks exports
│   ├── buttons/                      # Button management hooks
│   │   ├── useButtons.ts             # Button data management
│   │   ├── useButtonForm.ts          # Button form logic
│   │   ├── useButtonActions.ts       # Button actions hook
│   │   └── index.ts                  # Button hooks exports
│   ├── categories/                   # Category management hooks
│   │   ├── useCategories.ts          # Category data management
│   │   ├── useCategoryForm.ts        # Category form logic
│   │   ├── useCategoryHierarchy.ts   # Hierarchy management
│   │   └── index.ts                  # Category hooks exports
│   ├── relationships/                # Relationship hooks
│   │   ├── useRelationships.ts       # Relationship data management
│   │   ├── useDragDrop.ts            # Drag-drop functionality
│   │   ├── useBulkAssignment.ts      # Bulk assignment logic
│   │   └── index.ts                  # Relationship hooks exports
│   ├── users/                        # User management hooks
│   │   ├── useUsers.ts               # User data management
│   │   ├── useUserActivity.ts        # User activity tracking
│   │   ├── useUserActions.ts         # User action hooks
│   │   └── index.ts                  # User hooks exports
│   ├── favorites/                    # Favorites hooks
│   │   ├── useFavorites.ts           # Favorite data management
│   │   ├── useModeration.ts          # Moderation functionality
│   │   ├── useFavoriteAnalytics.ts   # Analytics hooks
│   │   └── index.ts                  # Favorite hooks exports
│   ├── settings/                     # Settings hooks
│   │   ├── useSettings.ts            # Settings data management
│   │   ├── useSettingTemplates.ts    # Template management
│   │   ├── useSettingAudit.ts        # Audit trail hooks
│   │   └── index.ts                  # Setting hooks exports
│   ├── purge/                        # Data purge hooks
│   │   ├── usePurgeData.ts           # Purge data management
│   │   ├── usePurgePreview.ts        # Preview functionality
│   │   ├── usePurgeConfirmation.ts   # Confirmation workflow
│   │   └── index.ts                  # Purge hooks exports
│   ├── admin/                        # Admin hooks
│   │   ├── useAdminUsers.ts          # Admin user management
│   │   ├── useRoles.ts               # Role management
│   │   ├── usePermissions.ts         # Permission management
│   │   └── index.ts                  # Admin hooks exports
│   ├── app-settings/                 # App settings hooks
│   │   ├── useAppSettings.ts         # App settings management
│   │   ├── useEnvironment.ts         # Environment management
│   │   ├── useTheme.ts               # Theme management
│   │   └── index.ts                  # App settings hooks exports
│   └── index.ts                      # Domain hooks exports
└── index.ts                          # All hooks public exports
```

## 🔄 Services Directory Structure

```
src/services/
├── api/                              # API service layer
│   ├── client.ts                     # HTTP client configuration
│   ├── endpoints.ts                  # API endpoint definitions
│   ├── interceptors.ts               # Request/response interceptors
│   ├── types.ts                      # API type definitions
│   └── index.ts                      # API services exports
├── auth/                             # Authentication services
│   ├── authService.ts                # Authentication logic
│   ├── tokenService.ts               # Token management
│   ├── permissionService.ts          # Permission checking
│   └── index.ts                      # Auth services exports
├── domain/                           # Domain-specific services
│   ├── buttonService.ts              # Button business logic
│   ├── categoryService.ts            # Category business logic
│   ├── userService.ts                # User business logic
│   ├── favoriteService.ts            # Favorite business logic
│   ├── settingService.ts             # Setting business logic
│   ├── purgeService.ts               # Purge business logic
│   └── index.ts                      # Domain services exports
├── storage/                          # Storage services
│   ├── localStorageService.ts        # Local storage abstraction
│   ├── sessionStorageService.ts      # Session storage abstraction
│   ├── cacheService.ts               # Cache management
│   └── index.ts                      # Storage services exports
├── validation/                       # Validation services
│   ├── schemas.ts                    # Zod validation schemas
│   ├── validators.ts                 # Custom validation functions
│   └── index.ts                      # Validation exports
├── notification/                     # Notification services
│   ├── toastService.ts               # Toast notifications
│   ├── alertService.ts               # Alert notifications
│   └── index.ts                      # Notification exports
├── analytics/                        # Analytics services
│   ├── trackingService.ts            # Event tracking
│   ├── metricsService.ts             # Metrics collection
│   └── index.ts                      # Analytics exports
└── index.ts                          # All services public exports
```

## 🏪 Stores Directory Structure

```
src/stores/
├── auth/                             # Authentication state
│   ├── authStore.ts                  # Auth state management
│   ├── permissionStore.ts            # Permission state
│   └── index.ts                      # Auth stores exports
├── ui/                               # UI state
│   ├── themeStore.ts                 # Theme state
│   ├── sidebarStore.ts               # Sidebar state
│   ├── modalStore.ts                 # Modal state
│   ├── toastStore.ts                 # Toast state
│   └── index.ts                      # UI stores exports
├── app/                              # Application state
│   ├── appStore.ts                   # Global app state
│   ├── settingsStore.ts              # App settings state
│   ├── environmentStore.ts           # Environment state
│   └── index.ts                      # App stores exports
└── index.ts                          # All stores public exports
```

## 📝 Types Directory Structure

```
src/types/
├── api/                              # API-related types
│   ├── common.ts                     # Common API types
│   ├── responses.ts                  # API response types
│   ├── requests.ts                   # API request types
│   ├── errors.ts                     # API error types
│   └── index.ts                      # API types exports
├── domain/                           # Domain model types
│   ├── button.ts                     # Button domain types
│   ├── category.ts                   # Category domain types
│   ├── user.ts                       # User domain types
│   ├── favorite.ts                   # Favorite domain types
│   ├── setting.ts                    # Setting domain types
│   ├── purge.ts                      # Purge operation types
│   └── index.ts                      # Domain types exports
├── ui/                               # UI-related types
│   ├── components.ts                 # Component prop types
│   ├── forms.ts                      # Form-related types
│   ├── navigation.ts                 # Navigation types
│   └── index.ts                      # UI types exports
├── auth/                             # Authentication types
│   ├── auth.ts                       # Auth-related types
│   ├── permissions.ts                # Permission types
│   └── index.ts                      # Auth types exports
└── index.ts                          # All types public exports
```

## 🛠️ Utils Directory Structure

```
src/utils/
├── api/                              # API utilities
│   ├── queryKeys.ts                  # React Query key factories
│   ├── transforms.ts                 # Data transformation utils
│   ├── cache.ts                      # Cache utilities
│   └── index.ts                      # API utils exports
├── auth/                             # Auth utilities
│   ├── permissions.ts                # Permission checking utils
│   ├── tokens.ts                     # Token utilities
│   └── index.ts                      # Auth utils exports
├── format/                           # Formatting utilities
│   ├── date.ts                       # Date formatting
│   ├── number.ts                     # Number formatting
│   ├── string.ts                     # String utilities
│   ├── currency.ts                   # Currency formatting
│   └── index.ts                      # Format utils exports
├── validation/                       # Validation utilities
│   ├── schemas.ts                    # Common validation schemas
│   ├── rules.ts                      # Validation rules
│   └── index.ts                      # Validation utils exports
├── dom/                              # DOM utilities
│   ├── events.ts                     # Event utilities
│   ├── scroll.ts                     # Scroll utilities
│   ├── focus.ts                      # Focus management
│   └── index.ts                      # DOM utils exports
├── data/                             # Data utilities
│   ├── array.ts                      # Array utilities
│   ├── object.ts                     # Object utilities
│   ├── search.ts                     # Search utilities
│   ├── sort.ts                       # Sorting utilities
│   ├── filter.ts                     # Filtering utilities
│   └── index.ts                      # Data utils exports
└── index.ts                          # All utils public exports
```

## 📊 Constants Directory Structure

```
src/constants/
├── api.ts                            # API constants
├── auth.ts                           # Auth constants
├── routes.ts                         # Route constants
├── ui.ts                             # UI constants
├── validation.ts                     # Validation constants
├── environment.ts                    # Environment constants
├── features.ts                       # Feature flag constants
└── index.ts                          # All constants exports
```

## 🎨 Styles Directory Structure

```
src/styles/
├── globals.css                       # Global CSS styles
├── components.css                    # Component-specific styles
├── utilities.css                     # Utility classes
├── variables.css                     # CSS custom properties
└── themes/                           # Theme definitions
    ├── light.css                     # Light theme
    ├── dark.css                      # Dark theme
    └── index.ts                      # Theme exports
```

## 📚 Lib Directory Structure

```
src/lib/
├── axios.ts                          # Axios configuration
├── react-query.ts                    # React Query configuration
├── zod.ts                            # Zod configuration
├── tailwind.ts                       # Tailwind utilities
└── index.ts                          # Lib exports
```

## 🧪 Tests Directory Structure

```
tests/
├── __mocks__/                        # Test mocks
│   ├── api/                          # API mocks
│   ├── localStorage.ts               # LocalStorage mock
│   ├── intersectionObserver.ts       # IntersectionObserver mock
│   └── index.ts                      # Mock exports
├── fixtures/                         # Test data fixtures
│   ├── buttons.ts                    # Button test data
│   ├── categories.ts                 # Category test data
│   ├── users.ts                      # User test data
│   └── index.ts                      # Fixture exports
├── utils/                            # Test utilities
│   ├── renderWithProviders.tsx       # Test render utility
│   ├── mockServer.ts                 # MSW mock server
│   ├── testUtils.ts                  # General test utilities
│   └── index.ts                      # Test utils exports
├── unit/                             # Unit tests
│   ├── components/                   # Component tests
│   ├── hooks/                        # Hook tests
│   ├── services/                     # Service tests
│   ├── utils/                        # Utility tests
│   └── stores/                       # Store tests
├── integration/                      # Integration tests
│   ├── api/                          # API integration tests
│   ├── auth/                         # Auth flow tests
│   └── pages/                        # Page integration tests
├── e2e/                              # End-to-end tests
│   ├── auth.spec.ts                  # Auth E2E tests
│   ├── dashboard.spec.ts             # Dashboard E2E tests
│   ├── buttons.spec.ts               # Button management E2E
│   ├── categories.spec.ts            # Category management E2E
│   └── admin.spec.ts                 # Admin functionality E2E
├── setup.ts                          # Test setup configuration
├── vitest.config.ts                  # Vitest configuration
└── playwright.config.ts              # Playwright configuration
```

## 🔗 Module Dependencies and Import Structure

### **Import Hierarchy Rules**
1. **External Dependencies** (React, third-party libraries)
2. **Internal Types** (from `src/types`)
3. **Internal Services** (from `src/services`)
4. **Internal Hooks** (from `src/hooks`)
5. **Internal Components** (from `src/components`)
6. **Internal Utils** (from `src/utils`)
7. **Internal Constants** (from `src/constants`)
8. **Relative Imports** (same directory or subdirectories)

### **Dependency Flow**
```
Pages → Components → Hooks → Services → Utils/Constants
  ↓         ↓          ↓         ↓
Types ← ← ← ← ← ← ← ← ← ← ← ← ← ← Types
```

### **Circular Dependency Prevention**
- Components cannot import from Pages
- Hooks cannot import from Components
- Services cannot import from Hooks or Components
- Utils and Constants have no internal dependencies

## 📋 Component Organization Principles

### **Single Responsibility Principle**
- Each component has one clear purpose
- Business logic separated into hooks
- API logic separated into services

### **Composition Over Inheritance**
- Components composed from smaller components
- Shared behavior through hooks and HOCs
- Props-based customization

### **Modular Export Pattern**
- Each directory has an `index.ts` for public exports
- Internal components not exported publicly
- Clean import paths throughout application

This project structure ensures maintainability, scalability, and clear separation of concerns while following React and TypeScript best practices for enterprise applications.