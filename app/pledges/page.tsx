"use client"

import { useState } from "react"
import { Calendar, Coins, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GlassCard } from "@/components/ui/glass-card"
import { Navigation } from "@/components/navigation"
import { PledgeDetailsModal } from "@/components/pledge-details-modal"

interface Pledge {
  id: string
  description: string
  deadline: string
  stakeAmount: number
  status: "ongoing" | "completed" | "missed"
  createdAt: string
  completedAt?: string
}

const mockPledges: Pledge[] = [
  {
    id: "1",
    description: "💪 Exercise for 30 minutes daily for the next 30 days",
    deadline: "2024-02-15T23:59:59",
    stakeAmount: 25.5,
    status: "ongoing",
    createdAt: "2024-01-15T10:00:00",
  },
  {
    id: "2",
    description: '📚 Read "Atomic Habits" by James Clear',
    deadline: "2024-01-30T23:59:59",
    stakeAmount: 15.0,
    status: "completed",
    createdAt: "2024-01-01T09:00:00",
    completedAt: "2024-01-28T14:30:00",
  },
  {
    id: "3",
    description: "🧘 Meditate for 10 minutes daily for 21 days",
    deadline: "2024-01-20T23:59:59",
    stakeAmount: 10.0,
    status: "missed",
    createdAt: "2023-12-30T08:00:00",
  },
  {
    id: "4",
    description: "💧 Drink 8 glasses of water daily for 2 weeks",
    deadline: "2024-02-28T23:59:59",
    stakeAmount: 20.0,
    status: "ongoing",
    createdAt: "2024-02-01T07:00:00",
  },
]

export default function MyPledges() {
  const [selectedPledge, setSelectedPledge] = useState<Pledge | null>(null)
  const [filter, setFilter] = useState<"all" | "ongoing" | "completed" | "missed">("all")

  const filteredPledges = mockPledges.filter((pledge) => filter === "all" || pledge.status === filter)

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "missed":
        return <XCircle className="w-4 h-4" />
      case "ongoing":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getDaysRemaining = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-gradient mb-4">My Pledges</h1>
            <p className="text-xl text-gray-300">Track your commitments and celebrate your victories</p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            {[
              { key: "all", label: "All Pledges" },
              { key: "ongoing", label: "Ongoing" },
              { key: "completed", label: "Completed" },
              { key: "missed", label: "Missed" },
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                onClick={() => setFilter(key as any)}
                className={
                  filter === key
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                    : "border-slate-600 text-gray-300 hover:bg-slate-700/50"
                }
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Pledges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPledges.map((pledge) => (
              <GlassCard key={pledge.id} hover className="cursor-pointer" onClick={() => setSelectedPledge(pledge)}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <Badge className={`${getStatusColor(pledge.status)} border`}>
                      {getStatusIcon(pledge.status)}
                      <span className="ml-1 capitalize">{pledge.status}</span>
                    </Badge>
                    <div className="text-right">
                      <div className="flex items-center text-indigo-400">
                        <Coins className="w-4 h-4 mr-1" />
                        <span className="font-semibold">{pledge.stakeAmount} APT</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-white font-medium leading-relaxed line-clamp-3">{pledge.description}</p>
                  </div>

                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Deadline: {formatDate(pledge.deadline)}</span>
                    </div>

                    {pledge.status === "ongoing" && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>
                          {getDaysRemaining(pledge.deadline) > 0
                            ? `${getDaysRemaining(pledge.deadline)} days remaining`
                            : "Overdue"}
                        </span>
                      </div>
                    )}
                  </div>

                  {pledge.status === "ongoing" && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle mark as completed
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Completed
                    </Button>
                  )}

                  {pledge.status === "completed" && pledge.completedAt && (
                    <div className="text-sm text-green-400 text-center">
                      ✅ Completed on {formatDate(pledge.completedAt)}
                    </div>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>

          {filteredPledges.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-semibold text-white mb-2">No pledges found</h3>
              <p className="text-gray-400 mb-8">
                {filter === "all"
                  ? "You haven't created any pledges yet. Start your journey!"
                  : `No ${filter} pledges to show.`}
              </p>
              <Button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                onClick={() => (window.location.href = "/create")}
              >
                Create Your First Pledge
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Pledge Details Modal */}
      {selectedPledge && (
        <PledgeDetailsModal pledge={selectedPledge} isOpen={!!selectedPledge} onClose={() => setSelectedPledge(null)} />
      )}
    </div>
  )
}
