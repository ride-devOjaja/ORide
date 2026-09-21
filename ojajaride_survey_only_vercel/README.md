# OJAJA Ride Driver Survey — Vercel + Namecheap SMTP

This version sends completed survey responses directly through your Namecheap Private Email mailbox. It does not use Resend.

## Files

- `index.html` — complete survey
- `api/submit.js` — Vercel server function that sends the survey by SMTP
- `assets/` — OJAJA branding
- `package.json` — installs Nodemailer
- `vercel.json` — Vercel settings

## Vercel environment variables

In **Vercel → Project → Settings → Environments → Production → Environment Variables**, add:

```text
SMTP_HOST=mail.privateemail.com
SMTP_PORT=465
SMTP_USER=info@ojajaride.com
SMTP_PASSWORD=YOUR_PRIVATE_EMAIL_MAILBOX_PASSWORD
SURVEY_TO_EMAIL=info@ojajaride.com
SMTP_FROM=OJAJA Ride Survey <info@ojajaride.com>
```

Recommended types:

- `SMTP_PASSWORD` → Secret
- `SMTP_USER` → Config
- `SMTP_HOST` → Config
- `SMTP_PORT` → Config
- `SURVEY_TO_EMAIL` → Config
- `SMTP_FROM` → Config

`SMTP_HOST` and `SMTP_PORT` are optional because the code already defaults to `mail.privateemail.com` and port `465`, but adding them makes the configuration explicit.

## Important about nonreply@ojajaride.com

If `nonreply@ojajaride.com` is a real Namecheap mailbox (or an authorized sending identity), you can use it instead:

```text
SMTP_USER=nonreply@ojajaride.com
SMTP_PASSWORD=PASSWORD_FOR_THAT_MAILBOX
SMTP_FROM=OJAJA Ride Survey <nonreply@ojajaride.com>
SURVEY_TO_EMAIL=info@ojajaride.com
```

If `nonreply@ojajaride.com` does not exist as a mailbox, use `info@ojajaride.com` for `SMTP_USER` and `SMTP_FROM`.

## Remove old Resend variables

The new code does not use these variables, so you can delete them from Vercel after the new version is deployed:

```text
RESEND_API_KEY
RESEND_FROM
```

`SURVEY_TO_EMAIL` is still used, so keep that one.

## Deploy

1. Replace the files in your GitHub/Vercel project with the contents of this package.
2. Commit and push to GitHub, or redeploy from Vercel.
3. Add the SMTP environment variables above.
4. Redeploy after changing environment variables.
5. Submit one test survey.
6. Check `info@ojajaride.com` for the message titled **New OJAJA Ride Driver Survey Response**.

## Security

Never put your mailbox password inside `index.html`, JavaScript sent to the browser, or GitHub. Keep it only in Vercel as a Secret environment variable.
