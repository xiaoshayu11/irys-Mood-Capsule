# 链上日记 dApp (IRYS Testnet) - 测试版本

## 🎉 部署成功！

**合约地址**: `0x1c58cef741E8d73baa15D1A7f07832C44696220f`  
**网络**: IRYS Testnet (Chain ID: 1270)  
**部署账户**: `0x628D13e3d3c2e13c76da87C08146b1F4A91EF261`

## 📋 测试步骤

### 1. 前端测试
```bash
cd frontend
npm install
npm run dev
```
访问: http://localhost:5173

### 2. 钱包连接
- **只支持 OKX 钱包**
- 确保 OKX 钱包已安装并切换到 IRYS Testnet
- 网络配置:
  - RPC: https://testnet-rpc.irys.xyz/v1/execution-rpc
  - Chain ID: 1270
  - 货币符号: IRYS

### 3. 功能测试
1. **连接钱包**: 点击连接按钮，选择 OKX 钱包
2. **写日记**: 
   - 在"写日记"页面输入内容（最多280字符）
   - 每天只能写一次
   - 点击"提交"按钮
3. **查看日记**: 
   - 在"我的日记"页面查看历史记录
   - 可以调整显示天数（1-60天）

## 🔧 技术栈

### 智能合约
- **语言**: Solidity 0.8.20
- **框架**: Hardhat
- **功能**: 
  - `writeDiary(string content)` - 写日记
  - `getDiary(address user, uint256 date)` - 获取日记
  - 每天限制一次，280字符限制

### 前端
- **框架**: React + Vite
- **Web3**: wagmi + viem
- **钱包**: 仅支持 OKX Wallet
- **网络**: IRYS Testnet

## 📁 项目结构
```
├── contracts/OnChainDiary.sol    # 智能合约
├── scripts/deploy.ts             # 部署脚本
├── test/OnChainDiary.ts          # 测试文件
├── frontend/                     # React 前端
│   ├── src/ui/App.tsx           # 主应用
│   ├── src/ui/Diary.tsx         # 日记组件
│   └── abi/OnChainDiary.json    # 合约ABI
└── docker-compose.yml            # Docker 部署
```

## 🐳 Docker 部署
```bash
# 设置环境变量
echo VITE_DIARY_ADDRESS=0x1c58cef741E8d73baa15D1A7f07832C44696220f > .env

# 启动
docker-compose up --build
```

## ✅ 测试结果
- ✅ 合约编译成功
- ✅ 合约测试通过
- ✅ 合约部署到 IRYS Testnet
- ✅ 前端配置 OKX 钱包
- ✅ 前端启动成功

## 🔗 相关链接
- [IRYS Testnet Explorer](https://explorer.irys.xyz)
- [合约地址](https://explorer.irys.xyz/address/0x1c58cef741E8d73baa15D1A7f07832C44696220f)
- [OKX 钱包](https://www.okx.com/web3)

## 📝 注意事项
- 确保钱包中有足够的 IRYS 测试币用于交易
- 每天只能写一条日记
- 日记内容限制在280字符以内
- 所有数据永久存储在区块链上



