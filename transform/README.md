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
