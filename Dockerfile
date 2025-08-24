# Tahap 1: Build aolikasi React
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Tahap 2: Sajikan hasil build dengan Nginx
FROM nginx:stable-alpine
# Salin hasil build dari tahap sebelumnya ke direktori web Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Salin konfigurasi Nginx kustom
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]