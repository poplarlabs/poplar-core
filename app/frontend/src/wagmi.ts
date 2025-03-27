import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base, baseSepolia } from 'wagmi/chains'
import { http } from 'viem'

const localChain = {
  id: 31337,
  name: 'Local',
  network: 'local',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://localhost:8545'] },
    public: { http: ['http://localhost:8545'] },
  },
  blockExplorers: {
    default: { name: 'Local', url: '' },
  },
  testnet: true,
}

export const config = getDefaultConfig({
  appName: 'Poplar Labs',
  projectId: 'YOUR_PROJECT_ID', // Get one from https://cloud.walletconnect.org/app
  chains: [localChain, base, baseSepolia],
  transports: {
    [localChain.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})
