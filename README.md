# Agarwal Dental Clinic

A modern, frontend-only Dental Center Management Dashboard built with React, TypeScript, and localStorage. This project was developed as an interview assignment for ENTNT.

---

## 🚀 Deployed App
[Live Demo](https://dental-clinic-n638.vercel.app/)

## 📦 GitHub Repository
[GitHub Repo](https://github.com/agarwalpriyanshu/Dental-Clinic.git)

---

## 🛠️ Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/agarwalpriyanshu/Dental-Clinic.git
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
---

## 🏗️ Architecture Overview

- **Frontend Only:** No backend; all data is simulated and persisted in `localStorage`.
- **Tech Stack:** React, TypeScript, Vite, TailwindCSS, shadcn/ui, React Router, React Query.
- **State Management:** Custom `DataProvider` context for users, patients, and appointments.
- **Authentication:** Simulated login for Admin (Dentist) and Patient roles.
- **Role-Based Access:** Separate dashboards and navigation for Admin and Patient.
- **CRUD Operations:** Full create, read, update, and delete for patients and appointments (incidents).
- **File Uploads:** Files are stored as base64 in localStorage.
- **UI/UX:** Modern, responsive, and accessible design with custom theming and dark mode.
- **Sample Data:**
  - Admin: `admin@entnt.in` / `admin123`
  - Patient: `john@entnt.in` / `patient123`
  - Only one patient (John Doe) and one incident (Toothache) are present by default.

---

## ⚙️ Technical Decisions

- **No Backend:** All data is managed in the browser for simplicity and to meet assignment requirements.
- **Context API:** Used for global state to keep the app simple and easy to reason about.
- **Component Structure:** Pages and UI components are modular and reusable.
- **LocalStorage Seeding:** On first load or after clearing storage, the app seeds with the required sample data.
- **No Demo/Mock Data:** All references to demo patients, incidents, or notes have been removed.
- **Branding:** Clinic and doctor names are hardcoded as per requirements.
- **Accessibility:** Used semantic HTML and accessible components where possible.

---

## 🐞 Issues Encountered During Development

- **State Synchronization with LocalStorage:**  
  Keeping the UI in sync with localStorage for all CRUD operations was a bit tricky. There were moments when changes (like deleting a patient or editing an appointment) didn't immediately reflect in the UI. I resolved this by carefully managing React state and using effects to ensure updates were always propagated.

- **Role-Based Routing and Access Control:**  
  Making sure that Admin and Patient users only saw the pages and data relevant to their role required extra logic in the routing and layout components. I added route guards and redirects to prevent unauthorized access, and tested various edge cases to ensure a smooth experience.

- **Calendar and Date Handling:**  
  Handling appointment dates and calendar widgets was more challenging than expected, especially with different date formats and timezones. I used utility functions and libraries to ensure dates were always displayed and compared correctly, and tested thoroughly to avoid off-by-one errors.

- **Dark Mode and Theming:**  
  Integrating dark mode and making sure all components looked good in both light and dark themes took extra effort. I had to tweak some color choices and test the UI in both modes to ensure a consistent and pleasant user experience.

---

## 🐞 Known Issues / Limitations

- **No Real Backend:** All data is lost if localStorage is cleared (except for initial seed).
- **File Uploads:** Files are not actually uploaded; they are stored as base64 strings in localStorage.
- **No Real Email/Password Validation:** Authentication is simulated.
- **No Real-Time Collaboration:** Data is not shared between users or devices.

---

## 📧 Submission

- **Deployed App Link:** https://dental-clinic-n638.vercel.app/
- **GitHub Repository Link:** https://github.com/agarwalpriyanshu/Dental-Clinic.git
- **Submit to:** hr@entnt.in

---

Thank you for reviewing my submission!
