# SConnect Admin Application - Architecture Guide

## 🏗️ Architectural Philosophy

This architecture guide establishes the foundational principles for building a maintainable, scalable, and robust React application. It enforces SOLID principles, DRY practices, and provides concrete guidelines to prevent anti-patterns and ensure code quality throughout the development lifecycle.

## 🔧 SOLID Principles Implementation

### **Single Responsibility Principle (SRP)**

Each module, component, and function should have one reason to change and one clear responsibility.

**Implementation Rules:**
- Components handle only UI rendering and user interaction
- Hooks manage state and side effects
- Services handle business logic and API communication
- Utils provide pure utility functions
- Types define data contracts

**Concrete Examples:**

```typescript
// ❌ VIOLATION: Component doing too much
const BadButtonManager = () => {
  const [buttons, setButtons] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchButtons = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/buttons');
      const data = await response.json();
      setButtons(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const validateButton = (button) => {
    return button.name && button.url;
  };
  
  return <div>{/* Complex UI logic */}</div>;
};

// ✅ CORRECT: Separated responsibilities
const ButtonManager = () => {
  const { buttons, loading, error } = useButtons();
  
  return (
    <div>
      {loading && <LoadingSpinner />}
      {error && <ErrorAlert error={error} />}
      <ButtonList buttons={buttons} />
    </div>
  );
};
```

**Enforcement Rules:**
- Maximum 50 lines per component function
- Maximum 3 hooks per component
- No API calls directly in components
- No business logic in components

### **Open/Closed Principle (OCP)**

Software entities should be open for extension but closed for modification.

**Implementation Rules:**
- Use composition over inheritance
- Leverage TypeScript generics for reusable components
- Implement plugin-like patterns for extending functionality
- Use React's children prop and render props patterns

**Concrete Examples:**

```typescript
// ✅ CORRECT: Extensible data table component
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
}

const DataTable = <T,>({ data, columns, onRowClick, actions, filters }: DataTableProps<T>) => {
  return (
    <div>
      {filters && <div className="mb-4">{filters}</div>}
      <table>
        {/* Table implementation */}
      </table>
      {actions && <div className="mt-4">{actions}</div>}
    </div>
  );
};

// Usage - Extended without modifying the base component
const ButtonTable = () => {
  const buttonColumns = [
    { key: 'name', label: 'Name' },
    { key: 'url', label: 'URL' },
  ];
  
  return (
    <DataTable
      data={buttons}
      columns={buttonColumns}
      filters={<ButtonFilters />}
      actions={<BulkActions />}
    />
  );
};
```

**Enforcement Rules:**
- New features added through composition, not modification
- Base components remain unchanged when adding functionality
- Use TypeScript generics for reusable components
- Implement extensible plugin patterns

### **Liskov Substitution Principle (LSP)**

Objects of a supertype should be replaceable with objects of their subtypes without altering correctness.

**Implementation Rules:**
- Interface contracts must be honored by all implementations
- Subcomponents must work wherever parent components work
- API service implementations must be interchangeable
- Hook implementations must be substitutable

**Concrete Examples:**

```typescript
// ✅ CORRECT: Substitutable API services
interface ApiService {
  get<T>(endpoint: string): Promise<T>;
  post<T>(endpoint: string, data: unknown): Promise<T>;
  put<T>(endpoint: string, data: unknown): Promise<T>;
  delete(endpoint: string): Promise<void>;
}

class RestApiService implements ApiService {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(endpoint);
    return response.json();
  }
  // ... other methods
}

class MockApiService implements ApiService {
  async get<T>(endpoint: string): Promise<T> {
    return mockData[endpoint] as T;
  }
  // ... other methods
}

// Both services can be used interchangeably
const useApiService = (): ApiService => {
  return process.env.NODE_ENV === 'test' 
    ? new MockApiService() 
    : new RestApiService();
};
```

**Enforcement Rules:**
- All interface implementations must be fully compatible
- Subcomponents must accept same props as parent components
- Service implementations must have identical public APIs
- Error handling contracts must be consistent

### **Interface Segregation Principle (ISP)**

No client should be forced to depend on methods it does not use.

**Implementation Rules:**
- Create focused, specific interfaces
- Split large interfaces into smaller, cohesive ones
- Components should only receive props they actually use
- Services should have focused, single-purpose methods

**Concrete Examples:**

```typescript
// ❌ VIOLATION: Bloated interface
interface BadUserActions {
  createUser(data: CreateUserData): Promise<User>;
  updateUser(id: string, data: UpdateUserData): Promise<User>;
  deleteUser(id: string): Promise<void>;
  getUserAnalytics(id: string): Promise<Analytics>;
  exportUserData(id: string): Promise<Blob>;
  sendNotification(id: string, message: string): Promise<void>;
}

// ✅ CORRECT: Segregated interfaces
interface UserCrudService {
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
}

interface UserAnalyticsService {
  getAnalytics(id: string): Promise<Analytics>;
  exportData(id: string): Promise<Blob>;
}

interface UserNotificationService {
  sendNotification(id: string, message: string): Promise<void>;
}
```

