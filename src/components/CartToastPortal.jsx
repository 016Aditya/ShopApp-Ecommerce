/**
 * CartToastPortal.jsx — Single global toast renderer
 *
 * Mounted ONCE in App.jsx (above the router).
 * Uses ReactDOM.createPortal to attach directly to document.body,
 * completely escaping any CSS stacking contexts, transforms, or
 * overflow:hidden containers in the component tree.
 *
 * This is why the toast was not appearing on the Products page:
 * each <CartToast> was rendered inside a CSS grid cell which created
 * a stacking context that trapped position:fixed in some browsers.
 */
import ReactDOM from 'react-dom';
import { useToastStore } from '@/store/toastStore';
import CartToast from '@/components/CartToast';

const CartToastPortal = () => {
  const visible = useToastStore((s) => s.visible);

  // Portal renders into document.body — completely outside React’s
  // component tree, immune to any ancestor overflow/transform/z-index.
  return ReactDOM.createPortal(
    <CartToast visible={visible} />,
    document.body
  );
};

export default CartToastPortal;
