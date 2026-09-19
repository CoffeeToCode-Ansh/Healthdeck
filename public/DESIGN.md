# Health Deck — Design System

## 1. Design Direction
Health Deck uses a **clean modern healthcare aesthetic** inspired by the supplied reference:
- Soft, bright backgrounds
- Healthcare blue/cyan accents
- Rounded surfaces
- Subtle glass-like layering
- Soft depth and shadows
- Large, readable typography
- Professional medical imagery
- Tactile 3D controls

The goal is to feel advanced without becoming futuristic or distracting.

## 2. Layout
- Use a centered content container.
- Maintain consistent horizontal padding.
- Use generous vertical section spacing.
- Prefer CSS Grid/Flexbox for layout.
- Avoid fixed-width layouts that break on mobile.

## 3. Typography
Hierarchy should be obvious:
- Hero headline: largest and strongest.
- Section heading: prominent but compact.
- Card title: medium/strong.
- Body copy: comfortable reading size.
- Supporting metadata: smaller but still legible.

Do not make body text excessively small.

## 4. Buttons
### Primary Button
Use a rounded pill or rounded rectangle with:
- Raised surface
- Soft outer shadow
- Inner highlight
- Slight vertical translation on hover
- Press-down effect on active state
- Visible keyboard focus ring

### Secondary Button
Use the same physical language but lower visual emphasis.

### CTA Copy
Preferred:
**Book an Appointment**

Laboratory variant:
**Book Your Test**

## 5. Cards
Cards should:
- Have consistent corner radius.
- Use subtle shadows.
- Have enough internal padding.
- Maintain clear separation from the page background.
- Lift slightly on hover when interactive.

## 6. Hero
The hero should immediately communicate:
- Healthcare purpose
- Trust
- Primary value proposition
- Appointment action

Medical imagery can be used as a supporting visual, but text and CTA must remain readable.

## 7. Icons
Use simple healthcare-relevant icons for:
- Departments
- Services
- Benefits
- Facilities
- Contact methods
- Dashboard utilities

Icons should support the text rather than replace it.

## 8. Imagery
Use clean, professional healthcare photos:
- Doctors and patients
- Medical facilities
- Diagnostic equipment
- Care environments

Avoid unrelated stock imagery and visually inconsistent image styles.

## 9. Accessibility
- Maintain readable contrast.
- Provide visible focus states.
- Use semantic controls.
- Add alt text to meaningful images.
- Do not communicate information through color alone.
- Ensure interactive targets are touch-friendly.

## 10. Responsive Behavior
### Mobile
- Single-column sections where necessary.
- Compact navigation.
- Full-width CTA buttons where useful.
- Cards stack vertically.

### Tablet
- Two-column layouts where comfortable.
- Maintain generous spacing.

### Desktop
- Multi-column cards and service grids.
- Larger hero composition.
- Wider content container.

## 11. Motion
Use restrained motion:
- Button elevation
- Card hover
- Smooth section navigation
- Small entrance transitions

Avoid excessive animations, flashing, or motion that distracts from healthcare content.
