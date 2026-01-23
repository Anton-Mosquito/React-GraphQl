FROM node:20-alpine

WORKDIR /usr/src/app

# 1. Копіюємо package.json та встановлюємо залежності (кешування)
COPY package*.json ./
RUN npm install

# 2. Копіюємо схему Prisma
COPY prisma ./prisma/
# 3. Генеруємо Prisma Client (КРИТИЧНО ВАЖЛИВО)
# Це створює клієнт у node_modules, інакше сервер впаде з помилкою
RUN npx prisma generate

# 4. Копіюємо решту коду
COPY . .

# 5. Порт і команда
EXPOSE 5001
# Для Docker: синхронізуємо схему з БД, потім запускаємо з hot reload
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npm run dev"]