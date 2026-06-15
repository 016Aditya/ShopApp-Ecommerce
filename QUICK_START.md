# Quick Start Guide - New Features

## 🛒 Using the Zustand Cart Store

### In Components
```javascript
import { useCartStore } from '@/store';

function MyComponent() {
  const { items, cartTotal, addToCart, removeFromCart, updateQuantity } = useCartStore();
  
  return (
    <button onClick={() => addToCart(productId, 1)}>
      Add to Cart ({items.length})
    </button>
  );
}
```

### Important: Initialize Cart on Login
```javascript
// This is already done in useCart.js hook
// But if you need to manually init:
import { useCartStore } from '@/store';

const { initializeCart } = useCartStore();
useEffect(() => {
  initializeCart(userId);
}, [userId]);
```

---

## 🔔 Using Toast Notifications

### Import the utility
```javascript
import { showToast } from '@/utils/toast';
```

### Usage Examples
```javascript
// Success
showToast.success('Item added to cart!');

// Error
showToast.error('Failed to add item');

// Loading
const toastId = showToast.loading('Processing...');

// Dismiss loading toast
showToast.dismiss(toastId);

// Custom message
showToast.custom('Custom message');

// Promise-based (auto-dismiss on complete)
showToast.promise(
  apiCall(),
  {
    loading: 'Saving...',
    success: 'Saved!',
    error: 'Failed to save'
  }
);
```

---

## 💾 Using Saved Addresses

### In Checkout or Address Components
```javascript
import { useSavedAddresses } from '@/features/orders/hooks/useSavedAddresses';

function CheckoutComponent() {
  const { addresses, saveAddress, updateAddress, deleteAddress } = useSavedAddresses();
  
  const handleSaveAddress = (addressData) => {
    const saved = saveAddress(addressData);
    console.log('Saved with ID:', saved.id);
  };
  
  const handleDeleteAddress = (addressId) => {
    deleteAddress(addressId);
  };
}
```

### Address Data Structure
```javascript
{
  id: 1623456789,
  name: "John Doe",
  email: "john@example.com",
  phone: "+91-9999999999",
  line1: "123 Main Street",
  line2: "Apt 4B",
  city: "Mumbai",
  state: "Maharashtra",
  zipCode: "400001",
  country: "India",
  createdAt: "2026-06-15T10:30:00Z"
}
```

---

## 📊 Using Rating Badge Component

```javascript
import { RatingBadge } from '@/components/common';

// With review count
<RatingBadge rating={4.5} count={128} showCount={true} />

// Rating only
<RatingBadge rating={4.2} showCount={false} />

// No rating yet
<RatingBadge rating={0} count={0} />
```

---

## 🎭 Using Loading Skeletons

```javascript
import { 
  CartItemSkeleton, 
  ProductCardSkeleton, 
  OrderSummarySkeleton 
} from '@/components/common';

function CartPage() {
  const { items, loading } = useCart();
  
  if (loading) {
    return (
      <div className="space-y-4">
        <CartItemSkeleton />
        <CartItemSkeleton />
        <CartItemSkeleton />
      </div>
    );
  }
  
  return items.map(item => <CartItem key={item.id} item={item} />);
}
```

---

## 🚫 Using Empty States

```javascript
import { EmptyStateCart, EmptyStateOrders } from '@/components/common';

// Empty cart
<EmptyStateCart onContinueShopping={() => navigate('/products')} />

// No orders
<EmptyStateOrders onStartShopping={() => navigate('/products')} />

// No search results
<EmptyStateSearch query="xyz" onClear={() => setQuery('')} />

// No addresses
<EmptyStateAddresses onAdd={() => setShowForm(true)} />
```

---

## ⚠️ Using Alert Components

```javascript
import { ErrorAlert, SuccessAlert, WarningAlert } from '@/components/common';

// Error with retry
<ErrorAlert 
  message="Failed to add item" 
  onRetry={() => retryAddToCart()}
  onDismiss={() => setError(null)}
/>

// Success
<SuccessAlert 
  message="Order placed successfully!" 
  onDismiss={() => setSuccess(false)}
/>

// Warning
<WarningAlert 
  message="Low stock - only 2 items left" 
  onDismiss={() => setWarning(false)}
/>

// Info
<InfoAlert 
  message="Free shipping on orders above ₹499"
  onDismiss={() => setInfo(false)}
/>
```

---

## 🏪 Cart Store API Reference

