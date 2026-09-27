# Equipment-aware workout rules

Transform should personalise prescribed workouts with deterministic rules rather than requiring generative AI.

## Member equipment profile
Members can add or remove equipment at any time. Initial catalogue:
- exercise mat
- free weights / dumbbells
- kettlebell
- barbell / bench press
- weights machine
- resistance bands
- skipping rope
- boxing bag
- treadmill
- rowing machine
- exercise bike
- cross-trainer / elliptical
- step / bench
- swimming pool access

Bodyweight/no-equipment movements remain available without selecting equipment.

## Workout templates
A workout should ultimately describe movement slots by purpose (for example cardio, push, legs, core/stability) rather than prescribing one immutable exercise.

The rules engine selects an approved exercise for that slot from the member's currently available equipment. Each slot must retain a no-equipment fallback where practical.

Members may temporarily swap an exercise if equipment is unavailable that day without changing their saved equipment profile.

## Swimming
Swimming is a first-class Move activity. Initial tracking can record duration, distance or laps, and perceived intensity. Phone GPS is not assumed to work in a pool. Wearable integration can be added later.
