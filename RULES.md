# Health Deck — Project Rules

## 1. Branding Rules
- Brand name: **Health Deck**.
- Do not use previous project names in visible UI.
- Keep healthcare positioning professional, calm, and trustworthy.

## 2. Design Rules
- Preserve the established healthcare blue/cyan visual direction unless a future requirement explicitly changes it.
- Buttons should have a 3D/raised appearance inspired by the supplied liquid-glass reference.
- Use rounded corners, soft shadows, subtle highlights, and depth without making the UI visually noisy.
- Do not overuse glass effects.
- Maintain generous spacing and clear hierarchy.
- Headings and body text must remain comfortably readable.

## 3. Image Rules
- Use clean healthcare imagery only where it adds value.
- Images should look professional and relevant to the section.
- Do not allow imagery to overpower content or reduce readability.
- Use appropriate `alt` text for meaningful images.
- Decorative images should not create unnecessary accessibility noise.

## 4. Component Rules
- Buttons must have hover, focus, and active/pressed states.
- Cards must have consistent radius, spacing, and shadow language.
- Forms must have visible labels or accessible equivalents.
- Interactive controls must look interactive.
- Do not use fake buttons that do nothing unless they are clearly marked as visual placeholders.

## 5. Responsive Rules
- Mobile-first behavior is preferred.
- No horizontal overflow.
- Navigation must collapse or adapt on narrow screens.
- Cards should stack gracefully.
- Buttons should remain easy to tap on touch devices.

## 6. JavaScript Rules
- Keep JavaScript modular and readable.
- Avoid unnecessary global variables.
- Validate user input before processing forms.
- Do not silently fail; provide user-facing feedback where appropriate.
- Use progressive enhancement where practical.

## 7. File Rules
Expected core files:
- `index.html`
- `healthdeck-style.css`
- `healthdeck-script.js`
- `patient-dashboard.html`
- `patient-dashboard.css`
- `patient-dashboard.js`

Keep CSS and JavaScript separate from HTML unless a small inline snippet is genuinely necessary.

## 8. Content Rules
Required homepage sections:
Hero, About, Departments/Services, Doctors, Health Packages, Why Choose Us, Testimonials, Facilities, Appointment CTA, Contact & Location, Footer.

Primary CTA:
**Book an Appointment**

## 9. Quality Rules
Before delivery:
- Test navigation.
- Test appointment interactions.
- Test dashboard navigation.
- Test mobile layout.
- Check console for JavaScript errors.
- Check all referenced assets and files.
- Check that no old branding remains.
