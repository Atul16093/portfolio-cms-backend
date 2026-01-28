# 1. Base Image
FROM node:20

# 2. Set Working Directory
WORKDIR /app

# 3. Copy dependency files first
COPY package.json .

# 4. Install dependencies
RUN npm install


# 5. Copy rest of the app code
COPY . .

RUN npm run build



# 6. Expose port
EXPOSE 8080

# 7. Start command
CMD ["npm", "run", "start:dev"]

