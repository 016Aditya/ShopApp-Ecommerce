import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes/AppRoutes";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function AppRouter() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1">
          <AppRoutes />
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default AppRouter;