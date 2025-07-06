"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, MessageCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface ChatInterfaceProps {
  messages: any[]
  currentUser: any
}

export default function ChatInterface({ messages, currentUser }: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("")
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Group messages by conversation
  const conversations = messages.reduce(
    (acc, message) => {
      const otherUserId = message.sender_id === currentUser?.id ? message.receiver_id : message.sender_id
      if (!acc[otherUserId]) {
        acc[otherUserId] = []
      }
      acc[otherUserId].push(message)
      return acc
    },
    {} as Record<string, any[]>,
  )

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !currentUser) return

    try {
      setLoading(true)
      const { error } = await supabase.from("messages").insert({
        sender_id: currentUser.id,
        receiver_id: selectedChat,
        content: newMessage.trim(),
      })

      if (error) throw error

      setNewMessage("")
      toast({
        title: "Success",
        description: "Message sent successfully",
      })
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Conversations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {Object.entries(conversations).map(([userId, userMessages]) => {
              const lastMessage = userMessages[0]
              const otherUser =
                lastMessage.sender_id === currentUser?.id
                  ? { id: userId, name: "Unknown User", avatar_url: "" }
                  : lastMessage.sender

              return (
                <div
                  key={userId}
                  className={`p-3 cursor-pointer hover:bg-gray-50 border-b ${
                    selectedChat === userId ? "bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedChat(userId)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={otherUser.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{otherUser.name}</p>
                      <p className="text-sm text-gray-500 truncate">{lastMessage.content}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{selectedChat ? "Chat" : "Select a conversation"}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[500px]">
          {selectedChat ? (
            <>
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {conversations[selectedChat]?.reverse().map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === currentUser?.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender_id === currentUser?.id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">{new Date(message.created_at).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button onClick={sendMessage} disabled={loading || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
