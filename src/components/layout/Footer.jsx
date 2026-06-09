import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";

function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container-app flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">ShopApp</h3>
          <p className="text-sm text-slate-500">
            A modern e-commerce frontend built with React and Tailwind CSS.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          <Link to={PATHS.HOME} className="hover:text-blue-600">
            Home
          </Link>
          <Link to={PATHS.SHOP} className="hover:text-blue-600">
            Shop
          </Link>
          <Link to={PATHS.CART} className="hover:text-blue-600">
            Cart
          </Link>
          <Link to={PATHS.LOGIN} className="hover:text-blue-600">
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;