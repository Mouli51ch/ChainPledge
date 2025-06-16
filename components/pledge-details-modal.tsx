"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Coins, Clock, CheckCircle, ExternalLink, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GlassCard } from "@/components/ui/glass-card"

interface Pledge {
  id: string
  description: string
  deadline: string
  stakeAmount: number
  status: "ongoing" | "completed" | "missed"
  createdAt: string
  completedAt?: string
}

interface PledgeDetailsModalProps {
  pledge: Pledge
  isOpen: boolean
  onClose: () => void
}

export function PledgeDetailsModal({ pledge, isOpen, onClose }: PledgeDetailsModalProps) {
  const [timeRemaining, setTimeRemaining] = useState("")

  useEffect(() => {
    if (pledge.status !== "ongoing") return

    const updateCountdown = () => {
      const now = new Date().getTime()
      const deadline = new Date(pledge.deadline).getTime()
      const distance = deadline - now

      if (distance < 0) {
        setTimeRemaining("Expired")
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`)
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)

    return () => clearInterval(timer)
  }, [pledge.deadline, pledge.status])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "missed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "ongoing":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <GlassCard className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge className={`${getStatusColor(pledge.status)} border text-lg px-3 py-1`}>
                  <span className="capitalize">{pledge.status}</span>
                </Badge>
                <div className="text-right">
                  <div className="flex items-center text-indigo-400 text-lg">
                    <Coins className="w-5 h-5 mr-2" />
                    <span className="font-bold">{pledge.stakeAmount} APT</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white leading-relaxed">{pledge.description}</h2>
            </div>

            {/* Countdown Timer */}
            {pledge.status === "ongoing" && (
              <GlassCard className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-indigo-500/30">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Timer className="w-6 h-6 text-indigo-400 mr-2" />
                    <h3 className="text-lg font-semibold text-white">Time Remaining</h3>
                  </div>
                  <div className="text-3xl font-mono font-bold text-indigo-400">{timeRemaining}</div>
                </div>
              </GlassCard>
            )}

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-5 h-5 mr-3 text-indigo-400" />
                  <div>
                    <p className="text-sm text-gray-400">Created</p>
                    <p className="font-medium">{formatDate(pledge.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-300">
                  <Clock className="w-5 h-5 mr-3 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Deadline</p>
                    <p className="font-medium">{formatDate(pledge.deadline)}</p>
                  </div>
                </div>
              </div>

              {pledge.completedAt && (
                <div className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Completed</p>
                    <p className="font-medium">{formatDate(pledge.completedAt)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              {pledge.status === "ongoing" && (
                <Button
                  className="bg-green-600 hover:bg-green-700 flex-1"
                  onClick={() => {
                    // Handle mark as completed
                    onClose()
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Completed
                </Button>
              )}

              <Button
                variant="outline"
                className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-600/20"
                onClick={() => {
                  // Open Aptos Explorer
                  window.open(`https://explorer.aptoslabs.com/txn/${pledge.id}`, "_blank")
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Explorer
              </Button>
            </div>

            {/* Motivational Message */}
            {pledge.status === "ongoing" && (
              <div className="text-center p-4 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-medium">
                  💪 You've got this! Every day is a step closer to your goal.
                </p>
              </div>
            )}

            {pledge.status === "completed" && (
              <div className="text-center p-4 bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-medium">
                  🎉 Congratulations! You've successfully completed this pledge and earned back your stake!
                </p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
