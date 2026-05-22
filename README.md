# Hoock Agency 2026

เว็บไซต์และ CMS สำหรับ [hoockagency.com](https://hoockagency.com)

## โครงสร้างโปรเจค

```
hoockagency2026/
├── hoock-web/        # Next.js 15 — deploy บน Cloudflare Workers
├── strapi/           # Strapi CMS — รันผ่าน Docker
├── strapi-src/       # Strapi source types & API schemas
└── docker-compose.yml
```

## hoock-web (Frontend)

Next.js 15 + Tailwind CSS v4 + TypeScript deploy บน Cloudflare Workers ผ่าน `@opennextjs/cloudflare`

### Environment Variables

สร้างไฟล์ `hoock-web/.env` จาก `.env.example`:

```env
URI_STRAPI=https://strong-art-a39006d263.strapiapp.com
NEXT_PUBLIC_URI_STRAPI=https://strong-art-a39006d263.strapiapp.com
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
ADMIN_PURGE_SECRET=your_purge_secret
```

### คำสั่ง

```bash
cd hoock-web

npm install
npm run dev          # development
npm run build        # next build ปกติ
npm run build:cf     # build สำหรับ Cloudflare
npm run deploy       # build:cf + wrangler deploy
```

### Deploy to Cloudflare

ตั้ง Secrets บน Cloudflare ครั้งแรก:

```bash
npx wrangler secret put RECAPTCHA_SECRET_KEY
npx wrangler secret put ADMIN_PURGE_SECRET
```

### CI/CD

GitHub Actions จะ auto deploy ไปยัง [hoockagency.com](https://hoockagency.com) ทุกครั้งที่ push ขึ้น `main` และมีการเปลี่ยนแปลงใน `hoock-web/`

Secrets ที่ต้องตั้งใน GitHub repo:

| Secret | ค่า |
|--------|-----|
| `CLOUDFLARE_API_TOKEN` | API Token จาก Cloudflare Dashboard |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID |

---

## Strapi (CMS)

Strapi CMS รันบน Docker ใช้ PostgreSQL เป็น database
Production CMS อยู่ที่: `https://strong-art-a39006d263.strapiapp.com`

### รันแบบ Local

```bash
docker compose up -d
```

Admin panel: `http://localhost:1337/admin`

### Environment Variables

สร้างไฟล์ `strapi/app/.env` จาก `.env.example`

### Transfer ข้อมูลไป Strapi Cloud

```bash
docker compose exec hoock_strapi npx strapi transfer \
  --to https://strong-art-a39006d263.strapiapp.com \
  --to-token <transfer_token>
```

### สร้าง Secret

```bash
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```
