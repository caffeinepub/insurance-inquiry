# Specification

## Summary
**Goal:** Build InsureEase, a professional insurance inquiry website with a public-facing site and an admin dashboard for managing submissions.

**Planned changes:**
- Multi-type insurance inquiry/quote request form (Health, Auto, Life, Home) with dynamic fields per type, validation, and backend persistence with timestamp and status
- Browse Insurance Plans page displaying plan cards grouped by insurance type, each with name, coverage highlights, and a CTA that pre-fills the inquiry form
- Contact an Agent section showing agent info (name, specialization, phone, email) and a contact message form saved to the backend
- Admin Dashboard on a protected route listing all inquiries and contact messages, with filtering by insurance type/status and the ability to update inquiry status (Pending, In Review, Resolved)
- Navigation bar linking to Home, Plans, Contact, and Admin Dashboard; footer with basic site info
- Professional responsive design using a warm neutral and deep teal color palette with clean sans-serif typography
- All backend logic in a single Motoko actor; admin route protected by a simple client-side route guard

**User-visible outcome:** Visitors can browse insurance plans, submit inquiries or contact an agent, and receive confirmation. Admins can log into a dashboard to view, filter, and update the status of all submitted inquiries and contact messages.
