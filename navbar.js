"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { Menu, Wallet, Copy, Check, Loader2 } from "lucide-react"
import { useAccount, useReadContract, useChainId, useBalance } from "wagmi"
import { formatUnits } from "viem"

import { Button } from "./ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog"
import { ConnectButton } from "./connect-button"
import { NotificationBell } from "./notification-bell"

// Navigation links for the app
const navLinks = [
  { name: "Home", href: "/" },
  { name: "Chat", href: "/chat" },
  { name: "Reputation", href: "/reputation" },
]

// Token contract addresses for Ethereum Mainnet and Sepolia testnet
// Replace these with actual contract addresses for your network
const TOKEN_ADDRESSES = {
  // Ethereum Sepolia (testnet - chainId: 11155111)
  11155111: {
    USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // Sepolia USDC
    USDT: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0", // Sepolia USDT
  },
  // Ethereum Mainnet (chainId: 1)
  1: {
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // Mainnet USDC (Circle)
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Mainnet USDT
  },
}

// ERC20 ABI - just the balanceOf function we need
const ERC20_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
]

/**
 * Navbar Component
 * Sticky navigation bar with wallet connection and mobile menu
 * Includes responsive design for mobile and desktop views
 */
export function Navbar() {
  const router = useRouter()
  const [pathname, setPathname] = useState("")
  const [isBalanceOpen, setIsBalanceOpen] = useState(false) // Balance modal state
  const [copiedAddress, setCopiedAddress] = useState(false) // Track if address was copied

  // Get wallet connection info
  const { address, isConnected } = useAccount()
  const chainId = useChainId()

  // Get token addresses for current chain
  const tokenAddresses = TOKEN_ADDRESSES[chainId] || TOKEN_ADDRESSES[11155111] // Default to Sepolia

  // Fetch USDC balance
  const { data: usdcBalance } = useReadContract({
    address: tokenAddresses.USDC,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address],
    enabled: !!address && isConnected,
  })

  // Fetch native ETH balance
  const { data: ethBalance } = useBalance({
    address: address,
    enabled: !!address && isConnected,
  })

  // Format balances (tokens typically have 18 decimals, USDC/USDT may have 6)
  const formatBalance = (balance, decimals = 18) => {
    if (!balance) return "0.00"
    try {
      const formatted = formatUnits(balance, decimals)
      return parseFloat(formatted).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    } catch {
      return "0.00"
    }
  }

  // Generate a random name based on wallet address
  // Same wallet will always get the same name
  const generateRandomName = (walletAddress) => {
    if (!walletAddress) return "Guest User"

    const firstNames = [
      "Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Avery", "Quinn",
      "Dakota", "Sage", "Phoenix", "River", "Skyler", "Cameron", "Logan", "Parker"
    ]

    const lastNames = [
      "Chen", "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Martinez",
      "Davis", "Rodriguez", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas"
    ]

    // Use wallet address to generate consistent index
    const addressSum = walletAddress.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
    const firstNameIndex = addressSum % firstNames.length
    const lastNameIndex = (addressSum * 7) % lastNames.length // Multiply by prime for variation

    return `${firstNames[firstNameIndex]} ${lastNames[lastNameIndex]}`
  }

  // Prepare user data with actual wallet info
  const ETH_PRICE_USD = 3500; // Approximate ETH price in USD

  const ethRaw = ethBalance ? parseFloat(ethBalance.formatted) : 0;
  const usdcRaw = usdcBalance ? parseFloat(formatUnits(usdcBalance, 6)) : 0;

  const userData = {
    address: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected",
    fullAddress: address || "",
    balances: {
      USDC: usdcRaw.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      USDCRaw: usdcRaw.toFixed(2),
      ETH: ethRaw.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }),
      ETHinUSD: (ethRaw * ETH_PRICE_USD).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    }
  }

  // Calculate total balance in USD
  const calculateTotal = () => {
    try {
      const usdcValue = usdcRaw;
      const ethValue = ethRaw * ETH_PRICE_USD;
      return (usdcValue + ethValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    } catch {
      return "0.00"
    }
  }

  // Set pathname on client side only to prevent hydration errors
  useEffect(() => {
    setPathname(router.pathname)
  }, [router.pathname])

  // Copy wallet address to clipboard
  const copyAddress = () => {
    if (userData.fullAddress) {
      navigator.clipboard.writeText(userData.fullAddress)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000) // Reset after 2 seconds
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800/50 bg-black/90 backdrop-blur-md supports-[backdrop-filter]:bg-black/70">
      <div className="container flex h-14 md:h-16 max-w-screen-2xl items-center justify-between px-4 mx-auto">
        <div className="flex items-center gap-2">
          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-neutral-950 border-neutral-800/50">
              <div className="flex items-center gap-1 mb-8">
                <Image
                  src="/logos/leftAI.png"
                  alt="LeftAI Logo"
                  width={28}
                  height={28}
                  className="w-7 h-7"
                />
                <span className="font-bold text-lg text-neutral-100">
                  LeftAI
                </span>
              </div>
              {/* Mobile navigation links */}
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 text-base font-medium transition-colors px-3 py-2 rounded-lg ${pathname === link.href
                      ? "text-neutral-100 bg-neutral-800/50"
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30"
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
            <Image
              src="/logos/leftAI.png"
              alt="LeftAI Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-bold text-xl text-neutral-100">
              LeftAI
            </span>
          </Link>
        </div>

        {/* Mobile - Top Right Actions */}
        <div className="md:hidden flex items-center gap-2">
          {isConnected ? (
            <>
              <NotificationBell />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBalanceOpen(true)}
                className="bg-neutral-900/50 border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
              >
                <Wallet className="h-4 w-4 mr-1" />
                Balance
              </Button>
            </>
          ) : (
            <ConnectButton />
          )}
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${pathname === link.href
                ? "text-neutral-100"
                : "text-neutral-400 hover:text-neutral-200"
                }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="flex items-center gap-3">
            {/* Notification & Balance buttons for desktop - Only show when connected */}
            {isConnected && (
              <>
                <NotificationBell />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBalanceOpen(true)}
                  className="bg-neutral-900/50 border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Balance
                </Button>
              </>
            )}
            <ConnectButton />
          </div>
        </nav>
      </div>

      {/* Balance Modal - Compact for mobile, comfortable for desktop */}
      <Dialog open={isBalanceOpen} onOpenChange={setIsBalanceOpen}>
        <DialogContent className="sm:max-w-md w-[92vw] mx-auto p-4 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg sm:text-xl">Account Balance</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4 py-2">
            {/* Wallet Information Section */}
            <div className="space-y-2 mb-6">
              {/* Wallet Address with Copy Button and Celoscan Link */}
              <div className="p-3 sm:p-4 bg-neutral-800/50 rounded-lg border border-neutral-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-neutral-400">Wallet</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyAddress}
                    className="h-6 w-6 p-0 hover:bg-neutral-700"
                  >
                    {copiedAddress ? (
                      <Check className="h-3 w-3 text-green-400" />
                    ) : (
                      <Copy className="h-3 w-3 text-neutral-400" />
                    )}
                  </Button>
                </div>
                <p className="text-xs sm:text-sm font-medium text-neutral-100 font-mono break-all mb-2">{userData.fullAddress}</p>
                <a
                  href={`https://etherscan.io/address/${userData.fullAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 inline-block"
                >
                  View on Etherscan →
                </a>
              </div>
            </div>

            {/* Token Balances Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-3">
                Token Balances
              </h3>

              {/* USDC Balance */}
              <div className="flex items-center justify-between p-4 sm:p-5 bg-neutral-800/80 rounded-xl border-2 border-neutral-700 shadow-lg hover:bg-neutral-800 transition-colors">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-900 flex items-center justify-center flex-shrink-0 overflow-hidden border border-neutral-600 shadow-md">
                    <Image
                      src="/logos/usd-coin-usdc-logo.svg"
                      alt="USDC"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-neutral-50">USDC</p>
                    <p className="text-[10px] sm:text-xs text-neutral-400">USD Coin</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base sm:text-xl font-bold text-neutral-50">${userData.balances.USDC}</p>
                  <p className="text-[10px] sm:text-xs text-neutral-400">{userData.balances.USDCRaw} USDC</p>
                </div>
              </div>

              {/* ETH Balance */}
              <div className="flex items-center justify-between p-4 sm:p-5 bg-neutral-800/80 rounded-xl border-2 border-neutral-700 shadow-lg hover:bg-neutral-800 transition-colors">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 overflow-hidden border border-neutral-600 shadow-md">
                    <span className="text-white font-bold text-lg">Ξ</span>
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-neutral-50">ETH</p>
                    <p className="text-[10px] sm:text-xs text-neutral-400">Ethereum</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base sm:text-xl font-bold text-neutral-50">${userData.balances.ETHinUSD}</p>
                  <p className="text-[10px] sm:text-xs text-neutral-400">{userData.balances.ETH} ETH</p>
                </div>
              </div>
            </div>

            {/* Total Balance */}
            <div className="pt-2 sm:pt-3 border-t border-neutral-700">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-neutral-800/80 rounded-lg">
                <span className="text-sm sm:text-base font-medium text-neutral-300">Total Balance</span>
                <span className="text-lg sm:text-xl font-bold text-neutral-100">
                  ${calculateTotal()}
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}

