# build stage
FROM node:lts-alpine AS build-stage
WORKDIR /app
COPY package*.json /app/

# Define build arguments for environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_FRONTEND_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_FRONTEND_URL=$VITE_FRONTEND_URL

RUN yarn install
COPY . /app/
RUN yarn build