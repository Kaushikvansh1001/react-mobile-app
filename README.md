# Fastor

Mobile-first restaurant discovery and food-ordering interface for the React.js recruitment assignment. The UI follows the supplied phone designs. Registration, OTP login, and the restaurant list call the Fastor staging API. Dish carousels, the promotional banner, and order actions on the home screen are local design content.

## Features and workflow

1. Open `/signup` and enter a 10-digit Indian mobile number (`6`–`9` as the first digit). The country code is `+91`.
2. **Get OTP** calls the register endpoint. While the request is in flight the button reads “Sending OTP...”.
3. On success the app opens `/verify-otp` and keeps the phone number and dial code in navigation state.
4. Enter the 6-digit code with the keypad, the keyboard, or paste. **Continue** stays disabled until all six digits are present.
5. **Continue** calls the login endpoint. The JWT is read from `data.token` and stored in `sessionStorage`.
6. The app opens `/home`. Restaurants load for `city_id=118` with that token.
7. The 30% OFF banner opens `/product/:id`. Quantity, portion, and **Add to cart** stay in the browser.
8. **Log out** clears the session and returns to `/signup`.

A signed-in visit to `/` or `/signup` goes to `/home`. A signed-out visit to `/home` or `/product/:id` goes to `/signup`. `/verify` redirects to `/verify-otp`. Any other path shows a not-found screen.

After the 30-second timer, **Resend OTP** calls the register endpoint again.

## Technology stack

- React.js
- Vite
- JavaScript
- React Router DOM
- Axios
- Lucide React
- CSS3

## Project structure

```text
react-mobile-app/
  public/                 Design images (food, banner, call, wallet, status bar)
  src/
    components/
      NumberKeypad.jsx    Custom numeric keypad
      OtpInput.jsx         Six-digit code boxes
      RestaurantCard.jsx   One restaurant from the API
      StatusBar.jsx        Phone status-bar image
    context/
      AuthContext.jsx      Login, logout, session flag
      CartContext.jsx      In-memory cart
    layouts/
      AppLayout.jsx        Page shell
    pages/
      SignupPage.jsx
      OtpPage.jsx
      HomePage.jsx
      ProductPage.jsx
      NotFoundPage.jsx
    routes/
      AppRoutes.jsx
      ProtectedRoute.jsx   ProtectedRoute and GuestRoute
    services/
      api.js               Axios client, token helpers, error handling
      authService.js       Register and login
      restaurantService.js Restaurant list
    styles/
      global.css
      signup.css
      home.css
      product.css
    App.jsx
    main.jsx
  .env.example
  package.json
  vite.config.js
```

## Installation

Requirements: Node.js 20 and npm.

```powershell
cd react-mobile-app
npm install
Copy-Item .env.example .env
```

`Copy-Item` is for Windows PowerShell. On another shell, copy `.env.example` to `.env`.

Do not commit `.env`.

## Environment

| Name | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | API origin only. No path. |

Example from `.env.example`:

```text
VITE_API_BASE_URL=https://staging.fastor.ai
```

Restart `npm run dev` after changing this value. Vite reads it when the dev server starts.

## Scripts

From `package.json`:

```powershell
npm run dev       # start Vite
npm run build     # production build into dist/
npm run preview   # serve the production build
npm run lint      # oxlint
```

`npm run dev` prints a local URL. If port 5173 is taken, Vite chooses the next free port.

## APIs

The client is `src/services/api.js`. Its base URL is `VITE_API_BASE_URL`.

Register and login send `application/x-www-form-urlencoded` and do not send an `Authorization` header. Other requests send `Authorization: Bearer <token>` when a token is stored.

A response is treated as success only when `status` is `"Success"`. Fastor can return HTTP 200 with `status: "Failed"` and `error_message`. That message is shown in the UI. A network failure shows “Could not reach Fastor. Check your connection and try again.”

### Register and get OTP

`POST /v1/pwa/user/register`

| Field | Description |
| --- | --- |
| `phone` | 10-digit mobile number |
| `dial_code` | `+91` |

A successful body looks like:

```json
{
  "status": "Success",
  "status_code": 200,
  "data": "otp sent"
}
```

The button shows “Sending OTP...” until the request finishes. An invalid number never leaves the signup screen.

### Login with OTP

`POST /v1/pwa/user/login`

