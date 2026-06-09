import { useNavigate } from "react-router-dom";
import PATHS from "@/routes/paths";

const CartEmpty = () => {
  const navigate = useNavigate();

  return (
    <div className="empty-state">
      <p className="empty-state__message">Your cart is empty.</p>
      <button
        className="btn btn--primary"
        onClick={() => navigate(PATHS.PRODUCTS)}
      >
        Browse Products
      </button>
    </div>
  );
};

export default CartEmpty;