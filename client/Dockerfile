# Node.js'in hafif bir versiyonu
FROM node:22-alpine

# Çalışma dizini
WORKDIR /app

# Kütüphaneleri kuruyoruz
COPY package*.json ./
RUN npm install

# Kodları kopyalıyoruz
COPY . .

# Vite'ın çalışacağı port
EXPOSE 5173

# Vite'ı dışarıya (host) açarak başlatıyoruz
CMD ["npm", "run", "dev", "--", "--host"]