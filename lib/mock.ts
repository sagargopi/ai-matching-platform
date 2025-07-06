export const mockUser = {
  id: "00000000-0000-0000-0000-000000000000",
  name: "Demo User",
  age: 29,
  location: "Demo City",
  bio: "👋 I’m a mock profile because Supabase isn’t configured yet.",
  avatar_url: "/placeholder.svg?height=200&width=200",
  interests: ["demo", "mock-data", "preview"],
}

export const mockMatches = Array.from({ length: 5 }).map((_, i) => ({
  id: `match-${i}`,
  user1_id: mockUser.id,
  user2_id: `user-${i}`,
  match_score: Math.floor(Math.random() * 41 + 60),
  status: "pending",
  created_at: new Date().toISOString(),
  user: {
    ...mockUser,
    id: `user-${i}`,
    name: `Match ${i + 1}`,
  },
}))

export const mockMessages = [
  {
    id: "msg-1",
    sender_id: mockMatches[0].user2_id,
    receiver_id: mockUser.id,
    content: "Hi there 👋 (mock message)",
    created_at: new Date().toISOString(),
    sender: mockMatches[0].user,
  },
]
