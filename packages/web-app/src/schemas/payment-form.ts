export type ColorScheme =
    | 'slate'
    | 'azure'
    | 'emerald'
    | 'ruby'
    | 'amethyst'
    | 'amber'
    | 'custom';
export type FontFamily = 'inter' | 'playfair' | 'nunito' | 'work';

export interface CustomColors {
    background?: string;
    card?: string;
    text?: string;
    textMuted?: string;
    accent?: string;
    buttonBg?: string;
    buttonText?: string;
    buttonHoverBg?: string;
    inputBg?: string;
    inputBorder?: string;
    inputFocusRing?: string;
    borderColor?: string;
}

export interface FormAppearance {
    colorScheme?: ColorScheme;
    fontFamily?: FontFamily | string;
    customColors?: CustomColors;
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

interface PaymentForm {
    paymentFormId?: string;
    paymentFormTitle: string;
    paymentFormDescription: string; // Required
    paymentFormSuccessURL: string; // Must be a valid link - A URL link used to redirect the customer after a successful payment.
    paymentFormCancelURL: string; // Must be a valid link - A URL link used to go back to the merchant's page. No actual canceling of records is done.
    paymentFormWebhookURL: string;
    paymentFormPaymongoPubKey: string;
    paymentFormPaymongoSecKey: string;
    // paymentFormPaymentMethods: PaymentMethod;
    paymentFormProducts: Product[]; // Required at least one product
    userId: string;
    appearance?: FormAppearance; // New field
}

interface Product {
    productId?: string;
    productName: string; // Required
    productDescription: string;
    productPrice: number; // Minimum amount of PHP 20.00
    // productImage: string;
    // productQuantity: number;
}

/*
enum PaymentMethod {
  qrph = 'qrph',
  gcash = 'gcash',
  card = 'card',
  dob = 'dob',
  dob_ubp = 'dob_ubp',
  brankas_bdo = 'brankas_bdo',
  brankas_landbank = 'brankas_landbank',
  brankas_metrobank = 'brankas_metrobank',
  grab_pay = 'grab_pay',
  paymaya = 'paymaya'
}
*/

// export { PaymentMethod }

export type { PaymentForm, Product };
