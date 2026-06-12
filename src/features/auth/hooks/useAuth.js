// Re-export useAuth from the canonical AuthContext so every import path works:
//   import useAuth from "@/features/auth/hooks/useAuth"   ← Navbar, etc.
//   import { useAuth } from "@/context/AuthContext"        ← hooks/routes
import { useAuth } from "@/context/AuthContext";
export default useAuth;