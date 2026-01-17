Initial
1. # Create Strapi project
npx create-strapi-app@latest strapi/app --quickstart --no-run

2. # Then use the docker-compose.yml from Option 1
docker compose up -d

3. # Create website project (use Next.js)
npx create-next-app@latest hoock-web --ts --tailwind --eslint --app



Strapi
Admin: http://localhost:1337/admin

[OPTION]
; วีธีสร้าง Secrest
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
