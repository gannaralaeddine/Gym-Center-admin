# Stage 1
#FROM node:18.15.0 as node
#
#WORKDIR /src/app
#
## Install Angular CLI globally
#RUN npm install -g @angular/cli
#
#COPY package*.json ./
#
#RUN npm install
#
## Copy the Angular app code into the container
#COPY . .
#
#RUN npm run build --prod
#
#CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
#
## Stage 2
#FROM nginx:alpine
#
#COPY --from=node /src/app/dist/gym-center-admin /usr/share/nginx/html
#
## Expose port 4200
#EXPOSE 4200
#CMD ["nginx", "-g", "daemon off;"]

# Stage 1
FROM node:18.15.0

WORKDIR /app

COPY ./package.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start"]

