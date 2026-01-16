# INTENT Smart Contracts - Foundry Setup

Foundry-based deployment for Arc Network (recommended by Arc docs).

## Prerequisites

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

## Project Structure

```
contracts/
├── foundry/
│   ├── src/
│   │   ├── CampaignRegistry.sol
│   │   └── IntentProof.sol
│   ├── script/
│   │   └── Deploy.s.sol
│   ├── test/
│   │   ├── CampaignRegistry.t.sol
│   │   └── IntentProof.t.sol
│   ├── foundry.toml
│   └── .env.example
```

## Setup

1. Copy environment file:
```bash
cp .env.example .env
```

2. Configure `.env`:
```env
# Arc Testnet RPC
RPC_URL=https://rpc.testnet.arc.network

# Deployer private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Platform backend address (will have permission to record proofs)
PLATFORM_BACKEND=0x...
```

## Build

```bash
forge build
```

## Test

```bash
forge test -vvv
```

## Deploy to Arc Testnet

```bash
# Load environment variables
source .env

# Deploy
forge script script/Deploy.s.sol:DeployScript --rpc-url $RPC_URL --broadcast --verify

# Or deploy with explicit private key
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://rpc.testnet.arc.network \
  --private-key $PRIVATE_KEY \
  --broadcast
```

## Verify Contracts (Optional)

```bash
forge verify-contract \
  --chain-id 1147 \
  --constructor-args $(cast abi-encode "constructor(address)" $PLATFORM_BACKEND) \
  <DEPLOYED_ADDRESS> \
  src/IntentProof.sol:IntentProof
```

## Gas Estimation

```bash
forge test --gas-report
```

## Contract Addresses (After Deployment)

Update these in the event-listener edge function after deployment:

- **CampaignRegistry**: `0x...`
- **IntentProof**: `0x...`

## Arc Testnet Info

- **Chain ID**: 1147 (0x47B)
- **RPC URL**: https://rpc.testnet.arc.network
- **Native Token**: USDC (18 decimals)
- **Block Explorer**: https://testnet.arcscan.io
