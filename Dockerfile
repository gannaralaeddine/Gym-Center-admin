# Stage 1
FROM node:18.15.0 as node

WORKDIR /src/app

# Install Angular CLI globally
RUN npm install -g @angular/cli@17.0.7

COPY package*.json ./

RUN npm install

# Copy the Angular app code into the container
COPY . .

RUN npm run build --prod

CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]


