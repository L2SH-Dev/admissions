# admissions-supabase

Necessary dependencies for the admissions Supabase project.

## Files

### docker-compose.yml

Source: `docker-compose.yml`  
Destination: `Configuration -> Service Stack -> Edit Compose File`

### Email templates

#### Confirmation

Source: `templates/confirmation.html`  
Container: `nginx`  
Destination: `/usr/share/nginx/html/confirmation.html`

### Edge Functions

#### Send rejection email

Source: `functions/sendRejectionEmail/index.ts`  
Container: `supabase-edge-functions`  
Destination: `/home/deno/functions/sendRejectionEmail/index.ts`

## Environment Variables

### Manual input

```bash
SMTP_API_KEY=<SMTP_API_KEY>
SMTP_API_URL=https://api.smtp.bz/v1/smtp/send
SERVICE_FQDN_SUPABASEKONG=https://sb.l2sh-admissions.ru
ADDITIONAL_REDIRECT_URLS=http://localhost:3000/**,https://l2sh-admissions.ru/**,https://admin.l2sh-admissions.ru/**
API_EXTERNAL_URL=http://supabase-kong:8000
DISABLE_SIGNUP=false
ENABLE_ANONYMOUS_USERS=false
ENABLE_EMAIL_AUTOCONFIRM=false
ENABLE_EMAIL_SIGNUP=true
ENABLE_PHONE_AUTOCONFIRM=true
ENABLE_PHONE_SIGNUP=true
FUNCTIONS_VERIFY_JWT=false
IMGPROXY_ENABLE_WEBP_DETECTION=true
JWT_EXPIRY=3600
MAILER_SUBJECTS_CONFIRMATION=Подтверждение адреса электронной почты
MAILER_SUBJECTS_EMAIL_CHANGE=
MAILER_SUBJECTS_INVITE=
MAILER_SUBJECTS_MAGIC_LINK=
MAILER_SUBJECTS_RECOVERY=
MAILER_TEMPLATES_CONFIRMATION=http://nginx:80/confirmation.html
MAILER_TEMPLATES_EMAIL_CHANGE=
MAILER_TEMPLATES_INVITE=
MAILER_TEMPLATES_MAGIC_LINK=
MAILER_TEMPLATES_RECOVERY=
MAILER_URLPATHS_CONFIRMATION=/auth/v1/verify
MAILER_URLPATHS_EMAIL_CHANGE=/auth/v1/verify
MAILER_URLPATHS_INVITE=/auth/v1/verify
MAILER_URLPATHS_RECOVERY=/auth/v1/verify
PGRST_DB_SCHEMAS=public,storage,graphql_public
POOLER_DEFAULT_POOL_SIZE=20
POOLER_MAX_CLIENT_CONN=100
POSTGRES_DB=postgres
POSTGRES_HOSTNAME=supabase-db
POSTGRES_PORT=5432
SECRET_PASSWORD_REALTIME=
SMTP_ADMIN_EMAIL=admin@l2sh-admissions.ru
SMTP_HOST=connect.smtp.bz
SMTP_PASS=<SMTP_PASSWORD>
SMTP_PORT=465
SMTP_SENDER_NAME=Лицей "Вторая школа"
SMTP_USER=<SMTP_USER>
STORAGE_S3_ACCESS_KEY_ID=<STORAGE_S3_ACCESS_KEY_ID>
STORAGE_S3_BUCKET=<STORAGE_S3_BUCKET>
STORAGE_S3_ENDPOINT=https://s3.timeweb.cloud
STORAGE_S3_REGION=ru-1
STORAGE_S3_SECRET_ACCESS_KEY=<STORAGE_S3_SECRET_ACCESS_KEY>
STUDIO_DEFAULT_ORGANIZATION=L2SH
STUDIO_DEFAULT_PROJECT=Admissions
```

### Generated by Coolify

These variables should be generated by Coolify.  
The only action required is to make sure they were generated correctly.

```bash
SERVICE_PASSWORD_ADMIN=
SERVICE_PASSWORD_JWT=
SERVICE_PASSWORD_LOGFLARE=
SERVICE_PASSWORD_POSTGRES=
SERVICE_PASSWORD_SUPAVISORSECRET=
SERVICE_PASSWORD_VAULTENC=
SERVICE_SUPABASEANON_KEY=
SERVICE_SUPABASESERVICE_KEY=
SERVICE_USER_ADMIN=
```
