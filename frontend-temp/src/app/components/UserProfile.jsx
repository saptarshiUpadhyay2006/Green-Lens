'use client';

import { useUser, UserButton, useClerk } from '@clerk/nextjs';
import { Mail, Phone, Coins, Edit, TrendingUp, Award, Zap, Sun, Car, Trees, ShoppingCart, Leaf, ChevronRight, Activity, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import GraphComponent from '../components/GraphComponent';
import Footer from './Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ethers } from "ethers";
import { getContract } from "../../utils/contract";

export default function UserProfile() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const { openUserProfile } = useClerk();

  // Wallet and token states
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [greenTokens, setGreenTokens] = useState(0);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [contractError, setContractError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Connect wallet function
  const connectWallet = async () => {
    if (isConnecting) return;

    setIsConnecting(true);
    setContractError(null);

    try {
      if (typeof window === 'undefined') {
        console.log("Not in browser environment");
        return;
      }

      if (!window.ethereum) {
        console.warn("MetaMask not installed");
        setContractError("Please install MetaMask to connect your wallet");
        return;
      }

      console.log("Requesting MetaMask accounts...");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });

      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        console.log("Connected to account:", address);
        setAccount(address);
        setContractError(null);
      } else {
        console.warn("No accounts found");
        setContractError("No accounts found. Please unlock MetaMask.");
      }

    } catch (error) {
      console.error("Error connecting wallet:", error);
      if (error.code === 4001) {
        setContractError("Connection rejected. Please approve the connection in MetaMask.");
      } else if (error.code === -32002) {
        setContractError("Connection request pending. Please check MetaMask.");
      } else {
        setContractError("Failed to connect wallet. Please try again.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    setAccount(null);
    setBalance("0");
    setGreenTokens(0);
    setContractError(null);
    console.log("Wallet disconnected");
  };

  // Fetch token balance
  const viewTokens = async (walletAddress) => {
    if (!walletAddress) {
      console.log("No wallet address provided");
      return;
    }

    setIsLoadingTokens(true);
    setContractError(null);

    try {
      console.log("Fetching balance for:", walletAddress);

      const contractData = await getContract();
      console.log("Contract data received:", contractData);

      const contract = contractData.contract || contractData;

      if (!contract) {
        throw new Error("Contract not initialized");
      }

      let provider = contractData.provider;

      if (!provider) {
        console.log("Provider not returned from getContract, creating new one...");
        if (!window.ethereum) {
          throw new Error("MetaMask not found");
        }
        provider = new ethers.BrowserProvider(window.ethereum);
      }

      const network = await provider.getNetwork();
      console.log("Connected to network:", network.chainId.toString());

      const contractAddress = contract.target || contract.address;
      console.log("Contract address:", contractAddress);

      const code = await provider.getCode(contractAddress);
      console.log("Contract code length:", code.length);

      if (code === '0x') {
        throw new Error("Contract not deployed at this address on current network");
      }

      console.log("Contract found, fetching balance...");

      const bal = await contract.balanceOf(walletAddress);
      console.log("Raw balance:", bal.toString());

      const formattedBalance = ethers.formatUnits(bal, 18);
      console.log("Formatted balance:", formattedBalance);

      setBalance(formattedBalance);
      setGreenTokens(parseFloat(formattedBalance));

    } catch (error) {
      console.error("Error fetching balance:", error);

      let errorMsg = "Failed to fetch balance";
      if (error.message.includes("not deployed")) {
        errorMsg = "Contract not deployed on current network";
      } else if (error.message.includes("BAD_DATA") || error.code === "BAD_DATA") {
        errorMsg = "Contract address may be incorrect or not deployed";
      } else if (error.code === "NETWORK_ERROR") {
        errorMsg = "Network connection error";
      } else if (error.message.includes("MetaMask")) {
        errorMsg = "MetaMask connection error";
      }

      setContractError(errorMsg);
      setGreenTokens(0);

    } finally {
      setIsLoadingTokens(false);
    }
  };

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          });

          if (accounts && accounts.length > 0) {
            console.log("Already connected to:", accounts[0]);
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking connection:", error);
        }
      }
    };

    checkConnection();

    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        console.log("Accounts changed:", accounts);
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = () => {
        console.log("Chain changed, reloading...");
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  // Fetch tokens when account changes
  useEffect(() => {
    if (account) {
      console.log("Account connected, fetching tokens...");
      viewTokens(account);
    }
  }, [account]);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-emerald-300 rounded-full shadow-lg"></div>
          <div className="h-4 w-32 bg-emerald-300 rounded"></div>
        </div>
      </div>
    );
  }

  // Not signed in
  if (!isSignedIn || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="text-center p-8 bg-emerald-50/80 backdrop-blur-md rounded-3xl border border-emerald-500/20 shadow-xl">
          <p className="text-xl font-bold text-gray-700">Please sign in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f5fbf8] via-[#eef7f2] to-[#e4f3f0] p-4 sm:p-8 font-sans relative overflow-hidden">
      {/* Premium Decorative Glow Blobs */}
      <div className="absolute top-[-20%] left-[-15%] w-[600px] h-[600px] bg-emerald-300/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-15%] w-[700px] h-[700px] bg-teal-300/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[35%] left-[25%] w-[450px] h-[450px] bg-lime-300/80 rounded-full blur-[120px] pointer-events-none opacity-20" />

      <div className="w-full relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 bg-emerald-50/45 backdrop-blur-xl border border-emerald-500/20 p-6 sm:p-8 rounded-[2rem] shadow-[0_15px_50px_rgba(27,94,32,0.04)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-500 to-teal-600" />
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-950 flex items-center gap-2">
              Welcome back, {user.firstName}! 🌿
            </h1>
            <p className="text-emerald-800/80 mt-1.5 font-semibold text-sm sm:text-base">Track your carbon footprint, earn verified Green Tokens & restore the planet.</p>
          </div>
          <div className="flex items-center gap-3 bg-white/95 p-2 px-3.5 rounded-2xl border border-emerald-500/10 shadow-[0_4px_15px_rgba(0,0,0,0.02)] self-end sm:self-auto hover:border-emerald-500/20 transition-all duration-300">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider hidden sm:inline">Portal Access</span>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 border-2 border-emerald-500/40 hover:border-emerald-500 hover:scale-105 transition-all duration-300 shadow-md"
                }
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Info Card */}
            <div className="bg-emerald-50/45 backdrop-blur-xl rounded-[2rem] border border-emerald-500/20 p-6 shadow-[0_15px_50px_rgba(27,94,32,0.04)] transition-all duration-300 hover:shadow-[0_20px_60px_rgba(27,94,32,0.06)] relative overflow-hidden group">
              <div className="absolute top-[-50px] right-[-50px] w-28 h-28 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all duration-500" />
              <div className="flex flex-col items-center">
                <div className="relative mb-5">
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="w-28 h-28 rounded-full border-4 border-white shadow-lg ring-4 ring-emerald-500/15 group-hover:ring-emerald-500/30 transition-all duration-300 object-cover"
                  />
                  <span className="absolute bottom-1 right-2 w-4.5 h-4.5 bg-emerald-500 border-3 border-white rounded-full shadow animate-pulse" />
                </div>

                <h2 className="text-xl font-black text-gray-900 text-center flex items-center gap-1.5 leading-tight">
                  {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'}
                  <span className="w-5 h-5 bg-emerald-100/80 border border-emerald-200/50 rounded-full flex items-center justify-center text-[9px] text-emerald-700 font-extrabold shadow-sm" title="Verified Green Warrior">✓</span>
                </h2>

                {user.username && (
                  <p className="text-emerald-700/80 text-xs font-bold mt-1.5 bg-emerald-100/40 border border-emerald-200/30 px-3 py-0.5 rounded-full tracking-wide">@{user.username}</p>
                )}

                {/* Contact Info */}
                <div className="w-full mt-6 space-y-3.5 bg-emerald-50/20 p-4.5 rounded-2xl border border-emerald-500/10 shadow-inner">
                  <div className="flex items-center gap-3.5 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-gray-700 truncate font-semibold text-xs sm:text-sm">
                      {user.primaryEmailAddress?.emailAddress || 'No email'}
                    </span>
                  </div>
                  {user.primaryPhoneNumber && (
                    <div className="flex items-center gap-3.5 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-gray-700 font-semibold text-xs sm:text-sm">
                        {user.primaryPhoneNumber.phoneNumber}
                      </span>
                    </div>
                  )}
                </div>

                <div className="w-full border-t border-emerald-950/5 my-6" />

                {/* Wallet Info Panel */}
                <div className="w-full space-y-3">
                  {account ? (
                    <div className="w-full space-y-2.5">
                      <div className="p-3.5 bg-gradient-to-r from-emerald-50/60 to-teal-50/60 border border-emerald-100/80 rounded-2xl shadow-inner relative overflow-hidden">
                        <p className="text-[9px] uppercase font-black text-emerald-800 tracking-widest mb-1.5">Connected Web3 Wallet</p>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                          <p className="text-xs font-mono font-bold text-emerald-950 truncate">
                            {account.slice(0, 6)}...{account.slice(-4)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={disconnectWallet}
                        className="w-full py-2.5 px-4 bg-red-50/80 hover:bg-red-100/80 border border-red-100/80 hover:border-red-200 text-red-600 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        Disconnect Wallet
                      </button>
                    </div>
                  ) : (
                    <div className="w-full">
                      <button
                        onClick={connectWallet}
                        disabled={isConnecting}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-700 disabled:from-emerald-400 disabled:to-teal-400 text-white rounded-2xl text-sm font-extrabold shadow-[0_10px_25px_rgba(16,185,129,0.15)] hover:shadow-[0_15px_30px_rgba(16,185,129,0.25)] transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                      >
                        {isConnecting ? (
                          <>
                            <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Connecting Wallet...
                          </>
                        ) : (
                          <>
                            <Coins className="w-5 h-5 animate-pulse" />
                            Connect Web3 Wallet
                          </>
                        )}
                      </button>
                      {contractError && (
                        <p className="text-xs font-bold text-red-600 mt-3 text-center bg-red-50 border border-red-100/60 p-3 rounded-xl leading-relaxed">{contractError}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Edit Account Button */}
                <button 
                  onClick={() => openUserProfile()}
                  className="w-full mt-6 py-2.5 bg-white border border-emerald-600/30 hover:border-emerald-600 text-emerald-700 hover:bg-emerald-50/30 hover:shadow-sm rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 text-xs sm:text-sm cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                  Edit Account Settings
                </button>
              </div>
            </div>

            {/* Green Tokens Card */}
            <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 rounded-[2rem] shadow-xl p-6 text-white relative overflow-hidden border border-emerald-800/20 shadow-[0_20px_45px_rgba(6,78,59,0.2)]">
              <div className="absolute -right-8 -top-8 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -left-8 -bottom-8 w-28 h-28 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-5 relative z-10">
                <h3 className="text-lg font-extrabold tracking-tight text-emerald-300">Green Tokens Ledger</h3>
                <div className="p-2 bg-white/5 rounded-xl border border-white/10 shadow-inner">
                  <Coins className="w-5 h-5 text-emerald-400" />
                </div>
              </div>

              <div className="relative z-10 mb-2">
                {!account ? (
                  <div className="mb-4">
                    <div className="text-4xl font-black text-white/90 mb-1.5">--</div>
                    <p className="text-xs text-emerald-300/60 font-semibold">Connect wallet to sync live balance</p>
                  </div>
                ) : contractError ? (
                  <div className="mb-4">
                    <div className="text-3xl font-black text-white/90 mb-2">⚠️</div>
                    <p className="text-xs text-red-200/80 mb-2 leading-relaxed font-semibold">{contractError}</p>
                    <button
                      onClick={() => viewTokens(account)}
                      className="text-xs font-black underline text-emerald-300 hover:text-emerald-100 transition-colors"
                    >
                      Retry Sync
                    </button>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-100 to-teal-200 tracking-tight drop-shadow-sm">
                      {isLoadingTokens ? (
                        <span className="animate-pulse opacity-70">Loading...</span>
                      ) : (
                        greenTokens.toLocaleString(undefined, { maximumFractionDigits: 2 })
                      )}
                    </div>
                    <p className="text-xs text-emerald-300/80 font-bold tracking-wide mt-2">Verified Sepolia Testnet Balance</p>
                  </div>
                )}
              </div>

              <div className="space-y-3 mt-6 relative z-10">
                <Link href='/prediction'>
                  <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-extrabold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-550/25 transform hover:-translate-y-0.5 active:scale-95 text-sm cursor-pointer m-2">
                    <Sparkles className="w-4 h-4" />
                    Simulate Token Earnings
                  </button>
                </Link>
                <Link href='/store'>
                  <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 backdrop-blur-sm rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer shadow-md m-2">
                    <Award className="w-4 h-4" />
                    Redeem Sustainable Rewards
                  </button>
                </Link>
                <Link href='/submit'>
                  <button className="w-full py-3 bg-white text-emerald-950 hover:bg-emerald-50 rounded-xl font-extrabold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95 text-sm cursor-pointer m-2">
                    <TrendingUp className="w-4 h-4 text-emerald-800" />
                    Mint More Tokens
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Earn Tokens Section */}
            <div className="bg-emerald-50/45 backdrop-blur-xl rounded-[2rem] border border-emerald-500/20 p-6 sm:p-8 shadow-[0_15px_50px_rgba(27,94,32,0.04)] transition-all duration-300 hover:shadow-[0_20px_60px_rgba(27,94,32,0.06)]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-black text-emerald-950 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                    Earn Tokens
                  </h3>
                  <p className="text-gray-600 text-sm font-semibold mt-1">Submit your eco-friendly logs to verify activities and earn tokens</p>
                </div>
                <button
                  onClick={() => router.push('/prediction')}
                  className="px-4 py-2.5 bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-600/20 hover:border-emerald-600 text-emerald-800 hover:text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all duration-300 shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Try Token Simulator
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Electricity Form */}
                <button onClick={() => router.push('/submit/electricity-form')} className="p-5 bg-white/60 hover:bg-white border border-yellow-100 hover:border-yellow-400/50 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_25px_rgba(234,179,8,0.06)] hover:-translate-y-0.5 group flex items-center justify-between w-full relative overflow-hidden cursor-pointer shadow-sm">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-yellow-50/40 rounded-full blur-xl pointer-events-none group-hover:bg-yellow-50/70 transition-colors" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-yellow-50 rounded-xl border border-yellow-100 flex items-center justify-center group-hover:bg-yellow-100 group-hover:scale-105 transition-all duration-300 shrink-0 shadow-sm">
                      <Zap className="w-5 h-5 text-yellow-600 animate-pulse" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-800 text-base">Electricity Bill</h4>
                        <span className="text-[9px] font-black uppercase tracking-wider text-yellow-700 bg-yellow-100/60 px-1.5 py-0.5 rounded-md border border-yellow-200/50">ML Model</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 font-medium">Energy conservation logs</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-600 group-hover:translate-x-1 transition-all duration-300 shrink-0 relative z-10" />
                </button>

                {/* Solar Form */}
                <button onClick={() => router.push('/submit/solar-form')} className="p-5 bg-white/60 hover:bg-white border border-orange-100 hover:border-orange-400/50 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_25px_rgba(249,115,22,0.06)] hover:-translate-y-0.5 group flex items-center justify-between w-full relative overflow-hidden cursor-pointer shadow-sm">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-orange-50/40 rounded-full blur-xl pointer-events-none group-hover:bg-orange-50/70 transition-colors" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl border border-orange-100 flex items-center justify-center group-hover:bg-orange-100 group-hover:scale-105 transition-all duration-300 shrink-0 shadow-sm">
                      <Sun className="w-5 h-5 text-orange-600 animate-pulse" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-800 text-base">Solar Power</h4>
                        <span className="text-[9px] font-black uppercase tracking-wider text-orange-700 bg-orange-100/60 px-1.5 py-0.5 rounded-md border border-orange-200/50">Doc AI</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 font-medium">Renewable energy tracking</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all duration-300 shrink-0 relative z-10" />
                </button>

                {/* Transport Form */}
                <button onClick={() => router.push('/submit/transport-form')} className="p-5 bg-white/60 hover:bg-white border border-blue-100 hover:border-blue-400/50 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_25px_rgba(59,130,246,0.06)] hover:-translate-y-0.5 group flex items-center justify-between w-full relative overflow-hidden cursor-pointer shadow-sm">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50/40 rounded-full blur-xl pointer-events-none group-hover:bg-blue-50/70 transition-colors" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-105 transition-all duration-300 shrink-0 shadow-sm">
                      <Car className="w-5 h-5 text-blue-600 animate-pulse" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-800 text-base">Transport Mode</h4>
                        <span className="text-[9px] font-black uppercase tracking-wider text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded-md border border-blue-200/50">Eco travel</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 font-medium">Sustainable travel details</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300 shrink-0 relative z-10" />
                </button>

                {/* Plantation Form */}
                <button onClick={() => router.push('/submit/plantation-form')} className="p-5 bg-white/60 hover:bg-white border border-green-100 hover:border-green-400/50 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_25px_rgba(34,197,94,0.06)] hover:-translate-y-0.5 group flex items-center justify-between w-full relative overflow-hidden cursor-pointer shadow-sm">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-green-50/40 rounded-full blur-xl pointer-events-none group-hover:bg-green-50/70 transition-colors" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-green-50 rounded-xl border border-green-100 flex items-center justify-center group-hover:bg-green-100 group-hover:scale-105 transition-all duration-300 shrink-0 shadow-sm">
                      <Trees className="w-5 h-5 text-green-700 animate-pulse" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-800 text-base">Tree Plantation</h4>
                        <span className="text-[9px] font-black uppercase tracking-wider text-green-700 bg-green-100/60 px-1.5 py-0.5 rounded-md border border-green-200/50">2x Rewards</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 font-medium">Grow the planet logs</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-700 group-hover:translate-x-1 transition-all duration-300 shrink-0 relative z-10" />
                </button>

                {/* Purchase Form */}
                <button onClick={() => router.push('/submit/purchase-form')} className="p-5 bg-white/60 hover:bg-white border border-purple-100 hover:border-purple-400/50 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_25px_rgba(168,85,247,0.06)] hover:-translate-y-0.5 group flex items-center justify-between w-full relative overflow-hidden cursor-pointer shadow-sm sm:col-span-2">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-purple-50/40 rounded-full blur-xl pointer-events-none group-hover:bg-purple-50/70 transition-colors" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-center group-hover:bg-purple-100 group-hover:scale-105 transition-all duration-300 shrink-0 shadow-sm">
                      <ShoppingCart className="w-5 h-5 text-purple-600 animate-pulse" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-800 text-base">Eco Purchase</h4>
                        <span className="text-[9px] font-black uppercase tracking-wider text-purple-700 bg-purple-100/60 px-1.5 py-0.5 rounded-md border border-purple-200/50">Blockchain Verified</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 font-medium">Solar panels, EV, & green purchases</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300 shrink-0 relative z-10" />
                </button>
              </div>
            </div>

            {/* Impact Stats Card */}
            <div className="bg-emerald-50/45 backdrop-blur-xl rounded-[2rem] border border-emerald-500/20 p-6 sm:p-8 shadow-[0_15px_50px_rgba(27,94,32,0.04)] transition-all duration-300 hover:shadow-[0_20px_60px_rgba(27,94,32,0.06)]">
              <h3 className="text-2xl font-black text-emerald-950 mb-2 flex items-center gap-2">
                <Leaf className="w-6 h-6 text-emerald-600" />
                Your Environmental Impact
              </h3>
              <p className="text-gray-600 text-sm mb-6 font-semibold">Track your cumulative sustainability contributions</p>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center p-5 bg-gradient-to-br from-emerald-50/50 to-teal-50/10 hover:from-emerald-50 hover:to-teal-50 border border-emerald-100/60 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-default">
                  <div className="w-10 h-10 bg-emerald-100/80 rounded-full flex items-center justify-center mb-3 shadow-sm">
                    <Award className="w-5 h-5 text-emerald-700" />
                  </div>
                  <p className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-850">12</p>
                  <p className="text-[10px] font-extrabold text-green-700 mt-1 uppercase tracking-wider">Submissions</p>
                </div>
                <div className="flex flex-col items-center text-center p-5 bg-gradient-to-br from-green-50/50 to-emerald-50/10 hover:from-green-50 hover:to-emerald-50 border border-green-100/60 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-default">
                  <div className="w-10 h-10 bg-green-100/80 rounded-full flex items-center justify-center mb-3 shadow-sm">
                    <Leaf className="w-5 h-5 text-green-700" />
                  </div>
                  <p className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-emerald-850">847 kg</p>
                  <p className="text-[10px] font-extrabold text-green-700 mt-1 uppercase tracking-wider">CO₂ Saved</p>
                </div>
                <div className="flex flex-col items-center text-center p-5 bg-gradient-to-br from-teal-50/50 to-lime-50/10 hover:from-teal-50 hover:to-lime-50 border border-teal-100/60 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-default">
                  <div className="w-10 h-10 bg-teal-100/80 rounded-full flex items-center justify-center mb-3 shadow-sm">
                    <Trees className="w-5 h-5 text-teal-700" />
                  </div>
                  <p className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-700 to-lime-850">23</p>
                  <p className="text-[10px] font-extrabold text-green-700 mt-1 uppercase tracking-wider">Trees Planted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="relative z-10 w-full">
        <GraphComponent />
      </div>

      {/* Common Footer */}
      <Footer />
    </div>
  );
}