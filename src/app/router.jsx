import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes/AppRoutes";

function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default AppRouter;