# build stage
FROM node:lts-alpine AS build-stage
WORKDIR /app
COPY package*.json /app/

# Define build arguments for environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_FRONTEND_URL

# Set environment variables during the build process
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_FRONTEND_URL=$VITE_FRONTEND_URL

RUN yarn install
COPY . /app/
RUN yarn build

# production stage
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf/prod.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]