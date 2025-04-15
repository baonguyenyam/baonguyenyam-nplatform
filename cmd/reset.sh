rm -rf ./prisma/migrations
rm -rf ./public/uploads/*
mkdir -p ./public/uploads

yarn reset
yarn generate
yarn migrate
yarn seed