# ใช้ Node.js official image
FROM node:20-alpine

# สร้าง working directory
WORKDIR /app

# คัดลอก package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอก source code ทั้งหมด
COPY . .

# Expose port
ARG PORT=3000          # default 3000
ENV PORT=${PORT}

# Expose port
EXPOSE ${PORT}

# รันแอป
CMD ["node", "index.js"]