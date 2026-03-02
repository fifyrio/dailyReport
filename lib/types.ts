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
