"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, X, MapPin } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface MatchRecommendationsProps {
  matches: any[]
  onRefresh: () => void
}

export default function MatchRecommendations({ matches, onRefresh }: MatchRecommendationsProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleMatchAction = async (matchId: string, action: "accepted" | "declined") => {
    try {
      setLoading(true)
      const { error } = await supabase.from("matches").update({ status: action }).eq("id", matchId)

      if (error) throw error

      toast({
        title: "Success",
        description: `Match ${action} successfully`,
      })

      onRefresh()
    } catch (error) {
      console.error("Error updating match:", error)
      toast({
        title: "Error",
        description: "Failed to update match",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const pendingMatches = matches.filter((m) => m.status === "pending")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingMatches.map((match) => (
              <Card key={match.id} className="overflow-hidden">
                <div className="relative">
                  <Avatar className="w-full h-48 rounded-none">
                    <AvatarImage
                      src={match.user.avatar_url || "/placeholder.svg"}
                      className="object-cover w-full h-full"
                    />
                    <AvatarFallback className="w-full h-full text-4xl">{match.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Badge className="absolute top-2 right-2 bg-green-500">{match.match_score}% match</Badge>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">
                      {match.user.name}, {match.user.age}
                    </h3>

                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {match.user.location}
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">{match.user.bio}</p>

                    <div className="flex flex-wrap gap-1">
                      {match.user.interests?.slice(0, 3).map((interest: string) => (
                        <Badge key={interest} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleMatchAction(match.id, "declined")}
                      disabled={loading}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Pass
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600"
                      onClick={() => handleMatchAction(match.id, "accepted")}
                      disabled={loading}
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      Like
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {pendingMatches.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No new matches available. Check back later!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