| Field | Description |
| --- | --- |
| `phone` | Same number used to register |
| `otp` | 6-digit code |
| `dial_code` | `+91` |

The JWT is `data.token`. The app also keeps `data.user_id` and `data.user_name` when they are present. It does not store the rest of the login payload.

**Continue** shows “Checking...” and is disabled until six digits are entered. An incorrect or expired code stays on this screen and shows `error_message`.

### Fetch restaurants

`GET /v1/m/restaurant?city_id=118`

Header, when a session exists:

```text
Authorization: Bearer <token>
```

Records are read from `data.results`. Each card uses:

- `restaurant_id` as the React key
- `logo`
- `restaurant_name`
- `address_complete`

A missing logo, or a logo that fails to load, shows the restaurant’s initial. An address that is empty or the string `"null"` is shown as “Address unavailable”.

The home screen shows “Loading restaurants...” while the request runs. If it fails, the error and a **Try again** button are shown. An empty `results` array shows “No restaurants found for this city.”

Restaurant records are not copied into Best Seller, Popular Items, or the product page. Those sections are not restaurant data.

## Authentication and session storage

The token is stored in `sessionStorage` under `fastor.token`. A small profile, `{ id, name }`, is stored under `fastor.user`. `sessionStorage` lasts for the browser tab. Closing the tab clears the session. The token is not written to the console and is not placed in `localStorage`.

**Log out** removes both keys and opens `/signup`. The in-memory cart is dropped when the session ends.

An HTTP 401 also removes both keys. If the current page is not signup, the browser is sent to `/signup`.

## Routes

| Path | Access | Screen |
| --- | --- | --- |
| `/` | Guest | Redirects to `/signup` |
| `/signup` | Guest | Signup |
| `/verify-otp` | Guest | OTP verification |
| `/verify` | Any | Redirects to `/verify-otp` |
| `/home` | Signed in | Home |
| `/product/:id` | Signed in | Product details |
| Any other path | Any | Not found |

Guest routes send a signed-in user to `/home`. Protected routes send a signed-out user to `/signup`.

## Screens

### Signup

White phone layout with the status bar, orange back control, “Sign Up to Fastor”, the +91 field, **Get OTP**, the terms line, and the custom keypad. The number can be typed or entered with the keypad. Terms & Conditions and Privacy Policy are visual only. They do not open a page.

### OTP verification

Heading “6-digit code”, the formatted `+91` number, six boxes with a hyphen after the third digit, a 30-second resend countdown, **Continue**, and the same keypad. Focus moves as digits are entered. Backspace and paste are supported.

### Home

“Current Locations” stays “Model Town, New Delhi”. That line is design copy, not an API field. The greeting uses the name from login when one was returned, otherwise “Karan”. **Log out** sits on that row.

Best Seller, the 30% OFF banner, and Popular Items reproduce the design with files in `public/`. A short note on the page marks them as sample content. The **Restaurants** section under them is the live API list.

### Product details

Opened from the banner at `/product/pizza`. It shows the pizza image, a quantity control that starts at 3 and cannot go below 1, the portion list, and **Add to cart**. The displayed price is ₹14.00 plus the selected portion: Personal +0, Medium +3, Familiar +6, Jumbo +10. Jumbo is selected by default, so the first price is ₹24.00. After a tap, the button reads “Added to cart” and a note says the item was saved on this device only.

## Postman

Collection base URL: `https://staging.fastor.ai`.

1. **Register and get OTP.** `POST /v1/pwa/user/register`. Body type `x-www-form-urlencoded` with `phone` and `dial_code`. No auth header.
2. **Login with OTP.** `POST /v1/pwa/user/login`. Same body type, with `phone`, `otp`, and `dial_code`. No auth header. Copy `data.token` from a successful response.
3. **Fetch restaurant.** `GET /v1/m/restaurant?city_id=118`. Authorization type Bearer Token, using the token from step 2.

Use values from your own Postman collection. This README does not include a phone number, OTP, or token.

## Frontend demonstrations only

These controls are on screen because they are in the design. They do not call an API:

- Best Seller dishes and prices
- The 30% OFF promotional banner
- Popular Items, including dates, prices, and item counts
- **Cancel Order** and **Track Driver**
- Call and wallet buttons
- Terms & Conditions and Privacy Policy
- **Add to cart**, which only updates React state for the current session

No order-placement endpoint is implemented. Adding to the cart does not create an order.
