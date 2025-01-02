# build stage
FROM node:lts-alpine AS build-stage
WORKDIR /app
COPY package*.json /app/
RUN yarn install
COPY . /app/
RUN yarn build

# production stage
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]