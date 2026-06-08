'use client';
import React, { useState, useEffect } from "react";
import { products } from "../data/product.js";
import ProductCard from "../components/ProductCard.jsx";
import Footer from "../components/Footer.jsx";
import { useRouter } from "next/navigation";
import { ArrowLeft, Coins, Wallet, ShoppingBag } from "lucide-react";
import { ethers } from "ethers";
import { getContract } from "../../utils/contract";

const RedeemPage = () => {
  const router = useRouter();
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if wallet is already connected on load
  useEffect(() => {
    const checkWalletConnected = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
            fetchBalance(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };
    checkWalletConnected();
  }, []);

  // Fetch token balance from Sepolia contract
  const fetchBalance = async (walletAddress) => {
    try {
      const contractData = await getContract();
      const contract = contractData.contract || contractData;
      if (!contract) return;

      const bal = await contract.balanceOf(walletAddress);
      const formattedBalance = ethers.formatUnits(bal, 18);
      // Format to 2 decimal places if it is a float
      const parsedBalance = parseFloat(formattedBalance);
      setBalance(parsedBalance % 1 === 0 ? parsedBalance.toString() : parsedBalance.toFixed(2));
    } catch (error) {
      console.error("Error fetching token balance:", error);
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("MetaMask is not installed. Please install MetaMask to use Web3 features.");
      return;
    }
    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        fetchBalance(accounts[0]);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f9f6] via-[#eef7f2] to-[#e6f4f1] py-12 px-4 sm:px-6 lg:px-8 font-sans flex flex-col justify-between">
      <div className="max-w-[1400px] w-full mx-auto flex-grow">
        
        {/* Navigation & Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 w-full">
          {/* Back button */}
          <button
            onClick={() => router.push("/home")}
            className="group flex items-center gap-2 text-sm font-bold text-emerald-900 bg-white/60 hover:bg-white border border-white/80 hover:border-emerald-500/20 px-4 py-2.5 rounded-2xl shadow-sm hover:shadow transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Dashboard
          </button>

          {/* Web3 Wallet Balance Card */}
          <div className="bg-emerald-50/45 backdrop-blur-xl border border-emerald-500/20 p-3 sm:px-5 rounded-[2rem] shadow-[0_8px_30px_rgba(27,94,32,0.02)] flex items-center gap-4 transition-all duration-300">
            {account ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Connected Wallet</span>
                  <span className="text-xs font-semibold text-emerald-950">
                    {account.substring(0, 6)}...{account.substring(account.length - 4)}
                  </span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100/60 px-3 py-1.5 rounded-xl">
                  <Coins className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span className="text-sm font-black text-emerald-950">{balance} GT</span>
                </div>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all duration-300"
              >
                <Wallet className="w-4 h-4" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-100/50 border border-emerald-200/50 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-800 mb-4">
            <ShoppingBag className="w-3.5 h-3.5" />
            Sustainability Store
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-emerald-950 leading-tight mb-4">
            Shop Sustainably, <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">Support Our Planet</span>
          </h1>
          <p className="text-base text-emerald-900/70 font-semibold leading-relaxed">
            Redeem your hard-earned Green Tokens (GT) for eco-friendly products and certified merchandise from verified conservation NGOs.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-4">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RedeemPage;