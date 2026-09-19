# Health Deck — Project Memory

## Project Identity
- Current website name: **Health Deck**
- Project type: modern healthcare website
- Visual reference: supplied clean healthcare website and liquid-glass/3D button references
- Main priority: clean, responsive, working UI

## Current Architecture
### Main page
`index.html`

### Main styling
`healthdeck-style.css`

### Main interactions
`healthdeck-script.js`

### Patient dashboard
`patient-dashboard.html`

### Dashboard styling
`patient-dashboard.css`

### Dashboard interactions
`patient-dashboard.js`

## Product Decisions
- Patient Dashboard is a separate page.
- Dashboard should be reachable from the main website navigation.
- Main homepage includes all required healthcare sections.
- Main CTA is **Book an Appointment**.
- Laboratory projects may use **Book Your Test**.
- Buttons should retain the site's color theme while adopting a raised 3D appearance.
- Text should be larger and easier to read.
- Medical images and icons can be used to enrich the homepage.
- The UI should remain clean rather than becoming image-heavy.

## Required Homepage Sections
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

## Dashboard Direction
The Patient Dashboard is intended to provide a patient-oriented experience with:
- Health score
- Daily check-in
- Mood tracking
- Health indicators
- Emergency health information
- Care Circle
- Tasks
- Health trends
- Support / care interactions

## Future Change Guidelines
When modifying the project:
1. Preserve the Health Deck brand.
2. Preserve responsive behavior.
3. Preserve the existing healthcare color direction unless explicitly asked to change it.
4. Preserve the 3D button language.
5. Avoid removing required homepage sections.
6. Avoid breaking the separate dashboard page.
7. Prefer reusable CSS classes and small, maintainable JavaScript functions.
8. Test desktop and mobile behavior after significant UI changes.

## Known Scope Boundary
This project is a front-end website unless a future requirement explicitly adds a backend, authentication, database, real appointment scheduling, payment processing, or production patient-data integration. Do not represent demo dashboard data as real medical records.
