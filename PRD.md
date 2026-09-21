# Health Deck — Product Requirements Document

## 1. Product Overview
**Health Deck** is a modern, responsive healthcare website designed to help patients discover healthcare services, learn about departments and doctors, explore health packages, and book appointments. It also provides a dedicated Patient Dashboard on a separate page for personal health-oriented interactions.

## 2. Product Goals
- Present a trustworthy, clean healthcare experience.
- Make appointment booking easy and prominent.
- Provide clear access to departments, services, doctors, packages, facilities, and contact information.
- Provide a separate Patient Dashboard for health tracking and patient-oriented utilities.
- Maintain responsive behavior across desktop, tablet, and mobile.
- Use a clean healthcare visual language with 3D/liquid-glass-inspired buttons and cards.

## 3. Target Users
- Patients looking for healthcare services.
- Existing patients managing basic health information.
- Families looking for departments and doctors.
- Visitors comparing health packages and facilities.

## 4. Core Pages
### Main Website
1. Hero
2. About
3. Departments / Services
4. Doctors
5. Health Packages
6. Why Choose Us
7. Testimonials
8. Facilities
9. Appointment CTA
10. Contact & Location
11. Footer

### Patient Dashboard
A separate `patient-dashboard.html` page containing:
- Health score
- Daily check-in
- Mood selection
- Health sliders / indicators
- Emergency health card
- Care Circle
- Tasks
- Health trend
- Video rounds / support actions where implemented

## 5. Primary CTA
Use **“Book an Appointment”** for the healthcare website.

For a laboratory-focused variant, use **“Book Your Test”**.

## 6. Functional Requirements
### Navigation
- Navigation links must scroll to the correct homepage sections.
- Patient Dashboard must open as a separate page.
- Mobile navigation must remain usable on small screens.

### Appointment
- Appointment CTA must open or focus the booking interaction.
- Booking fields should support department, doctor, date, and other relevant information.
- Basic front-end validation must prevent obviously incomplete submissions.

### Interactive UI
- Buttons have visible hover, focus, and pressed states.
- Cards can have subtle hover elevation.
- Forms provide clear feedback.
- Dashboard controls respond immediately to user interaction.

## 7. Non-Functional Requirements
- Responsive at common mobile, tablet, and desktop widths.
- Semantic HTML where practical.
- CSS and JavaScript separated from HTML.
- No unnecessary image-heavy UI.
- Fast-loading and lightweight front-end implementation.
- Accessible keyboard focus states and readable contrast.
- Avoid layout shifts and broken links.

## 8. Content Requirements
The website name must be **Health Deck**.
Avoid replacing the brand name with older names such as VitaLink or CarePlus.

## 9. Success Criteria
- Users can reach an appointment CTA quickly.
- Users can understand the main healthcare offerings without excessive scrolling.
- Patient Dashboard opens successfully in a separate page.
- All major sections are present.
- UI remains clean and functional on mobile.
