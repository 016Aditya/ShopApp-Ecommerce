/**
 * CartToast.jsx — backwards-compatibility shim
 *
 * The real cart toast is now rendered by CartToastPortal using
 * AppToast.jsx. This file is kept so any existing import of
 * CartToast across the codebase doesn't break during the migration.
 *
 * If you find an import of CartToast somewhere, replace it with
 * the toastStore pattern: import { useToastStore } and call
 * showCartToast() — do NOT render CartToast directly.
 *
 * @deprecated  Direct use deprecated. Use toastStore.showCartToast().
 */
import AppToast from './AppToast';

const CartToast = (props) => <AppToast {...props} />;
export default CartToast;
