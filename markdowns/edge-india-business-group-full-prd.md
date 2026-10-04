# Edge India Business Group — Full PRD

**Project:** Edge India Business Group Official Website + Admin CMS  
**Version:** 1.0  
**Date:** 02 October 2026  
**Status:** Frontend prototype completed; backend/CMS implementation pending

## 1. Overview

Build and launch the official website for **Edge India Business Group**.

A high-fidelity frontend prototype has already been created in Google Stitch and converted to Next.js. The existing UI is the approved visual baseline. Backend functionality should be integrated into the existing prototype rather than rebuilding the frontend.

The final product contains:

- Responsive public website
- Lightweight custom admin CMS
- Supabase Authentication
- Supabase PostgreSQL
- Supabase Storage
- Browser-side image validation, resizing, WebP conversion, and compression

The system should be professional, fast, simple, secure, and easy to maintain.

---

## 2. Current Status

### Completed

- UI/UX prototype created in Google Stitch
- Prototype converted to Next.js
- Main public sections implemented
- Official Edge India logo incorporated
- Visual direction established

### Remaining

1. Stabilize/refactor generated Next.js code
2. Set up Supabase
3. Create database schema
4. Create storage bucket
5. Configure RLS
6. Implement admin authentication
7. Build admin dashboard
8. Build Members CMS
9. Build Gallery CMS
10. Implement image optimization
11. Connect public UI to Supabase
12. Test and deploy

---

# 3. Brand Identity

The official Edge India Business Group logo is the visual source of truth.

Logo characteristics:

- Deep royal/navy blue
- Vivid red
- White background
- Geometric/angular typography
- EI emblem
- Tagline: **BUSINESS | COMMUNITY | GROWTH**

### Visual rules

Use:

- White as the dominant background
- Deep royal/navy blue as the primary brand color
- Red as a controlled accent

Do not overuse red.

The design should feel:

- Professional
- Premium
- Modern
- Confident
- Human
- Community-focused

Avoid:

- Generic corporate templates
- Excessive gradients
- Neon effects
- Excessive glassmorphism
- Overly rounded cards
- Excessive shadows
- Excessive animation

The existing Stitch design should not be unnecessarily redesigned.

---

# 4. Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Existing Stitch-generated UI

## Backend

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage

## Hosting

- Vercel for Next.js
- Supabase for backend services

## Image processing

Browser-side processing before upload:

- Maximum original size: 5 MB
- Resize large images
- Maximum dimension: approximately 1600px
- Convert to WebP
- Compression quality: approximately 80

**Cloudinary is not required.**

---

# 5. Public Website

Main sections:

1. Navbar
2. Hero
3. About
4. Members
5. Gallery
6. CTA
7. Footer

---

# 6. Navbar

Use the official Edge India logo.

Navigation:

- Home
- About
- Members
- Gallery
- Contact

CTA:

**Connect With Us**

Requirements:

- Sticky
- Responsive
- Smooth navigation
- Mobile hamburger menu
- Clear hover/active states
- Subtle scroll-state transition

Preserve the existing prototype design.

---

# 7. Hero

Purpose: create a strong first impression.

Suggested content:

**EDGE INDIA BUSINESS GROUP**

**Building Connections. Creating Opportunities.**

**Business • Community • Growth**

Supporting copy:

> A community bringing ambitious people together to connect, collaborate, exchange ideas, and create meaningful opportunities.

Buttons:

- Meet Our Members
- Explore Gallery

Use authentic professional/business/community photography.

Maintain strong contrast and use blue as the main brand color with restrained red accents.

---

# 8. About

Eyebrow:

**WHO WE ARE**

Heading:

**Business. Community. Growth.**

Explain that Edge India Business Group brings people together through business relationships, collaboration, shared knowledge, and opportunities for growth.

Highlights:

- **01 — Meaningful Connections**
- **02 — Collaborative Growth**
- **03 — Shared Opportunities**

Use the existing Stitch layout.

---

# 9. Members

The Members section is CMS-driven.

Each member supports:

- Name
- Designation
- Bio
- Profile photo
- Display order
- Active/inactive status

Public rules:

```text
is_active = true
ORDER BY display_order ASC
```

Member cards should contain:

- Professional image
- Name
- Designation
- Optional bio

Use subtle hover interactions.

