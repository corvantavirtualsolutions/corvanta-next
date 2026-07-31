# Corvanta Virtual Solutions - Project Documentation

**Framework:** Next.js 16 (App Router, TypeScript)
**Styling:** Custom CSS design system (no Tailwind)
**Backend:** Supabase (auth + database)
**Deployment:** Vercel (main branch auto-deploys)

---

## 1. Public Pages

### `/` - Homepage
The main landing page. Contains:
- **Hero** - Headline ("Grow your business with skilled Virtual Assistants"), two CTAs (Find a Talent, How It Works), trust badges (vetted & background-checked, matched in 3 days), two floating stat cards, and a hero image slider.
- **Stats band** - Dark navy background band with four stats: 200+ Vetted Virtual Assistants, 100+ Businesses Served, 98% Client Satisfaction, 3 Days Average Time to Match.
- **Why Corvanta** - Six feature cards: Rigorously Vetted, Fast Matching, Dedicated Support, Flexible Engagements, Wide Skill Coverage, Transparent Pricing.
- **How It Works** - Embedded `HowItWorksSection` component showing the 4-step process with an animated road graphic.
- **Services** - Four service cards (Admin Support, Customer Service, Social Media Management, Bookkeeping & Accounting) with a "View all services" link.
- **Industries** - Four industry cards (E-commerce & Retail, Real Estate, Healthcare, Legal) with an "Explore all industries" link.
- **Testimonials** - `TestimonialsSection` component with client quotes and a confetti animation on interaction.
- **CTA Band** - `CTABand` component with a pulsing "Find a Talent" button and trust perks.

*Notable features:* Hero image auto-slider, animated blob CTA band, confetti on testimonial interaction.

---

### `/how-it-works`
Explains the process for businesses hiring a VA. Contains:
- **Page hero** - "A simple process, built for both sides."
- **For Businesses** - `HiringStepsSection` showing a vertical winding-road graphic with 4 hiring steps.
- **Why It Works** - Three accent cards: Rigorous Vetting, Human Matchmaking, Ongoing Support.
- **CTA band** at the bottom.

---

### `/find-a-talent`
The primary conversion page where businesses request a VA match. Contains:
- **Page hero** - "Find the right Virtual Assistant for your business."
- **Matching Form** (`MatchingForm` client component) - A three-phase interactive form:
  - **Form phase** - Three dropdowns (What do you need help with, Hours per week, Budget range), each with an "Other" option that reveals a free-text or number input. Optional project details textarea and file upload (PDF/DOC/image up to 10 MB). Field-level validation with inline error messages. "Get Matched" submit button.
  - **Loading phase** - Animated emoji face with bouncing dots while "searching."
  - **Results phase** - Currently shows an empty state ("no matches available right now - we're growing our talent pool").

*Notable features:* Multi-step form with animated loading state, file attachment, client-side validation.

---

### `/services`
Overview of all VA service categories. Contains:
- **Page hero** - "Services we offer."
- **Services grid** - Nine service cards: Admin Support, Customer Service, Social Media Management, Bookkeeping & Accounting, Content & Copywriting, Data Entry & Research, Executive Assistance, E-commerce Support, Technical & Help Desk Support.
- **Custom Needs** section - CTA inviting users to describe custom requirements.
- **CTA band** at the bottom.

---

### `/services/[name]` - Individual Service Pages
Nine statically-routed service detail pages (one per service slug). Each page uses the `ServicePageLayout` component and includes:
- **Page hero** with the service name and lead description.
- **What's included** - Six or more specific deliverables shown as cards with a hover icon-swap animation (checkmark swaps to a unique icon on hover).
- **Who it's for** - Two-column grid of target customer types.
- **CTA band** with service-specific headline and subtext.

**Available slugs:** `admin-support`, `customer-service`, `social-media-management`, `bookkeeping-accounting`, `content-copywriting`, `data-entry-research`, `executive-assistance`, `ecommerce-support`, `technical-support`.

---

