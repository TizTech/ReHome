# context.md — Student Tenancy Takeover Marketplace (Localhost MVP, No DB/Auth)

## 0) High-level goal
Build a modern, playful-yet-monochrome student “tenancy takeover / replacement tenant” marketplace web app.

This is an **MVP that runs fully on localhost** with:
- **No database**
- **No authentication**
- **No backend API**
- **No payments**
- Storage is **in-memory + optional LocalStorage** only (for persistence across refresh; still local-only).

Focus: excellent UX for **adding listings** and **searching/filtering listings**.

## 1) Product concept (what the app does)
Users can:
1) Browse listings for student accommodation contract takeovers.
2) Search + filter listings quickly (city, provider, price, dates, ensuite, etc.).
3) Add a new listing via a clean form.
4) View listing details.
5) (Optional) Edit / delete a listing locally (since no auth, we can allow it for MVP; show a warning “local-only demo”).

We are validating the idea and UX before adding auth, a real DB, and provider workflows.

## 2) Tech constraints & decisions
### Must-haves
- Frontend-only app
- Runs on localhost
- Good UI, animations, polished microinteractions
- Dark/light mode toggle
- Rounded corners, monochrome palette, playful touches (subtle gradients, soft shadows, smooth transitions)

### Must NOT include (for now)
- No server
- No auth
- No database
- No external API calls required

### Recommended stack
- Vite + React + TypeScript
- Tailwind CSS (with CSS variables for theming)
- React Router
- Zustand (or React Context) for state management
- LocalStorage persistence (optional but recommended)
- zod + react-hook-form for forms + validation
- lucide-react icons
- date-fns for date handling

## 3) UX / Visual design direction
### Style keywords
- monochrome / near-monochrome
- playful but minimal
- premium “product hunt” feel
- rounded corners (12–20px)
- soft shadows
- clean typography

### Theme
Implement light/dark mode with CSS variables:
- background, surface, surface-2
- text, muted text
- border
- accent (monochrome accent like near-white/near-black, or a very subtle single accent like slate/neutral)
- focus ring

Dark/light toggle should:
- animate smoothly
- persist preference in localStorage
- respect `prefers-color-scheme` on first load

### Components should feel modern
- cards with subtle hover lift
- pill badges
- skeleton loaders (fake) when switching filters/search
- empty states that look intentional
- keyboard-friendly search and form

## 4) App pages / routes
Use React Router with these routes:

1) `/` — Home / Listings
- Search bar (global)
- Filter drawer/panel
- Listings grid
- Sort control
- “Add listing” button

2) `/listings/:id` — Listing detail
- Gallery placeholder (no uploads for now; allow image URLs list)
- Key facts panel
- Contact method CTA (copy-to-clipboard: email/phone/instagram)
- “Back” + “Edit/Delete (local demo)” controls

3) `/new` — Add listing
- Multi-section form with validation
- Preview card on the side (live preview)

4) `/about` — Simple explanation of concept (optional)

## 5) Core data model (TypeScript)
Create a `Listing` type like:

- id: string (uuid)
- title: string (e.g., “Unite Students Brook Hall — Ensuite takeover”)
- provider: 'Unite Students' | 'iQ' | 'Vita' | 'Other'
- buildingName: string
- university: string (optional)
- city: string
- postcode: string (optional)
- roomType: 'Ensuite' | 'Studio' | 'Shared' | 'Other'
- pricePerWeek: number
- billsIncluded: boolean
- contractStart: string (ISO date)
- contractEnd: string (ISO date)
- availableFrom: string (ISO date)
- minTenancyWeeks: number (optional)
- deposit: number (optional)
- incentives:
  - cashbackAmount?: number
  - discountedWeeks?: number
  - notes?: string
- amenities: string[] (e.g., “gym”, “cinema room”, “study room”, “laundry”)
- images: string[] (image URLs; optional)
- description: string
- contact:
  - name?: string
  - email?: string
  - phone?: string
  - instagram?: string
  - preferredMethod: 'email' | 'phone' | 'instagram'
- createdAt: string (ISO)
- updatedAt: string (ISO)

Also store:
- status: 'available' | 'pending' | 'taken' (local demo)

## 6) Sample seed listings
Ship with 12–20 seeded demo listings across major UK student cities (Manchester, Leeds, Birmingham, Nottingham, Sheffield, Bristol, London, Glasgow, etc.).
Ensure variety in:
- provider
- room types
- price ranges
- dates
- incentives

Seed listings load on first run. If localStorage has data, use that instead.

