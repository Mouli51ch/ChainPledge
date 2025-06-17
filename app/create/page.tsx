"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Coins, Lightbulb, Wallet, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { GlassCard } from "@/components/ui/glass-card"
import { Navigation } from "@/components/navigation"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Aptos, Network } from '@aptos-labs/ts-sdk';

const motivationalSuggestions = [
  "💪 Exercise for 30 minutes daily",
  "📚 Read one book per month",
  "🧘 Meditate for 10 minutes daily",
  "💧 Drink 8 glasses of water daily",
  "🌅 Wake up at 6 AM every day",
  "📱 No social media for 1 hour before bed",
  "🥗 Eat healthy meals for a week",
  "💻 Learn a new skill for 1 hour daily",
]

function toHexString(byteArray: Uint8Array) {
  return '0x' + Array.from(byteArray, (b) => b.toString(16).padStart(2, '0')).join('');
}

const aptos = new Aptos({ network: Network.DEVNET });

export default function CreatePledge() {
  const [formData, setFormData] = useState({
    description: "",
    deadline: "",
    stakeAmount: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { account, signAndSubmitTransaction, connected } = useWallet();

  // Debug logging for wallet state changes
  useEffect(() => {
    console.log('CreatePledge - WALLET STATE CHANGE DETECTED:', { connected, account, hasAccount: !!account });
    if (connected && account) {
      console.log('Wallet successfully connected with account:', account.address?.toString());
    } else if (!connected && account) {
      console.warn('Wallet is not marked as connected, but account exists.', account.address?.toString());
    } else if (connected && !account) {
      console.warn('Wallet is marked as connected, but account is null.');
    }
  }, [connected, account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    console.log('=== PLEDGE CREATION DEBUG ===');
    console.log('Submit attempt - Wallet state:', { 
      connected, 
      account, 
      hasAccount: !!account, 
      signAndSubmitTransactionType: typeof signAndSubmitTransaction,
      accountAddress: account?.address?.toString()
    });

    if (!connected || !account || typeof signAndSubmitTransaction !== 'function') {
      console.error('Wallet not ready:', { connected, hasAccount: !!account, hasSignFunction: typeof signAndSubmitTransaction === 'function' });
      toast({ title: "Please connect your wallet first." });
      setIsSubmitting(false);
      return;
    }

    // Convert address to hex string if needed
    let userAddress = '';
    if (account.address && account.address.data) {
      userAddress = toHexString(account.address.data);
    } else if (typeof account.address === 'string') {
      userAddress = account.address;
    }

    console.log('User address:', userAddress);
    console.log('Form data:', formData);

    const payload = {
      type: "entry_function_payload",
      function: "0xe5ef0bea5d9b07a1e45a83f76545a8d68e52ee5fcf0f02aa91c23aea9a85c5ef::pledge::create_pledge",
      arguments: [
        formData.description,
        Number(formData.stakeAmount) * 1e8, // APT to Octas
        Math.floor(new Date(formData.deadline).getTime() / 1000),
      ],
      type_arguments: [],
    };

    console.log('Transaction payload:', payload);
    console.log('Stake amount in octas:', Number(formData.stakeAmount) * 1e8);
    console.log('Deadline timestamp:', Math.floor(new Date(formData.deadline).getTime() / 1000));

    if (!payload || typeof payload !== 'object' || !('function' in payload)) {
      console.error('Invalid payload structure:', payload);
      toast({ title: "Invalid transaction payload." });
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Submitting transaction...');
      const tx = await signAndSubmitTransaction(payload);
      console.log('Transaction submitted successfully:', tx);
      console.log('Transaction hash:', tx.hash);
      
      console.log('Waiting for transaction confirmation...');
      await aptos.waitForTransaction({ transactionHash: tx.hash });
      console.log('Transaction confirmed on blockchain');
      
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "Pledge Created Successfully! 🎉",
        description: "Your commitment is now live on the blockchain.",
      });
      setTimeout(() => {
        router.push("/pledges");
      }, 2000);
    } catch (e: any) {
      console.error('Transaction failed:', e);
      console.error('Error details:', {
        message: e.message,
        name: e.name,
        stack: e.stack,
        code: e.code
      });
      setIsSubmitting(false);
      toast({ 
        title: "Transaction failed", 
        description: e.message || "Unknown error occurred" 
      });
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setFormData((prev) => ({ ...prev, description: suggestion }))
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-bounce mb-8">
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Pledge Created!</h1>
            <p className="text-xl text-gray-300 mb-8">
              Your commitment is now secured on the Aptos blockchain. Time to make it happen! 💪
            </p>
            <div className="animate-pulse">
              <p className="text-indigo-400">Redirecting to your pledges...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-gradient mb-4">Create Your Pledge</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Make a commitment that matters. Stake your APT tokens and turn your goals into reality.
            </p>
          </div>

          {/* Wallet Status Display */}
          <div className="mb-6 text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              connected ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              <Wallet className="w-4 h-4 mr-2" />
              {connected ? `Connected: ${account?.address?.toString().slice(0, 6)}...${account?.address?.toString().slice(-4)}` : 'Wallet Not Connected'}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <GlassCard>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">What's your commitment? *</label>
                    <Textarea
                      placeholder="Describe your goal in detail... (e.g., Exercise for 30 minutes daily for the next 30 days)"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      className="min-h-[120px] bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Deadline *
                      </label>
                      <Input
                        type="datetime-local"
                        value={formData.deadline}
                        onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
                        className="bg-slate-800/50 border-slate-600 text-white focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Coins className="w-4 h-4 inline mr-2" />
                        Stake Amount (APT) *
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.1"
                        placeholder="10.00"
                        value={formData.stakeAmount}
                        onChange={(e) => setFormData((prev) => ({ ...prev, stakeAmount: e.target.value }))}
                        className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !connected}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex-1 animate-glow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating Pledge...
                        </>
                      ) : !connected ? (
                        "Connect Wallet to Create Pledge"
                      ) : (
                        "Create Pledge"
                      )}
                    </Button>
                  </div>
                </form>
              </GlassCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <GlassCard>
                <div className="flex items-center mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-400 mr-2" />
                  <h3 className="text-lg font-semibold text-white">Need Inspiration?</h3>
                </div>
                <div className="space-y-2">
                  {motivationalSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left p-3 rounded-lg bg-slate-800/30 hover:bg-slate-700/50 text-gray-300 hover:text-white transition-all duration-200 text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="text-lg font-semibold text-white mb-4">💡 Pro Tips</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    Be specific with your commitment
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    Set realistic deadlines
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    Choose a meaningful stake amount
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    Remember: failure means losing your stake
                  </li>
                </ul>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
