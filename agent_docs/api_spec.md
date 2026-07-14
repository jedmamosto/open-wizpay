# WizPay Next.js API Reference Specification

All WizPay core backend functionalities are exposed via Next.js App Router API endpoints.

---

## 1. Authentication Endpoints

### `POST /api/auth/login`
Authenticates a merchant user.
- **Request Body**:
  ```json
  {
    "email": "merchant@domain.com",
    "password": "securepassword"
  }
  ```
- **Response**: Cookie-based session set, returns status 200 on success.

### `POST /api/auth/logout`
Clears authentication cookies and invalidates the session.
- **Response**: Returns status 200.

### `GET /api/auth/me`
Retrieves details of the currently logged-in merchant.
- **Response**:
  ```json
  {
    "uid": "user_id_123",
    "email": "merchant@domain.com"
  }
  ```

---

## 2. Payment Form Management Endpoints

### `/api/payment-forms`
CRUD operations for payment checkouts configured by merchants. Authenticated via Firebase session.

- **GET**: Lists all forms owned by the authenticated merchant.
- **POST**: Creates a new payment form.
  - **Request Body**: [PaymentForm](file:///c:/Users/ASUS/Documents/VSCode/oz_tech/packages/web-app/src/schemas/payment-form.ts) structure.
- **PUT**: Updates an existing payment form.
  - **Request Body**: Partial [PaymentForm](file:///c:/Users/ASUS/Documents/VSCode/oz_tech/packages/web-app/src/schemas/payment-form.ts).
- **DELETE**: Deletes a form configuration.
  - **Query Parameter**: `id` (Payment Form ID).

### `GET /api/payment-forms/query`
Retrieves a specific payment form config. Used during custom rendering.
- **Query Parameter**: `id`

---

## 3. Developer Keys Endpoints

### `/api/developer/keys`
Manage merchant programmatic API keys. Authenticated via Firebase session.
- **GET**: Lists all active API keys (masked) for the merchant.
- **POST**: Generates a new cryptographically secure API key.
  - **Response**:
    ```json
    {
      "apiKey": "wzp_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
    ```
    > [!IMPORTANT]
    > The plain text API key is only shown once at creation. The SHA-256 hash is saved to Firestore.
- **DELETE**: Revokes an API key.

---

## 4. Checkout & Paymongo Endpoints

### `POST /api/paymongo`
Creates a Paymongo checkout session and generates the redirection link.
- **Headers**: `Authorization: Bearer <API_KEY>` or Firebase session.
- **Request Body**:
  ```json
  {
    "paymentFormId": "form_id_abc",
    "checkoutName": "Juan dela Cruz",
    "checkoutEmail": "juan@gmail.com",
    "checkoutPhone": "09123456789",
    "selectedProducts": [
      {
        "productId": "prod_1",
        "quantity": 2
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "checkoutURL": "https://checkout.paymongo.com/session_..."
  }
  ```

### `POST /api/payment-verify`
Handles checkout verification and updates payment status.
- **Request Body**: Webhook payload from Paymongo or status query.

---

## 5. Public Widget SDK Endpoint

### `GET /api/v1/forms/[paymentFormId]`
Public endpoint to retrieve a sanitized form config for inline embedding (used by the storefront SDK).
- **Response**:
  - Sanitized form structure.
  - Paymongo Public Key.
  - **Excludes**: Paymongo Secret Key (`paymentFormPaymongoSecKey`).
