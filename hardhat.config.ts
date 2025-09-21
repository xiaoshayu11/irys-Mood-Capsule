import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const IRYS_RPC = "https://testnet-rpc.irys.xyz/v1/execution-rpc";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    irysTestnet: {
      url: IRYS_RPC,
      chainId: 1270,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    // No verification plugin configured for IRYS; placeholder
    apiKey: "",
  },
};

export default config;



