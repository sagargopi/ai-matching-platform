"use client"

import { useState, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { mockUser, mockMatches, mockMessages } from "@/lib/mock"
import DashboardOverview from "./DashboardOverview"
import MatchRecommendations from "./MatchRecommendations"
import ChatInterface from "./ChatInterface"
import UserProfile from "./UserProfile"
import AnalyticsCharts from "./AnalyticsCharts"

interface User {
  id: string
  name: string
  age: number
  location: string
  bio: string
  avatar_url: string
  interests: string[]
  match_score?: number
  last_active?: string
}

interface Match {
  id: string
  user1_id: string
  user2_id: string
  match_score: number
  status: "pending" | "accepted" | "declined"
  created_at: string
  user: User
}

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  sender: User
}

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState("overview")
  const { toast } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      if (!isSupabaseConfigured) {
        setCurrentUser(mockUser as any)
        setMatches(mockMatches as any)
        setMessages(mockMessages as any)
        toast({
          title: "Preview mode",
          description: "Using mock data. Add Supabase credentials to enable real backend.",
        })
        return
      }

      // Fetch current user (simulated as first user)
      const { data: userData, error: userError } = await supabase.from("users").select("*").limit(1).single()

      if (userError) throw userError
      setCurrentUser(userData)

      // Fetch matches
      const { data: matchData, error: matchError } = await supabase
        .from("matches")
        .select(`
          *,
          user:users!matches_user2_id_fkey(*)
        `)
        .eq("user1_id", userData.id)

      if (matchError) throw matchError
      setMatches(matchData || [])

      // Fetch recent messages
      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .select(`
          *,
          sender:users!messages_sender_id_fkey(*)
        `)
        .or(`sender_id.eq.${userData.id},receiver_id.eq.${userData.id}`)
        .order("created_at", { ascending: false })
        .limit(10)

      if (messageError) throw messageError
      setMessages(messageData || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      )
    }

    switch (activeView) {
      case "overview":
        return <DashboardOverview matches={matches} messages={messages} currentUser={currentUser} />
      case "matches":
        return <MatchRecommendations matches={matches} onRefresh={fetchDashboardData} />
      case "messages":
        return <ChatInterface messages={messages} currentUser={currentUser} />
      case "profile":
        return <UserProfile user={currentUser} onUpdate={fetchDashboardData} />
      case "analytics":
        return <AnalyticsCharts matches={matches} messages={messages} />
      default:
        return <DashboardOverview matches={matches} messages={messages} currentUser={currentUser} />
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar currentUser={currentUser} activeView={activeView} onViewChange={setActiveView} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize">{activeView}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{renderContent()}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
