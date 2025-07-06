-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL,
  location VARCHAR(100) NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  interests TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matches table
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_matches_user1 ON matches(user1_id);
CREATE INDEX idx_matches_user2 ON matches(user2_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Insert dummy data
INSERT INTO users (name, age, location, bio, avatar_url, interests) VALUES
('Alice Johnson', 28, 'New York, NY', 'Love hiking, photography, and trying new restaurants. Looking for someone who shares my passion for adventure!', '/placeholder.svg?height=200&width=200', ARRAY['hiking', 'photography', 'food', 'travel']),
('Bob Smith', 32, 'Los Angeles, CA', 'Software engineer by day, musician by night. Always up for a good conversation about tech or music.', '/placeholder.svg?height=200&width=200', ARRAY['music', 'technology', 'coding', 'coffee']),
('Carol Davis', 26, 'Chicago, IL', 'Yoga instructor and wellness enthusiast. Seeking someone who values health and mindfulness.', '/placeholder.svg?height=200&width=200', ARRAY['yoga', 'wellness', 'meditation', 'nature']),
('David Wilson', 30, 'Austin, TX', 'Entrepreneur and dog lover. My golden retriever Max is my best friend and co-pilot in life!', '/placeholder.svg?height=200&width=200', ARRAY['business', 'dogs', 'fitness', 'reading']),
('Emma Brown', 29, 'Seattle, WA', 'Artist and coffee connoisseur. I paint landscapes and love exploring new coffee shops around the city.', '/placeholder.svg?height=200&width=200', ARRAY['art', 'coffee', 'painting', 'culture']);

-- Insert dummy matches (assuming first user is the current user)
INSERT INTO matches (user1_id, user2_id, match_score, status) 
SELECT 
  (SELECT id FROM users LIMIT 1),
  u.id,
  FLOOR(RANDOM() * 40 + 60)::INTEGER,
  CASE 
    WHEN RANDOM() < 0.3 THEN 'accepted'
    WHEN RANDOM() < 0.6 THEN 'pending'
    ELSE 'declined'
  END
FROM users u 
WHERE u.id != (SELECT id FROM users LIMIT 1);

-- Insert dummy messages
INSERT INTO messages (sender_id, receiver_id, content)
SELECT 
  CASE WHEN RANDOM() < 0.5 THEN (SELECT id FROM users LIMIT 1) ELSE u.id END,
  CASE WHEN RANDOM() < 0.5 THEN u.id ELSE (SELECT id FROM users LIMIT 1) END,
  CASE 
    WHEN RANDOM() < 0.2 THEN 'Hey! How are you doing?'
    WHEN RANDOM() < 0.4 THEN 'I saw your profile and we have so much in common!'
    WHEN RANDOM() < 0.6 THEN 'Would you like to grab coffee sometime?'
    WHEN RANDOM() < 0.8 THEN 'Thanks for the match! Looking forward to chatting.'
    ELSE 'Hope you''re having a great day!'
  END
FROM users u 
WHERE u.id != (SELECT id FROM users LIMIT 1)
AND RANDOM() < 0.7;
