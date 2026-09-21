# OJAJA Ride Driver Survey — Vercel minimal version

This version opens the survey directly at the site root. There is no separate landing page or thank-you page.

## Files needed
- `index.html` — complete 8-section survey
- `api/submit.js` — Vercel serverless endpoint that emails submissions
- `assets/` — OJAJA Ride images
- `vercel.json` — clean URL/security headers

## Deploy
Put these files at the root of your GitHub repository and import the repository into Vercel.

Your URL will open the survey directly:
`https://your-project.vercel.app/`

No `/survey` path is required.

## Email setup
The HTML can be hosted by itself, but automatic email delivery requires the `/api/submit.js` serverless function and an email provider.

In Vercel > Project > Settings > Environment Variables add:

- `RESEND_API_KEY` = your Resend API key
- `RESEND_FROM` = `OJAJA Ride Survey <survey@ojajaride.com>`
- `SURVEY_TO_EMAIL` = `info@ojajaride.com`

Verify `ojajaride.com` in Resend before using that sender address.

After adding or changing environment variables, redeploy the project.
