FROM node:14-alpine
RUN npm install -g  @prisma/cli@2.7.1

WORKDIR /proj

# Copy package.json
COPY ./packages/prisma/prisma/postgres-migrator.prisma /proj/prisma/postgres-migrator.prisma
COPY ./packages/prisma/prisma/migrations /proj/prisma/migrations
