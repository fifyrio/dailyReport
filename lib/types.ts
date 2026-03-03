export interface Note {
  id: string
  title: string
  summary: string
  threeMetrics: {
    threeSeconds: string
    fifteenSeconds: string
    keywords: string[]
  }
  threeActions: string[]
  source: string
  tags: string[]
  type: string
  level: number
  createdAt: string
}

export interface QuickGrowthAdvice {
  todayVsYesterday: string
  quickTips: string[]
}

export interface FullGrowthAdvice {
  todayVsYesterday: {
    comparison: string
    improvements: string[]
  }
  weeklyTrend: {
    summary: string
    strengths: string[]
    gaps: string[]
  }
  knowledgeDistribution: {
    areas: { name: string; count: number; trend: "up" | "down" | "stable" }[]
    suggestion: string
  }
  actionability: {
    score: number
    feedback: string
  }
  growthPath: {
    currentLevel: string
    nextMilestone: string
    recommendations: string[]
  }
}
