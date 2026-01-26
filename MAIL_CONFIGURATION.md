# Mail Service Configuration

The application supports two methods for sending emails:

## Option 1: Gmail with OAuth2 (Recommended)

Set the following environment variables:
```bash
MAIL_USER=your-email@gmail.com
OAUTH_CLIENT_ID=your-client-id
OAUTH_CLIENT_SECRET=your-client-secret
OAUTH_REFRESH_TOKEN=your-refresh-token
```

### How to get Gmail OAuth2 credentials:
1. Go to Google Cloud Console
2. Create OAuth2 credentials
3. Enable Gmail API
4. Generate refresh token using OAuth2 Playground

## Option 2: Generic SMTP

Set the following environment variables:
```bash
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password
```

## Optional Settings
```bash
MAIL_FROM=no-reply@example.com  # Default sender address
MAIL_ACTIVATION_SUBJECT=Activate your account  # Email subject
```

## Testing

The mail service will attempt Gmail OAuth2 first, then fall back to SMTP if not configured.

If neither is configured, registration will still work but activation emails won't be sent (errors are logged but not thrown).