### `/industries`
Showcases the industries Corvanta serves. Contains:
- **Page hero** - "Industries we serve."
- **Industries grid** - Eight industry cards: E-commerce & Retail, Real Estate, Healthcare, Legal, Marketing Agencies, SaaS & Technology, Finance & Insurance, Coaching & Consulting. Cards have a color-accent hover effect.
- **"Not Listed?"** section - CTA linking to contact.
- **CTA band** at the bottom.

---

### `/about-us`
Company background and values page. Contains:
- **Page hero** - "Human connection, powered by great technology."
- **Our Story** - Narrative text alongside a `StorySlider` image carousel (full-bleed right column layout).
- **Our Values** - Four cards: Trust, Excellence, Partnership, Innovation.
- **Stats grid** - Founded 2026, 100+ businesses served, 200+ VAs, 10+ countries.
- **CTA band** at the bottom.

---

### `/contact`
Contact and support page. Contains:
- **Page hero** - "We'd love to hear from you."
- **Info cards** - Four cards: Email Us (corvantavirtualsolutions@gmail.com), Call Us ((463) 223-9883), Visit Us (1800 N Meridian Suite 400b, Indianapolis, IN 46202), Support Hours (Mon-Fri 8 AM-6 PM ET, under 4 hours response).
- **Contact form** (left column) - Full Name, Email, "I am a..." dropdown, Message textarea, Send button. Full-bleed two-column layout with a `ContactSlider` image carousel on the right.
- **FAQ accordion** - Four pre-written Q&As covering matching speed, pricing, cancellation policy, and the VA vetting process.

*Notable features:* Full-bleed two-column layout, expandable FAQ accordion.

---

### `/reviews`
Public reviews page. Contains:
- **Page hero** - "What our clients are saying."
- **Reviews list** (left column) - Displays the 3 most recent submitted reviews from the database (star rating, quote, reviewer name, company). Shows an empty state if no reviews exist yet.
- **Review submission form** (right column, sticky on desktop) - Star rating selector (1-5, green on hover/select), Your name field (auto-filled from user metadata if logged in), Company field (optional, auto-filled if logged in), Feedback textarea. Shows "Thank you for your review!" confirmation on successful submit.

*Notable features:* Real-time data from Supabase, name/company auto-fill for logged-in users, interactive green star rating.

---

### `/blog`
Blog listing page (static content). Contains:
- **Page hero** - "Blog & News."
- **Featured article** - Full-width card with image, badge, date, headline, excerpt, and read link.
- **Post grid** - Six blog post cards with image, category badge, date, title, excerpt, and read link. Categories include Hiring, Productivity, Remote Work, VA Careers, Case Study, Company News.
- **Newsletter signup** - Email input with Subscribe button.

*Note: Blog posts are static content - no CMS integration currently.*

---

### `/login`
User login page. Contains:
- Email input
- Password input with show/hide eye toggle
- "Remember me" checkbox (controls whether the session cookie persists after browser close)
- Submit button with loading state
- Link to sign up

Uses a server action (`login`) with `useActionState`. Error messages display inline.

---

### `/signup`
New user registration page. Contains:
- Full Name input (required)
- Position / Role input (required)
- Company Name input (required)
- Email input (required)
- Password input with show/hide toggle (min 6 characters)
- Confirm Password input with show/hide toggle (must match password)
- Submit button with loading state
- Link to log in

Client-side validation runs before submission: inline error shown under the password field if under 6 characters, inline error under confirm field if passwords do not match. On success, Full Name, Position/Role, and Company are saved to Supabase `user_metadata`.

---

### `/privacy-policy`
Static legal page. Contains the Privacy Policy in a card with 8 sections: Overview, Information We Collect, How We Use Information, Sharing of Information, Data Security, Your Choices, Changes to This Policy, Contact Us. Last updated July 1, 2026.

---

### `/terms-of-service`
Static legal page. Contains the Terms of Service in a card with 10 sections covering acceptance, service description, eligibility, client/VA responsibilities, fees, liability, termination, and governing law (California). Last updated July 1, 2026.

---

### Site-wide components