**Enforcement Rules:**
- Maximum 5 methods per interface
- Interfaces should have single, clear purpose
- Components should not receive unused props
- Services should be composable, not monolithic

### **Dependency Inversion Principle (DIP)**

High-level modules should not depend on low-level modules. Both should depend on abstractions.

**Implementation Rules:**
- Depend on interfaces, not concrete implementations
- Use dependency injection through React Context
- Abstract external dependencies behind interfaces
- Invert control through higher-order components and hooks

**Concrete Examples:**

```typescript
// ✅ CORRECT: Dependency inversion with React Context
interface NotificationService {
  show(message: string, type: 'success' | 'error' | 'info'): void;
  hide(id: string): void;
}

const NotificationContext = createContext<NotificationService | null>(null);

// High-level component depends on abstraction
const useNotifications = (): NotificationService => {
  const service = useContext(NotificationContext);
  if (!service) {
    throw new Error('NotificationService not provided');
  }
  return service;
};

// Low-level implementation
class ToastNotificationService implements NotificationService {
  show(message: string, type: 'success' | 'error' | 'info'): void {
    toast[type](message);
  }
  
  hide(id: string): void {
    toast.dismiss(id);
  }
}

// Usage in component
const ButtonForm = () => {
  const notifications = useNotifications(); // Depends on abstraction
  
  const handleSubmit = async () => {
    try {
      await createButton(data);
      notifications.show('Button created successfully', 'success');
    } catch (error) {
      notifications.show('Failed to create button', 'error');
    }
  };
};
```

**Enforcement Rules:**
- No direct imports of implementation classes in components
- All external dependencies abstracted behind interfaces
- Use React Context for dependency injection
- Mock implementations for testing

## 🔄 DRY Principle Implementation

### **Don't Repeat Yourself Guidelines**

**Code Duplication Prevention Rules:**
1. Extract common logic into custom hooks
2. Create reusable utility functions
3. Use component composition for shared UI patterns
4. Implement shared constants and configurations
5. Abstract common API patterns

**Concrete Examples:**

```typescript
// ✅ CORRECT: DRY implementation with custom hooks
const useFormWithValidation = <T>(
  initialValues: T,
  validationSchema: ZodSchema<T>,
  onSubmit: (values: T) => Promise<void>
) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validate = (data: T) => {
    try {
      validationSchema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMap = error.flatten().fieldErrors;
        setErrors(errorMap as Record<string, string>);
      }
      return false;
    }
  };
  
  const handleSubmit = async () => {
    if (validate(values)) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return { values, setValues, errors, isSubmitting, handleSubmit };
};

// Reused across multiple forms
const ButtonForm = () => {
  const { values, setValues, errors, isSubmitting, handleSubmit } = 
    useFormWithValidation(initialButtonData, buttonSchema, createButton);
    
  return <form onSubmit={handleSubmit}>{/* Form implementation */}</form>;
};
```

**Enforcement Rules:**
- No code block duplicated more than twice
- Extract shared logic into utilities or hooks
- Use configuration objects for similar components
- Implement base classes for similar services

## 🚫 Anti-Pattern Prevention

### **Spaghetti Code Prevention**

**Rules:**
- Maximum 3 levels of component nesting in JSX
- No complex conditional logic in render methods
- Extract complex calculations into useMemo hooks
- Use early returns to reduce nesting

```typescript
// ❌ VIOLATION: Spaghetti code
const BadComponent = () => {
  return (
    <div>
      {data ? (
        data.length > 0 ? (
          data.map(item => (
            <div key={item.id}>
              {item.active ? (
                item.featured ? (
                  <FeaturedItem item={item} />
                ) : (
                  <RegularItem item={item} />
                )
              ) : (
                <InactiveItem item={item} />
              )}
            </div>
          ))
        ) : (
          <EmptyState />
        )
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

// ✅ CORRECT: Clean structure with early returns
const GoodComponent = () => {
  if (!data) return <LoadingSpinner />;
  if (data.length === 0) return <EmptyState />;
  
  return (
    <div>
      {data.map(item => (
        <ItemRenderer key={item.id} item={item} />
      ))}
    </div>
  );
};

const ItemRenderer = ({ item }: { item: Item }) => {
  if (!item.active) return <InactiveItem item={item} />;
  if (item.featured) return <FeaturedItem item={item} />;
  return <RegularItem item={item} />;
};
```

### **Monster Class/Component Prevention**

**Rules:**
- Maximum 100 lines per component
- Maximum 50 lines per function
- Maximum 10 props per component
- Break large components into smaller, focused components

```typescript
// ❌ VIOLATION: Monster component
const BadUserManagement = () => {
  // 200+ lines of state, effects, handlers, and render logic
  // Multiple responsibilities mixed together
};

// ✅ CORRECT: Decomposed components
const UserManagement = () => {
  return (
    <div>
      <UserFilters />
      <UserList />
      <UserActions />
    </div>
  );
};

const UserList = () => {
  const { users, loading } = useUsers();
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};
```

