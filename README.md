# ReHome — Student Tenancy Takeover Marketplace

A modern, playful-yet-monochrome student "tenancy takeover / replacement tenant" marketplace web app.

## Features

- 🏠 Browse and search student accommodation contract takeovers
- 🔍 Advanced filtering (city, provider, price, dates, room type, etc.)
- ➕ Create and manage listings (add, edit, delete)
- 🌓 Dark/light mode toggle with smooth animations
- 💾 LocalStorage persistence (data persists across refreshes)
- 📱 Fully responsive design
- ⚡ Fast, debounced search
- 🎨 Modern UI with smooth transitions and microinteractions

## Tech Stack

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS** with CSS variables for theming
- **React Router** for navigation
- **Zustand** for state management
- **React Hook Form** + **Zod** for form validation
- **Lucide React** for icons
- **date-fns** for date formatting

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

### Adding a Listing

1. Click "Add Listing" in the navigation
2. Fill out the multi-section form
3. Submit to create your listing
4. The listing will appear immediately in the listings grid

### Searching & Filtering

- Use the search bar to filter by title, city, building, provider, university, or postcode
- Open the filters panel to refine by:
  - City
  - Provider (Unite Students, iQ, Vita, Other)
  - Room type (Ensuite, Studio, Shared, Other)
  - Price range
  - Bills included
  - Has incentives
- Use the sort menu to order by newest, price, or availability dates

### Managing Listings

- Click on any listing card to view details
- Edit or delete listings from the detail page
- All changes are saved to LocalStorage automatically

### Resetting Demo Data

- Click the "Reset" button in the navigation to restore the original seed listings
- This will clear all your custom listings

## Data Storage

This MVP stores all data in the browser's LocalStorage. No server, database, or authentication is required. Data persists across page refreshes but is specific to each browser/device.

## Project Structure

```
src/
  app/
    router.tsx          # React Router configuration
    layout/
      Layout.tsx        # Main app layout with navigation
  components/
    ui/                 # Reusable UI components
    listings/           # Listing-specific components
    forms/              # Form components
  pages/
    Home.tsx            # Main listings page
    ListingDetail.tsx   # Listing detail view
    NewListing.tsx      # Create listing page
    EditListing.tsx     # Edit listing page
    About.tsx           # About page
  store/
    listingsStore.ts    # Zustand store for listings
    themeStore.ts       # Zustand store for theme
  data/
    seedListings.ts     # Demo/seed data
  lib/
    utils.ts            # Utility functions
    storage.ts          # LocalStorage helpers
    format.ts           # Formatting utilities
  types/
    index.ts            # TypeScript type definitions
```

## Notes

- This is an MVP/local demo version
- No authentication or user accounts
- No real database or backend API
- All data is stored locally in the browser
- Perfect for validating UX and user flows before building a full production app

## License

MIT

