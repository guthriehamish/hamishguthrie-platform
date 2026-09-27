# Transform With Me

**Consistent. Persistent. Targeted.**

Transform With Me is a personal transformation and accountability platform built around sustainable activity, healthier everyday choices, progress tracking, and community participation.

## Core Areas

- **Today** — daily overview and check-in
- **Move** — workouts, activities, active minutes and movement tracking
- **Fuel** — simple healthy-choice check-ins
- **Progress** — goals, streaks, achievements and personal progress
- **Together** — community, accountability and workout mates
- **My Direction** — personal goals and transformation focus

## Principles

Transform With Me is not a traditional coaching programme.

It provides structure, encouragement, accountability and visibility of progress while allowing each participant to make their own choices about their transformation.

The platform should encourage consistency rather than perfection.

## Platform

Transform With Me is part of the wider HamishGuthrie.com platform.

**Production:** `transform.hamishguthrie.com`

Shared infrastructure may include authentication, profiles, notifications and other services developed across the HamishGuthrie.com ecosystem.

## Onboarding Video Architecture

Transform With Me uses two distinct founder-video touchpoints. These are intentionally separate because they serve different jobs.

### 1. Public welcome / mission video

**Placement:** Welcome / landing experience before a member joins or signs in.

**Purpose:** Hamish personally introduces the mission and vision of Transform With Me and sets expectations before someone joins.

The video should explain:
- what Transform With Me is;
- the mission behind participating together;
- the emphasis on being **Consistent. Persistent. Targeted.**;
- that members choose how they participate and pursue their own transformation;
- what Transform With Me is **not** — it is not a personal coaching service, magic solution, or promise of a particular result.

**Build requirement:** Keep a replaceable video slot/component in the public welcome experience so the final hosted video can be added without redesigning the page.

### 2. New-member welcome / getting-started video

**Placement:** Linked or embedded prominently in the welcome email sent after joining. The same video may also be surfaced inside the member onboarding experience so it remains easy to find after the email.

**Purpose:** Thank the member for joining the mission and show them how to get useful value from the platform.

The video should explain:
- that Transform is a recurring/cyclical **28-day challenge** rather than a one-time programme;
- members can interact with each cycle in the way that suits them;
- how the core areas of the app work;
- how to get the most from activity, accountability, progress and community features;
- how to install Transform on a phone as an app/PWA;
- where to begin after joining.

**Build requirement:** Reserve a replaceable hosted-video URL/asset reference for the welcome-email template and onboarding experience. Do not hard-code a specific video provider into the product architecture.

The public mission video answers **“What am I joining?”** The member welcome video answers **“I’ve joined — how do I use this well?”**


## Build status — production hardening (28 September 2026)

Transform With Me is in final production-hardening rather than major feature construction.

Operational core:
- Supabase authentication with production email confirmation.
- 28-workout recurring movement engine with equipment substitutions, exercise guidance and automatic/manual interval progression.
- Manual movement, swimming and GPS walk/run/ride/hike tracking with private saved routes.
- Fuel, hydration, optional weigh-ins/BMI screening calculation, My Direction and multi-metric progress.
- Workout-mate requests/acceptance using the privacy-limited member directory.
- Private progress-photo storage with mobile camera capture and gallery upload.
- Before/after transformation composer with member-selected statistics and branded PNG native sharing where supported.
- PWA/install foundation, responsive mobile navigation and production Transform visual identity.
- Device-first persistence with Supabase cloud hydration; offline/reconnect messaging and session cleanup.

Before designating BUILT, complete a real-device end-to-end acceptance pass:
1. New visitor understands The Vision and creates an account.
2. Confirmation email returns to production and session opens.
3. Set Up saves direction/equipment/preferences and survives sign-out/sign-in.
4. Complete one workout and one manually logged activity; verify progress after reload.
5. Complete a moving GPS activity; verify route persists in My Journey.
6. Add a Starting Photo and Progress Photo from a phone; verify private reload and deletion.
7. Build and share a transformation image from those two photos.
8. Send/accept a workout-mate request using two test accounts.
9. Install the PWA on a phone and verify the refreshed branding/cache.
10. Confirm sign-out leaves no previous member photos/mates/journey visible to the next session.

Known launch-content items rather than architecture blockers: record the public Vision and member Getting Started videos; continue refining the final 28-workout content/exercise-guide copy.
