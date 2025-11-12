# DeviroxN Enterprise App (Next.js App Router)

This repository is a scaffold for an enterprise Next.js application using App Router, TypeScript, NextAuth (Google/GitHub/Credentials), Prisma (NeonDB/Postgres), RBAC middleware, Tailwind & shadcn/ui.

Quick setup

1. Install dependencies

```bash
pnpm install
```

2. Copy `.env.example` to `.env` and fill in your credentials (DATABASE_URL, provider secrets, NEXTAUTH_SECRET)

3. Prisma generate + push

```bash
pnpm prisma:generate
pnpm prisma:push
```

4. Start dev server

```bash
pnpm dev
```

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