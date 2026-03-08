Initial

1. # Create Strapi project

   npx create-strapi-app@latest strapi/app --quickstart --no-run

2. # Then use the docker-compose.yml from Option 1

   docker compose up -d
   docker compose -p hoock-dev up

3. # Create website project (use Next.js)
   npx create-next-app@latest hoock-web --ts --tailwind --eslint --app

Strapi
Admin: http://localhost:1337/admin

[OPTION]
; วีธีสร้าง Secrest
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"

docker compose exec hoock_strapi npx strapi transfer \
 --to https://strong-art-a39006d263.strapiapp.com \
 --to-token 8d9b3266af6bd549650d4c372c241a01cae8d0f6d2d5134f0e2f0657e7e9c05d
