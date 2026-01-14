require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Arc Testnet
    arcTestnet: {
      url: "https://rpc.testnet.arc.network",
      chainId: 5042002, // 0x4cef52
      accounts: process.env.DEPLOYER_PRIVATE_KEY 
        ? [process.env.DEPLOYER_PRIVATE_KEY] 
        : [],
      gasPrice: "auto"
    },
    // Arc Mainnet (placeholder - update when available)
    arcMainnet: {
      url: process.env.ARC_MAINNET_RPC || "https://rpc.arc.network",
      chainId: parseInt(process.env.ARC_MAINNET_CHAIN_ID || "0"),
      accounts: process.env.DEPLOYER_PRIVATE_KEY 
        ? [process.env.DEPLOYER_PRIVATE_KEY] 
        : [],
      gasPrice: "auto"
    }
  },
  paths: {
    sources: "../", // Point to parent contracts folder
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