**Header (`components/Header.tsx`)** - Sticky top navbar with:
- Logo linking to `/`
- Desktop nav: "How It Works" (direct link), "Industries" dropdown (Services We Offer → `/services`, Industries We Serve → `/industries`), "About Us" dropdown (About Us → `/about-us`, Contact → `/contact`, Client Reviews → `/reviews`)
- "Find a Talent" button (green when logged out, dark green when logged in)
- Account avatar (blue circle with email initial) positioned to the right of the button - turns red on hover, opens a dropdown showing the user's email and a Log out button. Hidden if not logged in.
- Mobile hamburger drawer with all nav links flattened, email display, logout, and Find a Talent CTA.

**Cerena Chatbot (`components/CerenaChat.tsx`)** - Fixed floating action button (coconut emoji, bottom-right). Opens a chat window with a scripted response engine. Cerena answers questions about Corvanta's services, how the process works, VA applications, and pricing. Typing indicator between messages, suggestion chips on open.

**Footer (`components/Footer.tsx`)** - Dark navy footer with brand blurb, four link columns (Company, Services, Industries, Legal), social media icons, and copyright line.

---

## 2. Admin Dashboard

### Access

The admin dashboard lives at `/admin` and is protected by a server-side layout (`app/admin/layout.tsx`) that runs on every request:

1. Calls `supabase.auth.getUser()` using the server-side Supabase client (which reads the session cookie).
2. If no session exists → redirects to `/login`.
3. Checks whether the user is an admin:
   - **Super-admin:** email matches `corvantavirtualsolutions@gmail.com` (hardcoded, permanent, cannot be demoted or deleted).
   - **Regular admin:** `user.user_metadata.role === "admin"` (set via the admin dashboard role toggle).
4. If neither condition is met → redirects to `/`.

Non-admins and unauthenticated users never receive any admin HTML.

**Admin header:** On all `/admin` pages the standard site header is hidden and replaced with a stripped-down `AdminHeader` (logo only + avatar/logout). No site nav or "Find a Talent" button.

### Admin account

- **Email:** corvantavirtualsolutions@gmail.com
- **Password:** [stored securely by owner - not documented]
- This account is the permanent super-admin and cannot be demoted or deleted via the dashboard.

---

### `/admin` - Users

Fetches all Supabase auth users server-side via `auth.admin.listUsers()` using the service_role key.

**Table columns:**

| Column | Description |
|---|---|
| Full Name | From `user_metadata.full_name` (shows `-` if missing) |
| Email | Supabase auth email |
| Position / Role | From `user_metadata.position` (shows `-` if missing) |
| Company | From `user_metadata.company` (shows `-` if missing) |
| Last Sign-in | Formatted `last_sign_in_at` |
| Created | Formatted `created_at` |
| Account Role | Badge: Super Admin / Admin / User |
| Actions | Role toggle + Delete button |

**Actions:**

- **Role toggle** (`RoleToggle` client component) - Shows "Make admin" or "Remove admin". Hidden for the super-admin account. Calls `updateUserRole` server action which re-verifies admin status server-side before updating `user_metadata.role`.
- **Delete user** (`DeleteUserButton` client component) - Shows a trash icon / Delete button. Clicking reveals an inline confirmation ("Are you sure you want to delete this user? This cannot be undone.") with Delete / Cancel. On confirm, calls `deleteUser` server action which re-verifies admin status and blocks deletion of the super-admin account server-side. The row disappears on success; inline error shown on failure. Hidden for the super-admin account.

Table is horizontally scrollable on small screens.

---

### `/admin/reviews` - Reviews

Fetches all reviews from the `reviews` table server-side via the service_role key, ordered by `created_at` descending.

**Summary bar (top of page):**
- Average star rating across all reviews (e.g. "4.6 out of 5") with rounded star icons.
- Total review count (e.g. "23 reviews").
- If no reviews exist: shows "No reviews yet." with no NaN or empty states.

**Table columns:**

| Column | Description |
|---|---|
| Rating | 5-star visual display (filled/empty stars) |
| Feedback | Review text (truncated at 300px max-width) |
| Name | `user_name` submitted with the review |
| Company | `company` field (shows `-` if blank) |
| Date | Formatted `created_at` |
| Actions | Delete button |

