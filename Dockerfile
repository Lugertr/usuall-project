FROM node:22.7.0-alpine AS build

WORKDIR /app
COPY . .

RUN npm ci && \
    npm list --depth=0 && \
    npm run build:production

FROM nginx:1.17.1-alpine

WORKDIR /etc/nginx/html
RUN rm -rf * *.* && rm -f /etc/nginx.conf && rm -rf /etc/nginx/conf.d
COPY nginx.conf /etc/nginx/nginx.conf
COPY public/favicon.ico .
COPY --from=build /app/dist/adm .

COPY ssl/certificate.crt /etc/nginx/ssl/certificate.crt
COPY ssl/private.key /etc/nginx/ssl/private.key

EXPOSE 80
