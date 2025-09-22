Irys Mood Capsule

Irys Mood Capsule 是一个基于区块链的个人心情日记 DApp，让你在 IRYS 测试网上安全存储和管理自己的日记。

功能亮点

完全去中心化的日记存储

安全的区块链合约管理

前端可直接访问，支持 Nginx 或 Docker 部署

可自定义和更新合约地址与 ABI

🚀 快速开始
1. 克隆项目
git clone https://github.com/xiaoshayu11/irys-Mood-Capsule.git
cd irys-Mood-Capsule

2. 配置环境变量

在项目根目录创建 .env 文件：

nano .env


写入以下内容（请替换为你自己的私钥）：

PRIVATE_KEY=你的私钥
IRYS_RPC_URL=https://testnet-rpc.irys.xyz/v1/execution-rpc
CHAIN_ID=1270


💡 注意：钱包需要有 IRYS 测试币
领取地址：https://irys.xyz/faucet?utm_source=chatgpt.com

3. 安装依赖 & 编译合约
npm install
npx hardhat compile

4. 部署合约到 IRYS 测试网
npx hardhat run scripts/deploy.ts --network irysTestnet


成功后会输出合约地址，请记下以便更新前端。

5. 配置前端

进入前端目录并安装依赖：

cd frontend
npm install


更新合约地址：

nano src/ui/Diary.tsx


修改：

const CONTRACT_ADDRESS = "你的合约地址";


或者一键替换：

sed -i 's/const CONTRACT_ADDRESS = .*/const CONTRACT_ADDRESS = "你的新合约地址";/' src/ui/Diary.tsx


验证替换：

grep "CONTRACT_ADDRESS" src/ui/Diary.tsx


更新 ABI 文件：

cp ../artifacts/contracts/OnChainDiary.sol/OnChainDiary.json abi/OnChainDiary.json


构建前端：

npm run build

6. 部署前端
方案 A：Nginx

安装 Nginx：

apt update
apt install nginx
nginx -v


拷贝构建产物到站点目录：

mkdir -p /var/www/irys-diary
cp -r dist/* /var/www/irys-diary/
chown -R www-data:www-data /var/www/irys-diary
chmod -R 755 /var/www/irys-diary


创建 Nginx 配置：

nano /etc/nginx/sites-available/irys-diary


内容示例：

server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或服务器IP

    root /var/www/irys-diary;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 启用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}


启用配置并重启 Nginx：

ln -s /etc/nginx/sites-available/irys-diary /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx


现在可以通过域名或服务器 IP 访问前端页面。

方案 B：Docker

在项目根目录创建 Dockerfile：

FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


构建并启动镜像：

docker build -t irys-diary .
docker run -p 80:80 irys-diary

7. 可选：配置 HTTPS
apt install certbot python3-certbot-nginx
certbot --nginx -d your-domain.com

8. 配置防火墙
ufw allow 'Nginx Full'
ufw allow ssh
ufw enable

9. 验证部署
systemctl status nginx
curl http://your-domain.com
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

✅ 部署检查清单

 配置 .env 文件

 获取测试代币

 安装依赖

 编译合约

 部署合约

 更新前端合约地址

 更新 ABI 文件

 构建前端

 配置 Nginx 或 Docker

 设置防火墙

 配置 HTTPS

 测试网站访问
