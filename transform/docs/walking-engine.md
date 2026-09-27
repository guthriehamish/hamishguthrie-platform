# Transform Walking Engine

Walking is a first-class Move activity, not merely a manually entered activity.

## Tracking
- GPS route recorded only after the member explicitly starts a walk.
- Live elapsed time, distance, current/average pace, active minutes and elevation.
- Route data is private by default.
- Finishing the walk creates a Move activity and contributes to Progress.
- A future map renderer may use Google Maps or another provider; GPS capture is deliberately provider-independent.

## Guided walking
Walking workouts can contain warm-up, steady, brisk, jog/run, burst, hill and cooldown phases.

Optional instruction modes:
1. Timed — e.g. jog for 45 seconds.
2. Landmark — e.g. increase pace to the next suitable light pole.
3. Adaptive — the engine chooses an appropriate time/place to begin a programmed effort.

## Environment-aware safety
Mapping/context data may be used to delay an effort when an intersection or other unsuitable section is ahead.

The app must never tell a member that a road is clear or that it is safe to cross. Map/GPS data is advisory and can be incomplete or inaccurate. The member remains responsible for observing their surroundings and deciding when it is safe to proceed.

Example:
- Programme requests a burst.
- Route context indicates an intersection ahead.
- App displays/speaks: "Burst coming up. Intersection ahead — we'll start after you've crossed."
- Once the member has continued beyond the intersection, the programme can offer the next effort prompt.

## Future derived metrics
- kilometre splits
- fastest section
- pace/intensity zones
- detected bursts
- elevation gain/loss
- hill efforts
- route map and summary
- shared workout-mate session with individual statistics
