FROM node:22.7.0-alpine AS build

WORKDIR /app
COPY . .

RUN npm ci && \
    npm list --depth=0 && \
    npm run build:production

FROM nginx:1.17.1-alpine

WORKDIR /usr/share/nginx/html
RUN rm -rf * && rm -f /etc/nginx/nginx.conf && rm -rf /etc/nginx/conf.d/*

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist/adm .

COPY public/favicon.ico .

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
