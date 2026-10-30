# React mobile app

Foundation for the recruitment mobile app. Screens and API calls will be added from the supplied Figma design and Postman collection.

## Requirements

- Node.js 20
- npm 10

Confirmed on this machine: Node.js v20.16.0 and npm 10.8.1.

## Setup

```powershell
cd "C:\Users\91971\Desktop\New folder\Developer-Assignment\react-mobile-app"
npm install
Copy-Item .env.example .env
```

Set `VITE_API_BASE_URL` in `.env` to the API host. Do not commit `.env`. Do not put endpoint paths in that variable; those will come from the Postman collection.

## Run

```powershell
npm run dev
```

Vite prints a local address, usually `http://localhost:5173`. The foundation page confirms that routing and the global styles loaded.

Production build:

```powershell
npm run build
npm run preview
```

## Structure

- `src/services/api.js` is the shared Axios client. It reads `VITE_API_BASE_URL` and does not define endpoints yet.
- `src/routes/AppRoutes.jsx` is where Figma screens will be registered.
- `src/layouts/AppLayout.jsx` wraps those screens.
- `src/styles/global.css` holds the mobile-first type and spacing defaults.
