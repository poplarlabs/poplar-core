import { useAccount, useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { ROOT_TOKEN_ADDRESS, ROOT_TOKEN_ABI } from '../contracts'

export function RootBalance() {
  const { address, isConnected } = useAccount()

  const { data: balance } = useReadContract({
    address: ROOT_TOKEN_ADDRESS,
    abi: ROOT_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address!],
    query: {
      enabled: isConnected,
    },
  })

  if (!isConnected) return null

  const formattedBalance = balance
    ? Number(formatEther(balance)).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 4,
      })
    : '0'

  return (
    <div className="flex items-center gap-2 rounded-[12px] bg-white border border-gray-200 px-4 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
      <div className="text-base font-semibold text-gray-700">
        {formattedBalance} ROOT
      </div>
    </div>
  )
}
