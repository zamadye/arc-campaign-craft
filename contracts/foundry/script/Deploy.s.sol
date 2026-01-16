// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {CampaignRegistry} from "../src/CampaignRegistry.sol";
import {IntentProof} from "../src/IntentProof.sol";

/**
 * @title DeployScript
 * @notice Deploys CampaignRegistry and IntentProof contracts to Arc Network
 * 
 * Usage:
 *   forge script script/Deploy.s.sol:DeployScript --rpc-url $RPC_URL --broadcast
 */
contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        // Get deployer private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address platformBackend = vm.envAddress("PLATFORM_BACKEND");
        
        require(platformBackend != address(0), "PLATFORM_BACKEND not set");
        
        console.log("Deploying contracts...");
        console.log("Platform Backend:", platformBackend);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy CampaignRegistry
        CampaignRegistry campaignRegistry = new CampaignRegistry(platformBackend);
        console.log("CampaignRegistry deployed at:", address(campaignRegistry));
        
        // Deploy IntentProof
        IntentProof intentProof = new IntentProof(platformBackend);
        console.log("IntentProof deployed at:", address(intentProof));
        
        vm.stopBroadcast();
        
        // Log deployment summary
        console.log("");
        console.log("=== Deployment Summary ===");
        console.log("CampaignRegistry:", address(campaignRegistry));
        console.log("IntentProof:", address(intentProof));
        console.log("Platform Backend:", platformBackend);
        console.log("");
        console.log("Update these addresses in:");
        console.log("  - supabase/functions/event-listener/index.ts");
        console.log("  - supabase/functions/intent-proof-service/index.ts");
    }
}
