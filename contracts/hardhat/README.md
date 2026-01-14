# INTENT Protocol - Smart Contract Deployment

## Prerequisites

1. Install dependencies:
```bash
cd contracts/hardhat
npm install
```

2. Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

3. Fund your deployer wallet with USDC on Arc Testnet

## Deployment

### Arc Testnet
```bash
npm run deploy:testnet
```

### Arc Mainnet (when available)
```bash
npm run deploy:mainnet
```

## After Deployment

1. Copy the deployed contract addresses from the console output
2. Update `src/lib/nftContract.ts` with the new addresses:

```typescript
const CONTRACTS = {
  INTENT_PROOF: '0x...your_deployed_address...',
  CAMPAIGN_REGISTRY: '0x...your_deployed_address...',
};
```

3. The deployment info is also saved to `./deployments/{network}.json`

## Contract Overview

### IntentProof.sol
- Records structured participation proofs on-chain
- Non-transferable (soulbound)
- Only callable by platform backend

### CampaignRegistry.sol
- Maps campaign metadata hashes to creators
- Stores immutable campaign records

## Security Notes

- Never commit `.env` with real private keys
- The `PLATFORM_BACKEND_ADDRESS` should be a secure backend wallet
- Proofs are immutable once recorded
