# Lifts: parked ideas

Ideas that are noted but not built yet.

## Heart-rate band or watch: detect set start and end (parked Nov 2026)

Goal: the app notices when a set starts and ends from heart rate (BPM) and ticks the set by itself.

What is known so far:
- Chrome on Android can read a heart-rate sensor directly with Web Bluetooth, using the standard Bluetooth Heart Rate Service. No native app needed.
- Chest straps (for example Polar H10, Garmin HRM) speak this standard. Many watches do not; some can turn on a "broadcast heart rate" mode (Garmin, Polar, Coros, some Amazfit).
- Heart rate reacts 10 to 30 seconds after effort starts and stays high after a set, so BPM alone gives a late and fuzzy signal. Short sets (1 to 5 reps) may not show a clear rise at all.
- Movement data (accelerometer) marks start and end much more sharply, but Web Bluetooth does not give it from most watches. The phone's own motion sensor only works if the phone is on the body.
- Web Bluetooth needs the app page to stay open; Android may cut the connection when the screen is off.

Possible first step, if picked up:
1. Connect a strap in Settings and show live BPM in the workout bar.
2. Log BPM per set (max and average) into History.
3. Only then try "suggest set done" (not automatic) when BPM rises and falls back, and measure how often it is right before making it automatic.
