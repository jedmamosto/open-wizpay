# Firestore Database Schema & Auth Models

This document outlines the database collections and authentication models used in the WizPay codebase.

## 1. Firebase Authentication
All merchants register and authenticate via Firebase Auth.
- **Fields stored in Auth**:
  - `uid` (Unique user ID)
  - `email` (Valid email address)
  - `displayName` (Full name)
  - `password` (Stored securely by Firebase)

---

## 2. Firestore Collections

### Collection: `payment-forms`
Stores the customized payment portals and catalog links configured by merchants.
- **Schema Reference**: [payment-form.ts](file:///c:/Users/ASUS/Documents/VSCode/oz_tech/packages/web-app/src/schemas/payment-form.ts)
- **Document Structure**:
```typescript
interface PaymentForm {
    paymentFormId?: string;           // Firestore auto-generated ID or manual override
    paymentFormTitle: string;         // Title of the payment form/storefront
    paymentFormDescription: string;   // Merchant/store description
    paymentFormSuccessURL: string;    // Successful redirect URL (must be valid link)
    paymentFormCancelURL: string;     // Cancel/Return URL (must be valid link)
    paymentFormWebhookURL: string;    // Payment webhook notification endpoint
    paymentFormPaymongoPubKey: string;// Paymongo Public API Key
    paymentFormPaymongoSecKey: string;// Paymongo Secret API Key (MUST NOT leak to client)
    paymentFormProducts: Product[];    // Minimum 1 product in array
    userId: string;                   // Owner merchant's user ID
    appearance?: FormAppearance;      // Configuration for layout/colors/styling
}

interface Product {
    productId?: string;
    productName: string;
    productDescription: string;
    productPrice: number;             // Minimum amount: 20.00 PHP
}

interface FormAppearance {
    colorScheme?: 'slate' | 'azure' | 'emerald' | 'ruby' | 'amethyst' | 'amber' | 'custom';
    fontFamily?: string;
    customColors?: CustomColors;      // Maps CSS variables if colorScheme is 'custom'
    borderRadius?: string;
    cardBorderWidth?: string;
    buttonShape?: 'sharp' | 'rounded' | 'pill';
    shadowSize?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    customCSS?: string;
    layout?: 'single-column' | 'split';
    showMerchantBadge?: boolean;
    showProductDescription?: boolean;
    checkoutButtonText?: string;
}
```

### Collection: `checkout-sessions`
Stores records of pending, failed, or successful checkout attempts created by customers.
- **Document Structure**:
```typescript
interface CheckoutSession {
    checkoutSessionId: string;        // ID returned by Paymongo API
    paymentFormId: string;            // Parent payment form reference
    customerName: string;             // Customer full name
    customerEmail: string;            // Customer email address
    customerPhone: string;            // Customer contact number (PH format)
    selectedProducts: Array<{
        productId?: string;
        productName: string;
        productPrice: number;
        quantity: number;
    }>;
    createdAt: string;                // ISO Date format
    status: 'pending' | 'succeeded' | 'failed';
    paymentToken: string;             // Client verification token
}
```

### Collection: `api-keys`
Stores cryptographically hashed API keys for developers to access the backend programmatically.
- **Document Structure**:
```typescript
interface APIKey {
    userId: string;                   // Owner merchant's user ID
    hashedKey: string;                // SHA-256 hash of plain key
    maskedKey: string;                // Masked representation for UI list (e.g. wzp_live_••••XXXX)
    keyName: string;                  // User-defined name for key Identification
    createdAt: admin.firestore.Timestamp; // Creation timestamp
}
```
