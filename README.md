# Lodgr

[Live Demo @ lodgr-stays.onrender.com](https://lodgr-stays.onrender.com/)

Lodgr connects travelers with unique stays across the globe. From urban pads to cozy retreats, find, book, and enjoy effortlessly. Your next adventure starts here!

---

## Table of Contents

-   [Features](#features)
-   [Tech Stack](#tech-stack)
-   [Architecture](#architecture)
-   [APIs & Validation](#apis--validation)
-   [Security & Error Handling](#security--error-handling)
-   [Setup & Installation](#setup--installation)
-   [Future Roadmap](#future-roadmap)
-   [License](#license)

---

## Features

-   **Responsive & Clean UI**: Modern, mobile-friendly interface using HTML, CSS, EJS, and Bootstrap.
-   **Authentication & Authorization**: Secure user signup/login with Passport.js (local strategy). Only listing owners can edit/delete their listings.
-   **Listings Management**: Users can create, edit, view, and delete property listings with images and details.
-   **Image Uploads**: User-uploaded listing images are stored securely on Cloudinary.
-   **Search & Filter**: Browse and search listings by category, location, and more.
-   **Reviews**: Authenticated users can post and delete reviews on listings.
-   **Flash Messages**: User feedback for actions (success, error) using connect-flash.
-   **MVC Architecture**: Clean separation of concerns for scalability and maintainability.
-   **API Route Protection**: Middleware ensures only authorized users can access/modify resources.
-   **Client & Server-side Validation**: Robust validation using Joi to prevent invalid data.
-   **Edge Case Handling**: Graceful handling of missing resources, permissions, and validation errors.
-   **Session Management**: User sessions stored securely with connect-mongo and express-session.
-   **Clean Database Schema**: Well-structured MongoDB Atlas schemas for users, listings, and reviews.
-   **Async Error Handling**: Centralized error handling with custom ExpressError and wrapAsync utility.
-   **Reusable Middlewares**: For validation, authentication, authorization, and redirect logic.
-   **RESTful APIs**: Clean, modular Express routers for listings, users, and reviews.

---

## Tech Stack

-   **Languages**: JavaScript (Node.js, ES6+), HTML, CSS, EJS
-   **Frameworks & Libraries**:
    -   Backend: Express.js
    -   Frontend: EJS, Bootstrap, Vanilla JS
    -   Database: MongoDB Atlas (Mongoose ODM)
    -   Authentication: Passport.js (passport-local, passport-local-mongoose)
    -   Validation: Joi
    -   File Uploads: Multer, Cloudinary, multer-storage-cloudinary
    -   Session & Flash: express-session, connect-mongo, connect-flash
    -   Environment: dotenv
-   **Other Tools**: Method-override, ejs-mate, FontAwesome

---

## Architecture

-   **MVC Pattern**: Models (Mongoose schemas), Views (EJS templates), Controllers (business logic).
-   **Express Routers**: Modular route handling for listings, users, and reviews.
-   **Middleware**: For validation, authentication, authorization, and error handling.
-   **Cloudinary Integration**: For secure, scalable image storage.
-   **MongoDB Atlas**: For cloud-hosted, scalable NoSQL database.

---

## APIs & Validation

-   **RESTful Endpoints**: CRUD operations for listings and reviews.
-   **Validation**: All user input is validated both client-side and server-side using Joi schemas.
-   **Protected Routes**: Only authenticated users can create listings/reviews; only owners can edit/delete their own listings or reviews.

---

## Security & Error Handling

-   **Authentication**: Passport.js with session-based login.
-   **Authorization**: Middleware checks for resource ownership.
-   **Error Handling**: Centralized with custom ExpressError class and async error wrapper (wrapAsync).
-   **Input Validation**: Prevents invalid or malicious data from reaching the database.
-   **Session Security**: Session-based authentication using express-session, with secure cookie expiry and storage in MongoDB. Users remain logged in across sessions (no need to log in repeatedly). If a user tries to access a protected action while not logged in, they are redirected to the login page and, after successful login, are automatically redirected back to their intended action or page. Environment variables are used for sensitive config.

---

## Setup & Installation

1. **Clone the repository**
2. **Install dependencies**
    ```bash
    npm install
    ```
3. **Set up environment variables** (`.env` file)
    - `MONGO_URL` (MongoDB Atlas connection string)
    - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`
    - `SECRET` (session secret)
4. **Run the app**
    ```bash
    node app.js
    ```
5. **Visit** [http://localhost:3000](http://localhost:3000) or the [live site](https://lodgr-stays.onrender.com/)

---

## Future Roadmap

-   Add booking and payment integration.
-   Advanced search and filtering (by price, amenities, date).
-   User profile pages and booking history.
-   Messaging between guests and hosts.
-   Admin dashboard for site management.
-   Improved accessibility and performance.

---

## License

MIT License

---

**Author:** Raghav Agarwal
