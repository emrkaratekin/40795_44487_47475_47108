# Node.js'in hafif bir versiyonunu kullanıyoruz
FROM node:22-alpine

# Konteyner içindeki çalışma dizinimiz
WORKDIR /app

# Sadece package.json dosyalarını kopyalayıp kütüphaneleri kuruyoruz
COPY package*.json ./
RUN npm install

# Geri kalan tüm kodları kopyalıyoruz
COPY . .

# Backend'in çalışacağı port
EXPOSE 5000

# Projeyi başlatma komutu
CMD ["npm", "run", "dev"]