## 7) State & storage approach (no DB)
Implement a `listingsStore` with:
- listings: Listing[]
- addListing(listing)
- updateListing(id, patch)
- deleteListing(id)
- importSeedIfEmpty()
- resetToSeed()
- setFilters(filters)
- setSearch(query)
- getFilteredSortedListings() selector

Persistence:
- Save listings to localStorage on change
- Save theme preference + filters in localStorage
- Provide a “Reset demo data” button in settings/menu

## 8) Search, filter, sort requirements
### Search
Single search input that matches against:
- title
- city
- buildingName
- provider
- university
- postcode

Debounce 200–300ms.

### Filters (must have)
- City (multi-select)
- Provider (multi-select)
- Room type
- Price range slider (min/max)
- Contract end date (before/after)
- Available from (before/after)
- Bills included toggle
- Incentives toggle (only show listings with cashback/discounts)

### Sorting (must have)
- Newest
- Price: low to high
- Price: high to low
- Available from: soonest
- Contract end: soonest

### UI behavior
- Filters in a side panel on desktop
- Slide-over drawer on mobile
- Show active filter chips with “clear” actions
- Clear all button

## 9) Add Listing form requirements
Form should be split into sections:
1) Basics: title, provider, building, city, postcode
2) Room & pricing: roomType, pricePerWeek, billsIncluded, deposit
3) Dates: contractStart/end, availableFrom, minTenancyWeeks
4) Amenities: multi-select + free tag entry
5) Incentives: cashback, discounted weeks, notes
6) Media: image URL list (add/remove fields)
7) Description
8) Contact: preferred method + relevant fields

Validation:
- required fields: title, provider, buildingName, city, roomType, pricePerWeek, availableFrom, contractEnd, description, preferredMethod + at least one contact method value
- dates: contractStart <= contractEnd; availableFrom <= contractEnd
- price must be > 0
- image URL must be valid URL if provided

On submit:
- Create Listing with uuid, timestamps
- Save to store
- Navigate to detail page
- Toast “Listing added (local demo)”

## 10) Listing cards & detail page requirements
### Card
- Title, city, provider badge, room type badge
- Price/week prominent
- “Available from” + “Contract ends” small text
- Incentive badge if cashback/discount exists
- Hover animation and quick actions (view, copy contact)

### Detail
- Hero section with gallery (image carousel if image URLs exist; otherwise placeholder)
- Key facts grid
- Amenities pills
- Incentives callout
- Description
- Contact CTA:
  - Copy email/phone to clipboard
  - For instagram, open link if provided (in a new tab)
- “Report listing” button (no backend; show modal “Coming soon”)

## 11) Layout / navigation
Top nav:
- Logo (monochrome mark)
- Search shortcut (focus input)
- Theme toggle
- “Add listing” button

Footer:
- “Local demo” disclaimer
- “Reset demo data” link/button

## 12) Accessibility & quality bar
- Keyboard navigation for everything
- Proper labels for form fields
- Focus states visible
- ARIA for dialogs/drawers
- Responsive design (mobile-first)
- No console errors

## 13) Folder structure (suggested)
src/
  app/
    router.tsx
    layout/
  components/
    ui/ (button, input, badge, card, modal, drawer, toast)
    listings/ (ListingCard, ListingGrid, FiltersPanel, SortMenu)
    forms/ (ListingForm sections)
  pages/
    Home.tsx
    ListingDetail.tsx
    NewListing.tsx
    About.tsx
  store/
    listingsStore.ts
    themeStore.ts
  data/
    seedListings.ts
  lib/
    utils.ts
    storage.ts
    format.ts

## 14) Deliverables
Cursor should generate:
- A working Vite React TS project
- Tailwind configured with theming variables
- All pages/routes
- Store + persistence
- Seed data
- Polished UI components
- Fast search/filter/sort
- Dark/light mode toggle

## 15) Non-goals (explicitly out of scope)
- Authentication
- Real database
- Backend API
- Payments / escrow
- Provider integrations
- Image uploads
- Messaging system

## 16) Copy guidelines (tone)
- Friendly, modern, minimal
- Use “contract takeover”, “replacement tenant”, “tenancy transfer”
- Always show a “Local demo: data stays on this device” disclaimer

## 17) Acceptance checklist
- `npm install && npm run dev` works
- Add listing works and appears immediately
- Search/filter/sort works smoothly
- Theme toggle works + persists
- LocalStorage persists listings
- Reset demo data restores seeded listings
- Looks premium and modern on mobile + desktop
