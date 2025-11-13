# DeviroxN Enterprise App (Next.js App Router)

This repository is a scaffold for an enterprise Next.js application using App Router, TypeScript, NextAuth (Google/GitHub/Credentials), Prisma (NeonDB/Postgres), RBAC middleware, Tailwind & shadcn/ui.

Quick setup

1. Install dependencies

```bash
pnpm install
```

2. Copy `.env.example` to `.env`. The sample file contains working OAuth provider IDs/secrets, SMTP settings, and the default admin credentials the local datastore uses. Adjust anything sensitive before deploying publicly.

3. (Optional) If you have access to a Postgres instance, run Prisma generate/push so the real Prisma Client is available and the schema exists:

```bash
pnpm prisma:generate
pnpm prisma:push
```

When Prisma Client binaries are unavailable (e.g., offline codespaces) the app transparently falls back to an on-disk JSON datastore stored in `.data/prisma-store.json`. That stub respects all `prisma.*` calls used in the app, including the NextAuth Prisma adapter, so GitHub/Google login works without a dedicated database.

4. Start dev server

```bash
pnpm dev
```

### Default admin credentials

The Prisma stub seeds a `SUPER_ADMIN` user using the values inside `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME`). Copying `.env.example` gives you:

- Email: `admin@localhost`
- Password: `Passw0rd!`

Sign in with the credentials provider using those values to access the admin dashboard immediately. Update the environment variables if you need different bootstrap credentials; the stub (and the real seeding script) will honor them.

Tailwind + shadcn notes

- Tailwind is configured in `tailwind.config.js` and `app/globals.css`.
- To init shadcn/ui (optional), run:

```bash
npx shadcn ui@latest init
```

Project layout highlights

- `app/(public)` - public pages
- `app/(auth)` - login/register
- `app/dashboard` - admin/staff/customer dashboards
- `app/api/...` - example API routes (also prefer server actions inside App Router pages where appropriate)
- `lib/prisma.ts` - Prisma client singleton
- `lib/auth.ts` - NextAuth config and callbacks
- `lib/roles.ts` - Role enums and role sets
- `middleware.ts` - Protect `/dashboard/*` and `/admin/*` and inject `x-user-role` header from session
- `prisma/schema.prisma` - example schema for Finance, Marketplace, Real Estate domains

Next steps / Recommendations

- Install `@next-auth/prisma-adapter` and provider packages after `pnpm install`.
- Create a strong `NEXTAUTH_SECRET`.
- Configure NeonDB connection string in `DATABASE_URL`.
- Add more server actions and move mutable endpoints into server actions when possible.
# DeviroxN-Business-website