The public Members section must no longer rely on hardcoded production data after CMS integration.

---

# 10. Gallery

The Gallery is CMS-driven.

Each item supports:

- Title
- Image URL
- Category
- Display order
- Active/inactive status
- Created date

Initial categories:

- All
- Events
- Meetings
- Community

Public rules:

```text
is_active = true
ORDER BY display_order ASC
```

Requirements:

- Responsive grid/masonry layout
- Lazy loading
- Hover interaction
- Lightbox/large-image view
- Category filtering
- Mobile-friendly layout

The existing Stitch gallery design should be preserved.

---

# 11. CTA

Suggested content:

**Let's build something meaningful together.**

> Connect with Edge India Business Group and become part of a community built around relationships, ideas, and opportunities.

Button:

**Get In Touch**

Use deep blue as the main background, white text, and restrained red accents.

---

# 12. Footer

Include:

### Brand
Edge India Business Group

**BUSINESS | COMMUNITY | GROWTH**

### Navigation

- Home
- About
- Members
- Gallery
- Contact

### Connect

- Instagram
- LinkedIn
- Facebook
- Email

### Contact

Use organization-approved contact details.

### Copyright

**© 2026 Edge India Business Group. All rights reserved.**

---

# 13. Admin CMS

Create a lightweight CMS inside the same Next.js application.

Routes:

```text
/admin/login
/admin
/admin/members
/admin/gallery
```

Admin navigation:

```text
Dashboard
Members
Gallery
Logout
```

Do not build a generic page builder.

---

# 14. Admin Authentication

Use **Supabase Auth**.

Do not implement custom password hashing or custom authentication.

The initial admin account is created in Supabase Authentication.

Example:

```text
Email: admin@edgeindia.com
Password: secure-password
```

The password must not be stored in a custom database table.

### Login flow

```text
/admin
   ↓
Auth check
   ↓
Not authenticated
   ↓
/admin/login
   ↓
Email + password
   ↓
Supabase Auth
   ↓
Success
   ↓
/admin
```

Unauthenticated users must not access admin pages.

Logout must invalidate the Supabase session and return the user to login.

---

# 15. Admin Dashboard

Keep the dashboard simple.

Show:

- Total Members
- Total Gallery Images

Optional analytics are out of scope for version 1.

---

# 16. Members CMS

Admin capabilities:

- Add member
- Edit member
- Delete member
- Activate/deactivate member
- Change display order
- Upload/change profile photo

### Form

```text
Name
Designation
Bio
Photo
Display Order
Active
```

### Listing

Show:

- Photo
- Name
- Designation
- Status
- Display order
- Edit
- Delete

Use confirmation before destructive deletion.

---

# 17. Gallery CMS

Admin capabilities:

- Upload image
- Edit title
- Edit category
- Delete image
- Activate/deactivate image
- Change display order

### Form

```text
Title
Category
Image
Display Order
Active
```

### Listing

Show:

- Thumbnail
- Title
- Category
- Status
- Display order
- Edit
- Delete

---

# 18. Image Upload Rules

Allowed input:

- JPG/JPEG
- PNG
- WEBP

Maximum original file:

**5 MB**

If the selected file is greater than 5 MB:

```text
Reject upload
"Image must be smaller than 5 MB."
```

The oversized file must not be uploaded.

---

# 19. Image Optimization

Optimize images before sending them to Supabase.

Flow:

```text
Select image
    ↓
Validate type
    ↓
Validate original size
    ↓
> 5 MB?
    ├── Yes → Reject
    └── No
         ↓
Resize if needed
         ↓
Max dimension ~1600px
         ↓
Convert to WebP
         ↓
Compress ~80 quality
         ↓
Upload optimized image
         ↓
Supabase Storage
```

The 5 MB limit applies to the **original selected file**, not the final WebP.

Do not enforce an artificial fixed final size such as exactly 800 KB. The goal is good visual quality with substantially lower file size.

---

# 20. Supabase Storage

Use one bucket:

```text
media/
```

Folders:

```text
media/
├── members/
│   ├── uuid-1.webp
│   ├── uuid-2.webp
│   └── ...
└── gallery/
    ├── uuid-1.webp
    ├── uuid-2.webp
    └── ...
```

Use generated UUID filenames.

Do not use user-provided filenames as permanent identifiers.

