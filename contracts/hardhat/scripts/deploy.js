const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());
  
  // Platform backend address for access control
  // This should be a secure backend wallet that will call recordProof
  const platformBackend = process.env.PLATFORM_BACKEND_ADDRESS || deployer.address;
  console.log("Platform backend address:", platformBackend);
  
  // ========================================
  // Deploy IntentProof
  // ========================================
  console.log("\n📦 Deploying IntentProof...");
  const IntentProof = await hre.ethers.getContractFactory("IntentProof");
  const intentProof = await IntentProof.deploy(platformBackend);
  await intentProof.waitForDeployment();
  
  const intentProofAddress = await intentProof.getAddress();
  console.log("✅ IntentProof deployed to:", intentProofAddress);
  
  // ========================================
  // Deploy CampaignRegistry
  // ========================================
  console.log("\n📦 Deploying CampaignRegistry...");
  const CampaignRegistry = await hre.ethers.getContractFactory("CampaignRegistry");
  const campaignRegistry = await CampaignRegistry.deploy(platformBackend);
  await campaignRegistry.waitForDeployment();
  
  const registryAddress = await campaignRegistry.getAddress();
  console.log("✅ CampaignRegistry deployed to:", registryAddress);
  
  // ========================================
  // Summary
  // ========================================
  console.log("\n" + "=".repeat(50));
  console.log("🎉 DEPLOYMENT COMPLETE");
  console.log("=".repeat(50));
  console.log("\nContract Addresses:");
  console.log("  IntentProof:      ", intentProofAddress);
  console.log("  CampaignRegistry: ", registryAddress);
  console.log("\nPlatform Backend:   ", platformBackend);
  console.log("\n⚠️  IMPORTANT: Update these addresses in your frontend:");
  console.log("  - src/lib/nftContract.ts → CONTRACTS object");
  console.log("\n" + "=".repeat(50));
  
  // Write deployment info to file
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    platformBackend: platformBackend,
    contracts: {
      IntentProof: intentProofAddress,
      CampaignRegistry: registryAddress
    },
    deployedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(
    `./deployments/${hre.network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log(`\n📁 Deployment info saved to: ./deployments/${hre.network.name}.json`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
