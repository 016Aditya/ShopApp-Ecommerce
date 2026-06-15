import { create } from 'zustand';

export const useUIStore = create((set) => ({
  // Toast notifications managed by react-hot-toast
  // This store is for other global UI state

  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
}));
