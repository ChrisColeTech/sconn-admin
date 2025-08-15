interface ToastMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export function useToast() {
  const showToast = (toast: ToastMessage) => {
    // Simple console implementation for now
    console.log(`[${toast.type.toUpperCase()}] ${toast.title}: ${toast.message}`);
    
    // In a real implementation, this would integrate with a toast notification system
    // For now, we'll just log to console to prevent compilation errors
  };

  return { showToast };
}