**Actions:**

- **Delete review** (`DeleteReviewButton` client component) - Inline confirmation ("Delete this review? This cannot be undone.") before deleting. Calls `deleteReview` server action which re-verifies admin status server-side before deleting by `id`. Shows "Deleted." on success; inline error on failure.

**Sidebar navigation** is a client component (`AdminSidebarNav`) that uses `usePathname()` to highlight the active section (Users or Reviews).

---

## 3. Backend / Supabase Integration

### Overview

[Supabase](https://supabase.com) provides both authentication and the Postgres database for this project. All sensitive operations use the `service_role` key exclusively on the server - it is never exposed to the browser.

### Authentication

Supabase Auth handles user sign-up, login, and sessions via the `@supabase/ssr` package, which stores the session in HTTP-only cookies for SSR compatibility.

- **Sign-up** (`app/auth/actions.ts` → `signup`) - Calls `supabase.auth.signUp()` with email, password, and `options.data` containing `full_name`, `position`, and `company`. These are saved to `user_metadata` on the Supabase auth user record.
- **Login** (`login`) - Calls `supabase.auth.signInWithPassword()`. The "Remember me" checkbox controls whether the session cookie gets `maxAge`/`expires` set (persistent) or remains session-only (cleared on browser close).
- **Logout** (`logout`) - Calls `supabase.auth.signOut()` and redirects to `/`.
- **Session reading** - Every server component or layout that needs the current user calls `createClient()` (from `lib/supabase/server.ts`) and then `supabase.auth.getUser()`. This validates the session cookie on every request.

### Supabase Clients

Three client configurations exist:

| Client | File | Key used | Purpose |
|---|---|---|---|
| Browser client | `lib/supabase/client.ts` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client components that need Supabase |
| Server client | `lib/supabase/server.ts` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Server components, server actions, layouts |
| Admin client | `lib/supabase/admin.ts` | `SUPABASE_SERVICE_ROLE_KEY` | Admin operations only - never imported in client components |

The admin client bypasses Row Level Security. It is used for: listing all auth users, updating/deleting auth users, reading all reviews, and inserting reviews server-side.

### Data stored

**Auth users (Supabase Auth - `auth.users`):**

Managed entirely by Supabase Auth. Each user record contains:
- `id` (uuid)
- `email`
- `user_metadata` - object containing `full_name`, `position`, `company` (set at signup), and `role` (set by admins: `"admin"` or `"user"`)
- `last_sign_in_at`
- `created_at`

**Reviews table (`public.reviews`):**

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key, auto-generated |
| `rating` | smallint | 1-5, enforced by check constraint |
| `feedback` | text | Review body, required |
| `user_name` | text | Reviewer's name, required |
| `company` | text | Reviewer's company, nullable |
| `user_id` | uuid | FK to `auth.users(id)`, nullable (supports anonymous reviews) |
| `created_at` | timestamptz | Defaults to `now()` |

### Row Level Security

RLS is enabled on the `reviews` table:
- **INSERT** - Allowed for `anon` and `authenticated` roles (anyone can submit a review).
- **SELECT** - No public policy. All reads go through the admin client (service_role), which bypasses RLS. This means only server-side code can read reviews - not the browser directly.

### Admin access enforcement

Admin status is always verified **server-side** in the relevant server action before any privileged operation:

1. `createClient()` → `supabase.auth.getUser()` to get the current session (validated against Supabase, not just a cookie value).
2. Check `user.email === SUPER_ADMIN` or `user.user_metadata?.role === "admin"`.
3. If neither → return an error or throw. The client receives only a success/error result, never bypasses this check.

This pattern is applied in: `updateUserRole`, `deleteUser`, `deleteReview`.

### Environment variables

The following environment variables are required (stored in `.env.local`, never committed to the repository):

| Variable | Used in |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Both browser and server clients |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Both browser and server clients |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin client only (server-side) |

`NEXT_PUBLIC_*` variables are safe to expose to the browser. `SUPABASE_SERVICE_ROLE_KEY` must remain server-side only and is never passed to client components or logged.
