# Irys Mood Capsule

一个基于区块链的个人心情日记 DApp，在 IRYS 测试网上安全存储和管理你的心情记录。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.4.2-purple.svg)

## ✨ 功能亮点

- 🔐 **去中心化存储** - 基于 IRYS 测试网的区块链存储
- 🎨 **美观界面** - 现代化 UI 设计，支持心情图标和自定义图片
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🔄 **实时更新** - 支持实时查看和编辑心情记录
- 🛡️ **安全可靠** - 智能合约管理，数据不可篡改
- 🚀 **易于部署** - 支持 Nginx 和 Docker 部署

## 🏗️ 技术栈

### 后端
- **Solidity** - 智能合约开发
- **Hardhat** - 开发框架
- **IRYS 测试网** - 区块链网络

### 前端
- **React 18** - 用户界面
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Wagmi** - Web3 集成
- **Viem** - 以太坊库

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- Git

### 1. 克隆项目

```bash
git clone https://github.com/xiaoshayu11/irys-Mood-Capsule.git
cd irys-Mood-Capsule
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

在项目根目录创建 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的配置：

```env
# 你的私钥（请确保钱包有足够的 IRYS 测试币）
PRIVATE_KEY=your_private_key_here

# IRYS 测试网 RPC 地址
IRYS_RPC_URL=https://testnet-rpc.irys.xyz/v1/execution-rpc

# 链 ID
CHAIN_ID=1270
```

> 💡 **获取测试币**：访问 [IRYS Faucet](https://irys.xyz/faucet) 获取测试代币

### 4. 编译和部署合约

```bash
# 编译合约
npx hardhat compile

# 部署到 IRYS 测试网
npx hardhat run scripts/deploy.ts --network irysTestnet
```

部署成功后，记下输出的合约地址。

### 5. 配置前端

#### 更新合约地址

编辑 `frontend/src/ui/Diary.tsx`：

```typescript
const CONTRACT_ADDRESS = "你的合约地址";
```

或使用命令行快速替换：

```bash
# 替换合约地址
sed -i 's/const CONTRACT_ADDRESS = .*/const CONTRACT_ADDRESS = "你的新合约地址";/' frontend/src/ui/Diary.tsx

# 验证替换结果
grep "CONTRACT_ADDRESS" frontend/src/ui/Diary.tsx
```

#### 更新 ABI 文件

```bash
cp artifacts/contracts/OnChainDiary.sol/OnChainDiary.json frontend/abi/OnChainDiary.json
```

### 6. 启动开发服务器

```bash
cd frontend
npm run dev
```

访问 `http://localhost:5173` 查看应用。

## 🚀 生产部署

### 方案 A：Nginx 部署

#### 1. 构建前端

```bash
cd frontend
npm run build
```

#### 2. 安装 Nginx

```bash
# Ubuntu/Debian
apt update
apt install nginx

# CentOS/RHEL
yum install nginx
```

#### 3. 配置站点

```bash
# 创建站点目录
mkdir -p /var/www/irys-diary
cp -r frontend/dist/* /var/www/irys-diary/
chown -R www-data:www-data /var/www/irys-diary
chmod -R 755 /var/www/irys-diary
```

#### 4. 创建 Nginx 配置

```bash
nano /etc/nginx/sites-available/irys-diary
```

配置内容：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或服务器IP

    root /var/www/irys-diary;
    index index.html;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 启用 gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
}
```

#### 5. 启用配置

```bash
ln -s /etc/nginx/sites-available/irys-diary /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 方案 B：Docker 部署

#### 1. 创建 Dockerfile

在项目根目录创建 `Dockerfile`：

```dockerfile
# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. 创建 nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 3. 构建和运行

```bash
# 构建镜像
docker build -t irys-mood-capsule .

# 运行容器
docker run -d -p 80:80 --name irys-diary irys-mood-capsule
```

### 方案 C：Docker Compose

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  irys-diary:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

运行：

```bash
docker-compose up -d
```

## 🔒 安全配置

### 1. 配置 HTTPS

```bash
# 安装 Certbot
apt install certbot python3-certbot-nginx

# 获取 SSL 证书
certbot --nginx -d your-domain.com

# 自动续期
crontab -e
# 添加：0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. 配置防火墙

```bash
# Ubuntu/Debian
ufw allow 'Nginx Full'
ufw allow ssh
ufw enable

# CentOS/RHEL
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

## 🧪 测试

### 运行测试

```bash
# 运行合约测试
npx hardhat test

# 运行前端测试
cd frontend
npm test
```

### 验证部署

```bash
# 检查 Nginx 状态
systemctl status nginx

# 测试网站访问
curl http://your-domain.com

# 查看日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 📁 项目结构

```
irys-Mood-Capsule/
├── contracts/              # 智能合约
│   └── OnChainDiary.sol
├── frontend/               # 前端应用
│   ├── public/            # 静态资源
│   │   ├── images/        # 心情图标
│   │   └── mascots/       # 吉祥物图片
│   ├── src/               # 源代码
│   │   ├── components/    # React 组件
│   │   ├── ui/           # 页面组件
│   │   └── main.tsx      # 入口文件
│   └── package.json
├── scripts/               # 部署脚本
│   └── deploy.ts
├── test/                  # 测试文件
├── hardhat.config.ts      # Hardhat 配置
└── README.md
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [IRYS 官网](https://irys.xyz/)
- [IRYS 文档](https://docs.irys.xyz/)
- [Hardhat 文档](https://hardhat.org/docs)
- [React 文档](https://react.dev/)

## 📞 支持

如果你遇到任何问题，请：

1. 查看 [Issues](https://github.com/xiaoshayu11/irys-Mood-Capsule/issues)
2. 创建新的 Issue
3. 联系维护者

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