---

# 21. Database Schema

## members

```text
id              uuid primary key
name            text not null
designation     text
bio             text
image_url       text
display_order   integer default 0
is_active       boolean default true
created_at      timestamptz default now()
```

## gallery

```text
id              uuid primary key
title           text
image_url       text
category        text
display_order   integer default 0
is_active       boolean default true
created_at      timestamptz default now()
```

UUIDs should be generated by the database.

---

# 22. Security / RLS

Enable Supabase Row Level Security.

### Public

Can read active members and active gallery items.

Cannot:

- Insert
- Update
- Delete

### Admin

Authenticated admin can:

- Insert
- Update
- Delete

Database-level RLS is mandatory. Do not rely only on frontend route protection.

Never expose a Supabase service-role key in browser/client code.

Use environment variables for credentials.

---

# 23. Performance

Requirements:

- Compress uploaded images
- Convert to WebP
- Resize large images
- Lazy-load gallery images
- Avoid loading all large images at once
- Use responsive images
- Keep animations lightweight
- Avoid unnecessary dependencies
- Optimize fonts
- Keep JavaScript bundles reasonable

---

# 24. Responsive Design

Public website:

- Desktop
- Laptop
- Tablet
- Mobile

Admin:

- Desktop-first
- Mobile usable

Do not simply shrink desktop layouts; use intentional responsive layouts.

---

# 25. UX States

Implement:

### Loading

```text
Loading members...
Loading gallery...
Uploading image...
Saving...
```

### Empty

```text
No members available.
```

```text
No gallery images available.
```

### Errors

```text
Unable to load gallery.
Please try again.
```

```text
Image upload failed.
Please try again.
```

### Destructive confirmation

```text
Delete this member?

[Cancel] [Delete]
```

Same approach for gallery items.

---

# 26. Admin Upload UX

After selecting an image, show:

- Filename
- Original size
- Validation status
- Processing state
- Preview
- Upload state
- Success/error

Example:

```text
team-photo.jpg
3.8 MB

Optimizing...

Converted:
WebP
~520 KB

[Save]
```

---

# 27. SEO

Implement:

- Page title
- Meta description
- Open Graph metadata
- Favicon
- Semantic headings
- Descriptive image alt text

Suggested title:

**Edge India Business Group | Business • Community • Growth**

Suggested description:

**Edge India Business Group connects people, ideas, and opportunities through business, community, and collaboration.**

Final copy can be updated after organization approval.

---

# 28. Accessibility

Requirements:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible mobile menu
- Alt text
- Sufficient contrast
- Accessible lightbox controls
- Proper button labels

Do not communicate important information by color alone.

---

# 29. Suggested Project Structure

Adapt this to the existing Stitch-generated project rather than forcing a rewrite.

```text
edge-india/
├── app/
│   ├── page.tsx
│   ├── admin/
│   │   ├── login/
│   │   ├── page.tsx
│   │   ├── members/
│   │   └── gallery/
│   └── ...
├── components/
│   ├── navbar/
│   ├── hero/
│   ├── about/
│   ├── members/
│   ├── gallery/
│   ├── cta/
│   ├── footer/
│   └── admin/
├── lib/
│   ├── supabase/
│   └── image/
├── types/
│   ├── member.ts
│   └── gallery.ts
└── public/
```

---

# 30. Development Plan

## Phase 1 — Stabilize Existing Prototype

- Review generated Next.js code
- Remove unnecessary generated code
- Fix responsive issues
- Verify navigation
- Verify mobile menu
- Verify gallery UI
- Verify member UI
- Preserve approved visual design

**Deliverable:** stable frontend.

## Phase 2 — Supabase

Create:

- Project
- Environment variables
- Members table
- Gallery table
- Storage bucket
- Storage policies
- RLS

**Deliverable:** backend foundation.

## Phase 3 — Authentication

Implement:

- Login
- Session handling
- Protected routes
- Logout
- Auth error states

**Deliverable:** secure admin access.

## Phase 4 — Members CMS

Implement:

- List
- Add
- Edit
- Delete
- Active/inactive
- Ordering
- Image upload
- Compression

**Deliverable:** working Members CMS.

## Phase 5 — Gallery CMS

Implement:

- List
- Upload
- Edit
- Delete
- Category
- Active/inactive
- Ordering
- Compression

