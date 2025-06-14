# 1. Сборка приложения
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2. Сервер для статики (Nginx)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html   
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
