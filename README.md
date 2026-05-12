# GreenPlate - Food Waste Reduction App

GreenPlate is a mobile-first web application designed to help households reduce food waste. It features receipt scanning (OCR via Tesseract.js), a smart inventory system, expiry date estimation, and an impact dashboard.

## Features (MVP)
*   **Smart Dashboard**: Visualize your money saved and waste reduced. See items expiring soon at a glance.
*   **Pantry Inventory**: Track all your food items. Items are categorized and color-coded based on shelf life.
*   **Receipt Scanning**: Uses on-device OCR (Tesseract.js) to scan grocery receipts and automatically extract food items.
*   **Smart Recipes**: Recommends recipes based on the ingredients you already have, prioritizing those that are about to expire.

## Technology Stack
*   **Frontend**: React (Vite)
*   **Styling**: Pure CSS with CSS Variables (Vanilla CSS) for a premium, glassmorphism design. Mobile-first layout.
*   **Routing**: React Router
*   **Icons**: Lucide React
*   **OCR**: Tesseract.js
*   **Dates**: date-fns

## Running Locally

1.  Ensure you have Node.js installed.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:5173` in your browser.

## Deployment Instructions (Vercel / Netlify / Firebase)

This is a standard Vite React application. You can deploy it easily to any static hosting provider.

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the root directory.
3. Follow the prompts to deploy.

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase login` and `firebase init hosting`.
3. Choose to use an existing project or create a new one.
4. Set the public directory to `dist`.
5. Configure as a single-page app (rewrite all urls to `/index.html`): `Yes`.
6. Set up automatic builds: `No` (or Yes if you want GitHub Actions).
7. Build the app: `npm run build`
8. Deploy: `firebase deploy --only hosting`

## Future Improvements for Production
- Implement a more robust backend (e.g., Firebase Firestore) for persistent data storage.
- Enhance OCR logic using Google ML Kit on native mobile or a cloud-based receipt parsing API for better accuracy.
- Add real push notifications for expiry alerts using Firebase Cloud Messaging.