**Deliverable:** working Gallery CMS.

## Phase 6 — Public Integration

Replace placeholders with Supabase queries.

```text
Supabase → Members → Public Members section
Supabase → Gallery → Public Gallery section
```

**Deliverable:** CMS-driven website.

## Phase 7 — Polish

- Loading states
- Empty states
- Error handling
- Mobile testing
- SEO
- Accessibility
- Performance
- Final visual polish

## Phase 8 — Deployment

```text
GitHub
   ↓
Vercel
   ↓
Next.js

Supabase
   ├── Auth
   ├── PostgreSQL
   └── Storage
```

Configure production environment variables securely.

---

# 31. Testing Checklist

## Public

- [ ] Navbar
- [ ] Mobile menu
- [ ] Hero
- [ ] About
- [ ] Members
- [ ] Gallery
- [ ] Gallery filters
- [ ] Lightbox
- [ ] CTA
- [ ] Footer
- [ ] Responsive layouts

## Admin

- [ ] Login
- [ ] Invalid credentials
- [ ] Protected routes
- [ ] Logout
- [ ] Members CRUD
- [ ] Gallery CRUD
- [ ] Image validation
- [ ] 5 MB rejection
- [ ] WebP conversion
- [ ] Compression
- [ ] Delete confirmation

## Security

- [ ] RLS enabled
- [ ] Unauthenticated writes blocked
- [ ] Service-role key never exposed
- [ ] Admin routes protected
- [ ] Storage policies correct

## Performance

- [ ] Images optimized
- [ ] Lazy loading
- [ ] Production build succeeds
- [ ] Mobile performance checked
- [ ] No unnecessary dependencies

---

# 32. Out of Scope — Version 1

Do not implement unless specifically requested:

- Full page builder
- Blog CMS
- Newsletter platform
- E-commerce
- Advanced analytics
- Multiple organizations
- Complex role management
- Approval workflows
- Version history
- Comments
- Video CMS
- Cloudinary
- Advanced media transformation pipeline

---

# 33. Future Enhancements

Potential future features:

- Multiple admin accounts
- Admin/editor roles
- Event management
- Contact form management
- Announcements
- Blog/news
- Member profile pages
- Search
- Advanced gallery categories
- Event pages
- Analytics
- Automatic image variants

Only add these when there is a real requirement.

---

# 34. Final Architecture

```text
                         EDGE INDIA WEBSITE
                                  │
                ┌─────────────────┴─────────────────┐
                │                                   │
          PUBLIC WEBSITE                         ADMIN CMS
                │                                   │
        ┌───────┼────────┐                  ┌───────┴───────┐
        │       │        │                  │               │
      About  Members  Gallery            Members          Gallery
                │        │                  │               │
                └────────┴──────────────────┴───────────────┘
                                  │
                              SUPABASE
                     ┌────────────┼────────────┐
                     │            │            │
                  Auth        PostgreSQL     Storage
                     │            │            │
                  Admin       CMS data      WebP images
```

---

# 35. Definition of Done

Version 1 is complete when:

1. The existing Stitch/Next.js design is stable and responsive.
2. The official Edge India brand identity is preserved.
3. The public website contains Hero, About, Members, Gallery, CTA, and Footer.
4. Admin can securely log in.
5. Admin can create, edit, delete, activate/deactivate, and reorder members.
6. Admin can upload, edit, delete, activate/deactivate, and reorder gallery items.
7. Images over 5 MB are rejected before upload.
8. Valid images are resized, converted to WebP, compressed, and uploaded to Supabase Storage.
9. Public Members and Gallery sections load their data from Supabase.
10. RLS prevents unauthorized database changes.
11. The website is responsive and accessible.
12. Production deployment works successfully on Vercel.

---

# 36. Core Principle

Keep the system simple.

### Public website

**Attractive + Professional + Responsive + Fast**

### CMS

**Login + Members + Gallery**

### Backend

**Supabase Auth + PostgreSQL + Storage + RLS**

### Images

**5 MB maximum original → Resize → WebP → Compress → Supabase Storage**

### Most important implementation rule

The current Stitch-generated Next.js prototype is the **visual baseline**.

Do not rebuild the frontend from scratch. Integrate the backend and CMS into the existing prototype while preserving its approved visual design.
