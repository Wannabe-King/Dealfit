# Dealfit – SaaS for Country-Specific Discounts Banners

>  Dealfit is a full **SaaS platform** designed to create a **seven-figure business** by offering **localized discounts** and empowering businesses with analytics, subscription tiers, and customizable banners.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Architecture & File Structure](#architecture--file-structure)
- [Database Schema](#database-schema)
- [User Flow](#user-flow)
- [Key Concepts & Best Practices](#key-concepts--best-practices)
- [Future Scope](#future-scope)

---

## Project Overview

- Detects a user’s **country** to serve **tailored coupon discounts**.  
- Adjusts discounts based on **purchasing power parity (PPP)**.  
- SaaS model with **tiered subscriptions, analytics, and product/banner management**.  
- Revenue goal: **1,000 paying users × $100/month = $1M+ annually**.  

---

## Technology Stack

| Category              | Tech Used |
|-----------------------|-----------|
| **Framework**         | Next.js |
| **Styling**           | ShadCN, Tailwind CSS |
| **Authentication**    | Clerk |
| **Database**          | Neon (PostgreSQL) + Drizzle ORM |
| **Schema Validation** | Zod |
| **Forms**             | React Hook Form |
| **Dates & Timezones** | Date-FNS, Date-FNS TZ |
| **Charts**            | ShadCN Charts (Recharts) |
| **Payments**          | Stripe |
| **Env Management**    | T3 Environment |

---

## Architecture & File Structure

```
dealfit/
├── app/                     # Core app pages & layouts
│   ├── _auth/               # Auth pages (sign-in, sign-up)
│   ├── dashboard/           # Authenticated dashboard
│   │   ├── analytics/       # Data visualizations
│   │   ├── products/        # Product CRUD + customization
│   │   └── subscription/    # User subscription management
│   ├── marketing/           # Public landing + pricing
│   └── api/                 # API routes & webhooks
│       ├── webhooks/        # Clerk + Stripe events
│       └── products/...     # Banner embed API
├── components/              # Reusable UI
├── data/                    # Static configs & schemas
├── drizzle/                 # Database setup & migrations
├── lib/                     # Utility functions
├── server/                  # Server-side logic
└── tasks/                   # One-off scripts (e.g. seed data)
```


---

## Database Schema

### Core Tables & Relationships
| Table | Purpose | Key Relationships |
|-------|----------|------------------|
| **ProductTable** | Stores product details | FK → Clerk User |
| **ProductCustomizationTable** | Banner customization | 1-1 with Product |
| **CountryTable** | Country details | FK → CountryGroup |
| **CountryGroupTable** | Groups by PPP | FK target for discounts |
| **CountryGroupDiscountTable** | Product × CountryGroup discounts | Composite PK (`productId+groupId`) |
| **ProductViewTable** | Tracks views by country | FK → Product, Country |
| **UserSubscriptionTable** | Stores subscription tier & Stripe IDs | FK → Clerk User |

 **Relationships summary**:
- User ↔ Products (1-many)  
- Product ↔ Customization (1-1)  
- Product ↔ Discounts (1-many)  
- CountryGroup ↔ Countries (1-many)  
- Product ↔ Views (1-many)  
- User ↔ Subscription (1-1)  

---

## User Flow

### 1. Marketing Website
- Landing page (`/`)
- Pricing tiers (`/pricing`)
- CTA → Clerk Sign-in / Sign-up

### 2. Authentication
- Custom Clerk pages (`/_auth`)
- Webhooks:  
  - **User created** → Initialize free subscription  
  - **User deleted** → Clean up all related data  

### 3. Dashboard (`/dashboard`)
- **Overview:** products + quick analytics  
- **Products:** CRUD + customization  
- **Analytics:** charts, filters (timeframe, product, timezone)  
- **Subscription:** view usage, upgrade/downgrade via Stripe  

### 4. Product Customization
- Tabbed interface: **Details, Discounts, Banner**  
- Live preview of banners  
- Permissions enforced via subscription tier  

### 5. Banner API (`/api/products/[id]/banner`)
- Returns **static HTML + CSS + JS snippet**  
- Logs product views  
- Checks subscription permissions before showing discount  

---

## Key Concepts & Best Practices

- **Clean Architecture:** Modular folders & isolated concerns.  
- **Type Safety:** TypeScript + Zod + T3 Environment.  
- **Centralized Permissions:** All access checks in `server/permissions.ts`.  
- **Caching:** Three-tier granular cache with tag-based revalidation.  
- **Robust DB Layer:** Centralized Drizzle queries, migrations with versioning.  
- **Error Handling:** Consistent toasts, redirects, and safe fallbacks.  
- **Responsive UI:** Tailwind grid layouts for mobile → desktop.  
- **External Integrations:** Clerk (auth) + Stripe (payments) via webhooks.  

---

## Future Scope

- Multi-language support for global adoption.  
- A/B testing for discount strategies.  
- AI-driven recommendations for optimal discounting.  
- Marketplace for third-party coupon integrations.  
- Admin panel for super-user management & insights.  

---

## License
This project is licensed under the **MIT License**.  
Feel free to use, modify, and contribute!  

---