**Enforcement Rules:**
- ESLint rules for maximum line counts
- Automated complexity analysis
- Code review checklist items
- Refactoring triggers at size thresholds

### **Props Drilling Prevention**

**Rules:**
- Use React Context for data needed by 3+ component levels
- Implement compound component patterns
- Use state management libraries for global state
- Avoid passing props through more than 2 levels

```typescript
// ✅ CORRECT: Context to prevent props drilling
const UserContext = createContext<{
  currentUser: User | null;
  permissions: Permission[];
  updateUser: (user: User) => void;
} | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  
  const updateUser = (user: User) => {
    setCurrentUser(user);
  };
  
  return (
    <UserContext.Provider value={{ currentUser, permissions, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
```

## 📏 Enforceable Guidelines

### **Component Size Limits**
- **Function Components**: Maximum 100 lines
- **Custom Hooks**: Maximum 75 lines
- **Service Methods**: Maximum 50 lines
- **Utility Functions**: Maximum 25 lines

### **Complexity Rules**
- **Cyclomatic Complexity**: Maximum 10 per function
- **Component Props**: Maximum 10 props
- **Function Parameters**: Maximum 5 parameters
- **Nested Ternary Operators**: Maximum 2 levels

### **File Organization Rules**
- **Exports per File**: Maximum 3 public exports
- **Imports per File**: Maximum 20 imports
- **File Line Count**: Maximum 300 lines
- **Directory Depth**: Maximum 4 levels

### **Naming Conventions**
- **Components**: PascalCase (e.g., `ButtonManager`)
- **Hooks**: camelCase starting with 'use' (e.g., `useButtons`)
- **Services**: camelCase ending with 'Service' (e.g., `buttonService`)
- **Types/Interfaces**: PascalCase (e.g., `ButtonData`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `API_ENDPOINTS`)

## 🎯 Design Patterns Implementation

### **Provider Pattern**
Used for dependency injection and context sharing:

```typescript
const ApiProvider = ({ children }: { children: ReactNode }) => {
  const apiService = useMemo(() => new ApiService(), []);
  
  return (
    <ApiContext.Provider value={apiService}>
      {children}
    </ApiContext.Provider>
  );
};
```

### **Factory Pattern**
Used for creating service instances:

```typescript
class ServiceFactory {
  static createApiService(environment: Environment): ApiService {
    switch (environment) {
      case 'development':
        return new DevApiService();
      case 'production':
        return new ProdApiService();
      default:
        return new MockApiService();
    }
  }
}
```

### **Observer Pattern**
Used for event handling and state updates:

```typescript
class EventEmitter {
  private listeners: Map<string, Function[]> = new Map();
  
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }
  
  emit(event: string, data?: unknown): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }
}
```

### **Command Pattern**
Used for action handling and undo functionality:

```typescript
interface Command {
  execute(): Promise<void>;
  undo(): Promise<void>;
}

class CreateButtonCommand implements Command {
  constructor(
    private buttonData: CreateButtonData,
    private buttonService: ButtonService
  ) {}
  
  async execute(): Promise<void> {
    this.createdButton = await this.buttonService.create(this.buttonData);
  }
  
  async undo(): Promise<void> {
    if (this.createdButton) {
      await this.buttonService.delete(this.createdButton.id);
    }
  }
}
```

## 🔧 Technology-Specific Best Practices

### **React Best Practices**
1. Use functional components exclusively
2. Implement proper error boundaries
3. Optimize renders with React.memo for expensive components
4. Use useCallback and useMemo judiciously
5. Implement proper cleanup in useEffect

### **TypeScript Best Practices**
1. Enable strict mode in tsconfig.json
2. Use branded types for IDs and sensitive data
3. Implement proper discriminated unions
4. Use const assertions for immutable data
5. Avoid 'any' type - use 'unknown' instead

### **Tailwind CSS Best Practices**
1. Use design tokens defined in config
2. Create component classes for repeated patterns
3. Use responsive design utilities consistently
4. Implement dark mode with CSS variables
5. Extract complex utilities into CSS classes

### **React Query Best Practices**
1. Use query key factories for consistent caching
2. Implement proper error handling
3. Use optimistic updates for better UX
4. Cache invalidation strategies
5. Proper loading and error states

## 📊 Code Quality Standards

### **Testing Requirements**
- **Unit Test Coverage**: Minimum 80%
- **Integration Test Coverage**: Minimum 60%
- **E2E Test Coverage**: All critical user journeys
- **Accessibility Testing**: 100% compliance with WCAG 2.1 AA

### **Performance Standards**
- **Bundle Size**: Maximum 500KB gzipped
- **First Contentful Paint**: < 1.5 seconds
- **Time to Interactive**: < 3 seconds
- **Core Web Vitals**: All metrics in "Good" range

### **Security Standards**
- No hardcoded secrets or API keys
- Proper input validation and sanitization
- XSS prevention through proper escaping
- CSRF protection implementation
- Secure authentication token handling

This architecture guide ensures consistent, maintainable, and scalable code throughout the SConnect Admin application while preventing common anti-patterns and enforcing industry best practices.