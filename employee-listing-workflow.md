# Employee Listing and Profile Page: Workflow Report

> The application currently calls these records **members**. This report uses “employee” to match the feature request, but the underlying source is the Edge India member directory.

## Current home page workflow

1. `app/page.tsx` renders the home page sections, including `components/Members.tsx`.
2. The Members component creates the browser Supabase client and selects all rows from `members` where `is_active = true`, ordered by `display_order` and then `name`.
3. `lib/members.ts` maps each database row (`MemberRow`) into the UI `Member` shape.
4. The home page shows up to eight cards by default. Search and category filters show matching results; “View All Members” links to `/members` when there are more than eight.
5. `components/members/MemberCard.tsx` displays the image, name, role, and company on the front. Its reverse side shows category, bio, location, website, and email when available.
6. Selecting a card calls `onSelectMember`; both the home page and `/members` currently show `MemberModal` with the selected record.

## Current data model

### Database row (`members`)

| Field | Type | Use |
| --- | --- | --- |
| `id` | string | Stable database record identifier |
| `username` | unique string | Editable profile slug generated from the entrepreneur’s name |
| `name` | string | Member name and directory search |
| `company` | string | Company name and directory search |
| `designation` | nullable string | Mapped to UI role, defaulting to `Member` |
| `category` | nullable string | Mapped to category and badge |
| `bio` | nullable string | Mapped to card description and full bio |
| `image_url` | nullable string | Public profile image |
| `website` | nullable string | Company/member website |
| `email` | nullable string | Contact link |
| `phone` | nullable string | Contact number |
| `company_logo_url` | nullable string | Company logo shown on the profile |
| `personal_instagram_url` | nullable string | Optional executive Instagram URL or handle |
| `company_instagram_url` | nullable string | Optional company Instagram URL or handle |
| `office_phone` | nullable string | Company office number |
| `map_url` | nullable string | Google Maps URL, place ID, or address for map and directions |
| `is_active` | boolean | Public listing visibility filter |
| `display_order` | number | Listing sort order |
| `created_at`, `updated_at` | timestamp strings | Record timestamps |

### UI model (`Member`)

The UI model contains `id`, `name`, `role`, `badge`, `categories`, `company`, `image`, `description`, `sector`, `fullBio`, `keyInitiatives`, `location`, `tenure`, `website`, `email`, and `phone`. Several display fields (`sector`, `keyInitiatives`, `location`, `tenure`) are not currently present in `MemberRow`; the mapper fills them with empty values. The current database-backed listing supports only the fields in the row table above.

## Per-member page workflow

1. Each card opens `/members/[username]`; the slug is generated from the entrepreneur’s name when creating a member.
2. Admins can edit the username. The admin form checks for an existing username before saving; a case-insensitive unique database index also protects against duplicates.
3. The dynamic route fetches that one active row from `members` by username and maps it with `toPublicMember`.
4. The first profile section displays company logo, company name, executive portrait, member name and designation, direct call, downloadable contact card, email, and optional personal Instagram.
5. The Company Details section displays office number, company Instagram, website, and a Google map with a Directions link when a map location is available.
6. Missing or inactive member records show the app’s not-found page. The page uses a dark, solid-color theme and ends with the Vortex initiative footer and provided logo.

## Implementation notes

- No employee-specific table or separate profile data model exists; the new profile fields are added to the existing `members` table.
- Public page queries must respect active-member visibility and existing Supabase row-level security policies.
- Contact data is optional. The page should omit absent fields and use safe `mailto:` / `tel:` links.
- A readable slug could be added later, but the existing `id` is the simplest unique route key and avoids slug collisions.

## Relevant files

- `app/page.tsx` — home page section composition and modal state.
- `components/Members.tsx` — data loading, filtering, and list limit.
- `components/members/MemberCard.tsx` — card UI and selection interaction.
- `components/MemberModal.tsx` — current selected-member detail UI.
- `app/members/page.tsx` — full directory page.
- `lib/members.ts` — database row type and database-to-UI mapping.
- `components/data.ts` — UI `Member` type.
