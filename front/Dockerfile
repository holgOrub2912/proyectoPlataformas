# syntax=docker/dockerfile:1-labs
FROM node:22-alpine AS builder
WORKDIR /app
ENV VITE_API_URL="/api"
ENV VITE_TIMEZONE="-5"
ARG VITE_SUPPORT_PAGE
COPY --exclude=.env* . .
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
