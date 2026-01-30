export interface Quote {
  text: string
  author: string
}

export const quotes: Quote[] = [
  // Marcus Aurelius
  {
    text: "The impediment to action advances action. What stands in the way becomes the way.",
    author: "Marcus Aurelius"
  },
  {
    text: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius"
  },
  {
    text: "Waste no more time arguing about what a good man should be. Be one.",
    author: "Marcus Aurelius"
  },
  {
    text: "The soul becomes dyed with the color of its thoughts.",
    author: "Marcus Aurelius"
  },
  {
    text: "Very little is needed to make a happy life; it is all within yourself.",
    author: "Marcus Aurelius"
  },
  {
    text: "Accept the things to which fate binds you, and love the people with whom fate brings you together.",
    author: "Marcus Aurelius"
  },
  {
    text: "It is not death that a man should fear, but he should fear never beginning to live.",
    author: "Marcus Aurelius"
  },
  {
    text: "Never value anything as profitable that compels you to break your promise, lose your self-respect.",
    author: "Marcus Aurelius"
  },
  
  // Sun Tzu
  {
    text: "Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.",
    author: "Sun Tzu"
  },
  {
    text: "In the midst of chaos, there is also opportunity.",
    author: "Sun Tzu"
  },
  {
    text: "Know yourself and you will win all battles.",
    author: "Sun Tzu"
  },
  {
    text: "The supreme art of war is to subdue the enemy without fighting.",
    author: "Sun Tzu"
  },
  {
    text: "Appear weak when you are strong, and strong when you are weak.",
    author: "Sun Tzu"
  },
  {
    text: "Let your plans be dark and impenetrable as night, and when you move, fall like a thunderbolt.",
    author: "Sun Tzu"
  },
  {
    text: "Opportunities multiply as they are seized.",
    author: "Sun Tzu"
  },
  {
    text: "The greatest victory is that which requires no battle.",
    author: "Sun Tzu"
  },
  
  // Bonus tactical quotes
  {
    text: "Discipline equals freedom.",
    author: "Jocko Willink"
  },
  {
    text: "Under pressure, you don't rise to the occasion, you sink to the level of your training.",
    author: "Navy SEAL Saying"
  },
]

export function getRandomQuote(): Quote {
  return quotes[Math.floor(Math.random() * quotes.length)]
}

export function getDailyQuote(): Quote {
  // Use date as seed for consistent daily quote
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  return quotes[seed % quotes.length]
}
