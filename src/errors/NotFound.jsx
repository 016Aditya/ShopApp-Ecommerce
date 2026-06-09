import { Link } from "react-router-dom";
import Button from "@/components/common/Button";
import PageLayout from "@/components/layout/PageLayout";
import { PATHS } from "@/routes/paths";

function NotFound() {
  return (
    <PageLayout
      title="404 - Page Not Found"
      description="The page you are looking for does not exist or may have been moved."
    >
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-slate-500">
          Try going back to the home page or continue shopping.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link to={PATHS.HOME}>
            <Button>Go Home</Button>
          </Link>
          <Link to={PATHS.SHOP}>
            <Button variant="secondary">Browse Shop</Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}

export default NotFound;