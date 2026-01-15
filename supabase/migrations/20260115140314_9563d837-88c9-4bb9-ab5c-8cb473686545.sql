-- Create arc_dapps table to store ecosystem dApps for dynamic daily tasks
CREATE TABLE public.arc_dapps (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  website_url text NOT NULL,
  icon_url text,
  actions jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_verified boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  target_contract text,
  chain_id integer DEFAULT 1147,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.arc_dapps ENABLE ROW LEVEL SECURITY;

-- Public read access for all users (dApps are public data)
CREATE POLICY "arc_dapps_public_read" ON public.arc_dapps
FOR SELECT USING (true);

-- Service role full access for admin operations
CREATE POLICY "arc_dapps_service_all" ON public.arc_dapps
FOR ALL USING (true) WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_arc_dapps_category ON public.arc_dapps(category);
CREATE INDEX idx_arc_dapps_is_active ON public.arc_dapps(is_active);

-- Add updated_at trigger
CREATE TRIGGER update_arc_dapps_updated_at
  BEFORE UPDATE ON public.arc_dapps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert all dApps from Arc Network ecosystem
INSERT INTO public.arc_dapps (slug, name, category, description, website_url, actions, is_verified, is_featured) VALUES
-- DeFi & Yield
('arc-perps', 'Arc Perps', 'DeFi', 'Decentralized perpetual futures trading platform for trading with leverage on Arc Network.', 'https://v0-arcperp.vercel.app/', '[{"action": "Open long position", "verb": "trade"}, {"action": "Open short position", "verb": "short"}, {"action": "Add margin", "verb": "deposit"}]', true, true),
('arcdex', 'ArcDex', 'DeFi', 'Protocol for swapping, staking, and providing liquidity on Arc Network.', 'https://www.arc-dex.xyz/', '[{"action": "Swap tokens", "verb": "swap"}, {"action": "Stake tokens", "verb": "stake"}, {"action": "Add liquidity", "verb": "provide"}]', true, true),
('aeonvaults', 'AeonVaults', 'DeFi', 'Time-locked savings protocol - a smart piggy bank for disciplined saving.', 'https://aeonvaults.netlify.app/', '[{"action": "Create vault", "verb": "create"}, {"action": "Lock funds", "verb": "lock"}, {"action": "Withdraw savings", "verb": "withdraw"}]', true, false),
('aarce', 'Aarce', 'DeFi', 'Lending and borrowing platform built on Aave V4 architecture for USDC, EURC, and USDT.', 'https://aarce.xyz/', '[{"action": "Lend USDC", "verb": "lend"}, {"action": "Borrow assets", "verb": "borrow"}, {"action": "Repay loan", "verb": "repay"}]', true, true),
('axpha', 'Axpha', 'DeFi', 'Unified execution layer for on-chain trading on Arc Network.', 'https://testnet.axpha.io/', '[{"action": "Execute trade", "verb": "trade"}, {"action": "Place limit order", "verb": "order"}, {"action": "Cancel order", "verb": "cancel"}]', true, false),
('prymys', 'PRYMYS', 'DeFi', 'High-frequency DeFi ecosystem with gamified yield warfare and property markets.', 'https://prymus.xyz/', '[{"action": "Farm yield", "verb": "farm"}, {"action": "Stake tokens", "verb": "stake"}, {"action": "Claim rewards", "verb": "claim"}]', true, false),
('swaparc', 'SwapArc', 'DeFi', 'Stablecoin DEX and on-chain FX swap protocol for USDC/EURC trading.', 'https://swaparc.vercel.app/', '[{"action": "Swap USDC to EURC", "verb": "swap"}, {"action": "Provide liquidity", "verb": "provide"}, {"action": "Remove liquidity", "verb": "remove"}]', true, true),
('26arc-vault', '26Arc Vault', 'DeFi', 'Time-lock savings with achievement systems and streak tracking.', 'https://26-arc.vercel.app/', '[{"action": "Create savings goal", "verb": "create"}, {"action": "Deposit to vault", "verb": "deposit"}, {"action": "Claim streak bonus", "verb": "claim"}]', true, false),
('synthra', 'Synthra', 'DeFi', 'Next-gen EVM DEX offering concentrated liquidity and advanced routing.', 'https://synthra.org/', '[{"action": "Swap tokens", "verb": "swap"}, {"action": "Add concentrated liquidity", "verb": "provide"}, {"action": "Collect fees", "verb": "collect"}]', true, true),
('aeondex', 'AeonDEX', 'DeFi', 'AMM for seamless swaps between USDC and EURC with 0.3% fee rewards.', 'https://aeondex.netlify.app/', '[{"action": "Swap USDC", "verb": "swap"}, {"action": "Add LP tokens", "verb": "provide"}, {"action": "Earn fees", "verb": "earn"}]', true, false),
('aeoncoop', 'AeonCoop', 'DeFi', 'Decentralized group savings and rotating savings circles (ROSCAs).', 'https://aeoncoop.netlify.app/', '[{"action": "Join savings circle", "verb": "join"}, {"action": "Contribute funds", "verb": "contribute"}, {"action": "Collect payout", "verb": "collect"}]', true, false),
('arc-defi-hub', 'Arc DeFi Hub', 'DeFi', 'Integrated platform for GM social tools and token swaps.', 'https://arc-testnet-sdsz.vercel.app/', '[{"action": "Swap tokens", "verb": "swap"}, {"action": "Send GM", "verb": "social"}, {"action": "Check portfolio", "verb": "view"}]', true, false),
('katrinadex', 'KatrinaDEX', 'DeFi', 'Structural maturity DEX using ZK proofs for verifiable compliance.', 'https://www.katrinadex.xyz/', '[{"action": "Trade with ZK proof", "verb": "trade"}, {"action": "Verify compliance", "verb": "verify"}, {"action": "Submit order", "verb": "order"}]', true, false),

-- NFT & Marketplace
('arcnft-market', 'ArcNFT Market', 'NFT', 'Simple marketplace for minting, listing, and trading NFTs on Arc Network.', 'https://arcnft-market.vercel.app/', '[{"action": "Mint NFT", "verb": "mint"}, {"action": "List for sale", "verb": "list"}, {"action": "Buy NFT", "verb": "buy"}]', true, true),
('nft-arc-generator', 'NFT ARC Generator', 'NFT', 'No-code tool for generating AI art and minting ERC-721 NFTs.', 'https://nftarcgenerator.netlify.app/', '[{"action": "Generate AI art", "verb": "generate"}, {"action": "Mint as NFT", "verb": "mint"}, {"action": "Share creation", "verb": "share"}]', true, false),
('arc-pay-nft', 'Arc-Pay NFT Invoices', 'NFT', 'On-chain invoice system where invoices are issued as NFTs.', 'https://www.arc-pay.xyz/', '[{"action": "Create invoice NFT", "verb": "create"}, {"action": "Pay invoice", "verb": "pay"}, {"action": "Verify payment", "verb": "verify"}]', true, false),

-- Gaming & Prediction
('arcade-on-arc', 'Arcade on Arc', 'Gaming', 'Decentralized gaming protocol for sub-second settlement using USDC.', 'https://www.arcadeonarc.fun/', '[{"action": "Play game", "verb": "play"}, {"action": "Bet USDC", "verb": "bet"}, {"action": "Claim winnings", "verb": "claim"}]', true, true),
('arc-crypto-race', 'ARC CRYPTO RACE', 'Gaming', 'Web3 racing tournament with daily prize pools powered by USDC.', 'https://www.arccryptorace.xyz/', '[{"action": "Enter race", "verb": "enter"}, {"action": "Bet on winner", "verb": "bet"}, {"action": "Claim prize", "verb": "claim"}]', true, false),
('forsightt', 'Forsightt', 'Gaming', 'Prediction market enabling users to bet USDC on yes/no scenarios.', 'https://www.forsightt.xyz/', '[{"action": "Create prediction", "verb": "create"}, {"action": "Place bet", "verb": "bet"}, {"action": "Resolve market", "verb": "resolve"}]', true, true),
('wharc-a-mole', 'whARC-a-mole', 'Gaming', 'Classic arcade-style game testing on-chain integration and network load.', 'https://www.wharc-a-mole.xyz/', '[{"action": "Start game", "verb": "play"}, {"action": "Submit score", "verb": "submit"}, {"action": "Claim reward", "verb": "claim"}]', true, false),
('lucky-day', 'LuckyDay', 'Gaming', 'Gamified faucet mechanism combined with a probability-based lottery game.', 'https://lucky-day-lottery.netlify.app/', '[{"action": "Spin lottery", "verb": "spin"}, {"action": "Claim faucet", "verb": "claim"}, {"action": "Check jackpot", "verb": "view"}]', true, false),
('arcpredicty', 'ArcPredicty', 'Gaming', 'Permissionless platform for predicting outcomes and trading on future events.', 'https://arcprediction.app/', '[{"action": "Create market", "verb": "create"}, {"action": "Trade position", "verb": "trade"}, {"action": "Settle market", "verb": "settle"}]', true, false),

-- Tools & Infrastructure
('easy-faucet-arc', 'Easy Faucet Arc', 'Tools', 'High-volume testnet faucet providing up to 100 USDC per day.', 'https://easyfaucetarc.xyz/', '[{"action": "Claim USDC", "verb": "claim"}, {"action": "Check balance", "verb": "view"}, {"action": "Request tokens", "verb": "request"}]', true, true),
('crowdmint', 'CrowdMint', 'Tools', 'Decentralized crowdfunding platform with yield-generating unclaimed funds.', 'https://www.crowdmint.live/', '[{"action": "Create campaign", "verb": "create"}, {"action": "Fund project", "verb": "fund"}, {"action": "Claim funds", "verb": "claim"}]', true, false),
('arcnet-social', 'Arcnet Social', 'Social', 'Decentralized, censorship-resistant social platform for Arc Network.', 'https://www.arcnetsocial.app/', '[{"action": "Post update", "verb": "post"}, {"action": "Follow user", "verb": "follow"}, {"action": "Like content", "verb": "like"}]', true, true),
('arc-multi-sender', 'Arc Multi-Sender', 'Tools', 'Utility for sending USDC/EURC to multiple wallets in one transaction.', 'https://arcmultisender.xyz/', '[{"action": "Batch send tokens", "verb": "send"}, {"action": "Upload addresses", "verb": "upload"}, {"action": "Confirm transfer", "verb": "confirm"}]', true, false),
('smart-contract-wizard', 'Smart Contract Wizard', 'Tools', 'AI assistant for creating and deploying smart contracts on Arc.', 'https://arccontractwiz.xyz/', '[{"action": "Generate contract", "verb": "generate"}, {"action": "Deploy contract", "verb": "deploy"}, {"action": "Verify contract", "verb": "verify"}]', true, false),
('recurve', 'Recurve', 'Tools', 'On-chain subscription infrastructure for recurring payments.', 'https://arcrecurve.vercel.app/', '[{"action": "Create subscription", "verb": "create"}, {"action": "Pay subscription", "verb": "pay"}, {"action": "Cancel plan", "verb": "cancel"}]', true, false),
('arcpay', 'ArcPay', 'Tools', 'Developer-first payment gateway for stablecoin-native payments.', 'https://arcpaybeta.vercel.app/', '[{"action": "Create payment link", "verb": "create"}, {"action": "Process payment", "verb": "pay"}, {"action": "Withdraw funds", "verb": "withdraw"}]', true, false),
('payzed', 'Payzed', 'Tools', 'Native invoice and payment link platform for stablecoins on Arc.', 'https://payzed.xyz/', '[{"action": "Create invoice", "verb": "create"}, {"action": "Send payment", "verb": "pay"}, {"action": "Track payments", "verb": "view"}]', true, false),
('arcnet-ai', 'Arcnet AI', 'Tools', 'Platform to tokenize and trade co-owned AI agents.', 'https://arcnet.builders/', '[{"action": "Create AI agent", "verb": "create"}, {"action": "Trade agent shares", "verb": "trade"}, {"action": "Deploy agent", "verb": "deploy"}]', true, false);