```javascript
// State
items              // Array of cart items
cartTotal          // Total price
loading            // Is loading
error              // Error message
userId             // Current user ID

// Actions
initializeCart(userId)        // Load cart from API
addToCart(productId, qty)     // Add item to cart
removeFromCart(productId)     // Remove item
updateQuantity(productId, qty) // Update quantity
clearCart()                   // Empty entire cart
getItemCount()                // Get total items count
clearError()                  // Clear error state
```

---

## 📱 Responsive Breakpoints Used

All components use TailwindCSS breakpoints:
- **Mobile:** Default styles (< 640px)
- **Tablet:** `md:` prefixed classes
- **Desktop:** `lg:` and `xl:` prefixed classes

Example:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
</div>
```

---

## 🔐 Preparing for JWT Authentication

### Current State
- Cart persists in localStorage (Zustand middleware)
- Addresses persist in localStorage (custom hook)
- User state in AuthContext

### When Backend is Ready
1. Update `authStore.js` to store JWT token:
```javascript
setToken: (token) => set({ token }),
```

2. Add axios interceptor in API setup:
```javascript
api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

3. Replace localStorage calls in `useSavedAddresses.js` with API calls:
```javascript
// Before: localStorage.getItem(...)
// After: await api.get('/api/addresses')
```

**No other changes needed!** The architecture is ready.

---

## 📝 Common Workflows

### Add Item to Cart
```javascript
import { showToast } from '@/utils/toast';
import { useCartStore } from '@/store';

async function handleAddToCart(productId, quantity) {
  try {
    await useCartStore.getState().addToCart(productId, quantity);
    showToast.success('Added to cart!');
  } catch (error) {
    showToast.error(error.message);
  }
}
```

### Save Address During Checkout
```javascript
import { useSavedAddresses } from '@/features/orders/hooks';
import { showToast } from '@/utils/toast';

const { saveAddress } = useSavedAddresses();

const handleSaveAddress = (address) => {
  try {
    saveAddress(address);
    showToast.success('Address saved!');
  } catch (error) {
    showToast.error('Failed to save address');
  }
};
```

### Load Saved Addresses on Checkout Page
```javascript
import { useSavedAddresses } from '@/features/orders/hooks';
import { SavedAddressesList } from '@/features/orders/components';

function CheckoutPage() {
  const { addresses, loading, deleteAddress } = useSavedAddresses();
  
  return (
    <SavedAddressesList
      addresses={addresses}
      onDelete={deleteAddress}
      loading={loading}
    />
  );
}
```

---

## 🎯 File Structure

```
src/
├── store/                          (NEW - Zustand stores)
│   ├── authStore.js
│   ├── cartStore.js
│   ├── orderStore.js
│   ├── uiStore.js
│   └── index.js
├── components/common/              (ENHANCED)
│   ├── ToastProvider.jsx           (NEW)
│   ├── RatingBadge.jsx            (NEW)
│   ├── Skeletons.jsx              (NEW)
│   ├── EmptyStates.jsx            (NEW)
│   ├── Alerts.jsx                 (NEW)
│   └── index.js                   (UPDATED)
├── features/
│   ├── cart/
│   │   ├── components/
│   │   │   ├── CartItem.jsx       (REDESIGNED)
│   │   │   └── OrderSummary.jsx   (NEW)
│   │   ├── hooks/
│   │   │   └── useCart.js         (UPDATED for Zustand)
│   │   └── pages/
│   │       └── CartPage.jsx       (REDESIGNED)
│   ├── orders/
│   │   ├── components/
│   │   │   ├── CheckoutAddress.jsx (ENHANCED)
│   │   │   └── SavedAddressesList.jsx (NEW)
│   │   ├── hooks/
│   │   │   └── useSavedAddresses.js (NEW)
│   │   └── pages/
│   │       └── CheckoutPage.jsx   (REDESIGNED)
│   └── products/
│       └── components/
│           └── ProductCard.jsx    (ENHANCED with ratings)
└── utils/
    └── toast.js                   (NEW)
```

---

## ✅ Checklist Before Going Live

- [ ] Test cart add/remove in development (`npm run dev`)
- [ ] Test checkout flow with address saving
- [ ] Test toast notifications
- [ ] Test on mobile (responsive design)
- [ ] Test on different browsers
- [ ] Verify localStorage persists (browser DevTools)
- [ ] Test with no logged-in user
- [ ] Test error states
- [ ] Review IMPROVEMENTS.md for full documentation
- [ ] Update team on new component APIs

---

## 🚀 Start Development Server

```bash
npm run dev
```

App will be available at: `http://localhost:5173`

---

## 📞 Support

- Check component prop types in each file
- Review IMPROVEMENTS.md for detailed documentation
- All new components have JSDoc comments
- Each hook has clear API documentation

---

**Ready to deploy! 🎉**
