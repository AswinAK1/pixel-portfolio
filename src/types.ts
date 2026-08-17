export type GameMode = 'auto' | 'manual' | 'paused' | 'gameover';

export interface Point {
  x: number;
  y: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  text?: string;
}

export interface FoodItem {
  x: number;
  y: number;
  type: 'apple' | 'gold_coin' | 'gem' | 'star';
  points: number;
  color: string;
  spawnTime: number;
}

export interface ProjectQuest {
  id: string;
  title: string;
  codeName: string;
  description: string;
  detailedLore: string;
  category: 'fullstack' | 'frontend' | 'ai' | 'tool';
  difficulty: 'Novice' | 'Adept' | 'Master' | 'Legendary';
  xpReward: number;
  tags: string[];
  features: string[];
  metrics?: string;
  liveUrl?: string;
  githubUrl?: string;
  pixelArtType: 'ai_audio' | 'game_engine' | 'mailer' | 'ecommerce' | 'shortener' | 'dashboard';
}

export interface SkillItem {
  name: string;
  level: number; // 1 to 100
  iconName: string;
  category: 'frontend' | 'backend' | 'database' | 'tools';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  description: string;
}

export interface ExperienceQuest {
  period: string;
  role: string;
  guild: string;
  location: string;
  questDescription: string[];
  unlockedLoot: string[];
  rankBadge: string;
}
