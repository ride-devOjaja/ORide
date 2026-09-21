# OJAJA Ride Tally Wrapper

This is a static Vercel site that wraps the Tally form `https://tally.so/r/Xxjddg` in OJAJA Ride branding.

## Deploy

1. Replace the contents of the current Vercel/GitHub project with the contents of this folder.
2. Make sure `index.html`, `vercel.json`, and `assets/` are at the project root.
3. Deploy or redeploy in Vercel.
4. No API route, SMTP settings, Resend key, or environment variables are needed.

## Tally

The form is embedded from:

`https://tally.so/embed/Xxjddg?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`

Edits made to the form in Tally automatically appear on this page. If you later change the Tally form ID, update the URL in `index.html`.
