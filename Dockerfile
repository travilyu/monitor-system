# 构建阶段 - UI
FROM node:18 AS ui-builder
WORKDIR /app
COPY ui/package*.json ./ui/
RUN cd ui && npm install
COPY ui ./ui
RUN cd ui && npm run build

# 构建阶段 - Server
FROM node:18 AS server-builder
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server ./server
RUN cd server && npm run build

# 最终运行阶段
FROM node:18-slim
WORKDIR /app

# 复制 package.json 和 server.js
COPY package.json .
COPY server.js .

# 安装生产环境依赖
RUN npm install --production

# 从构建阶段复制构建产物
COPY --from=ui-builder /app/ui/dist ./ui/dist
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/package.json ./server/package.json
COPY --from=server-builder /app/server/config ./server/config

# 安装 server 的生产环境依赖
RUN cd server && npm install --production

# 设置环境变量
ENV PORT=8080
ENV NODE_ENV=production

# 暴露端口
EXPOSE 8080
EXPOSE 3000

# 启动应用
CMD ["sh", "-c", "cd server && node dist/index.js & node ../server.js"]