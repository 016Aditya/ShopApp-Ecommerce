import { Link } from "react-router-dom";
import PATHS from "@/routes/paths";

function Footer() {
  return (
    <footer className="bg-[#172337] text-slate-300 mt-0">
      <div className="container-app py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">About</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">About ShopApp</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Help</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Payments</a></li>
              <li><a href="#" className="hover:text-white transition">Shipping</a></li>
              <li><a href="#" className="hover:text-white transition">Returns</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Policy</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Return Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Use</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Social</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-700 pt-6 text-center text-xs text-slate-500">
          © 2026 ShopApp. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
