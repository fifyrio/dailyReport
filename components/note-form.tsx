"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X, Star, Sparkles, Loader2 } from "lucide-react"
import { VoiceInput } from "@/components/voice-input"
import type { Note } from "@/lib/types"

interface NoteFormProps {
  note?: Note | null
  onSubmit: (note: Omit<Note, "id" | "createdAt">) => void
  onCancel: () => void
}

const noteTypes = ["原则卡", "案例卡", "概念卡", "方法卡", "灵感卡"]

export function NoteForm({ note, onSubmit, onCancel }: NoteFormProps) {
  const [rawContent, setRawContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showDetailForm, setShowDetailForm] = useState(false)

  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [threeSeconds, setThreeSeconds] = useState("")
  const [fifteenSeconds, setFifteenSeconds] = useState("")
  const [keywords, setKeywords] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState("")
  const [actions, setActions] = useState(["", "", ""])
  const [source, setSource] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [type, setType] = useState("原则卡")
  const [level, setLevel] = useState(3)

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setSummary(note.summary)
      setThreeSeconds(note.threeMetrics.threeSeconds)
      setFifteenSeconds(note.threeMetrics.fifteenSeconds)
      setKeywords(note.threeMetrics.keywords)
      setActions(note.threeActions.length === 3 ? note.threeActions : [...note.threeActions, "", ""].slice(0, 3))
      setSource(note.source)
      setTags(note.tags)
      setType(note.type)
      setLevel(note.level)
      setShowDetailForm(true)
    }
  }, [note])

  const handleGenerateNote = async () => {
    if (!rawContent.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: rawContent }),
      })

      if (!response.ok) {
        throw new Error("生成失败")
      }

      const data = await response.json()

      // 填充所有字段
      setTitle(data.title || "")
      setSummary(data.summary || "")
      setThreeSeconds(data.threeMetrics?.threeSeconds || "")
      setFifteenSeconds(data.threeMetrics?.fifteenSeconds || "")
      setKeywords(data.threeMetrics?.keywords || [])
      setActions(
        data.threeActions?.length === 3 ? data.threeActions : [...(data.threeActions || []), "", ""].slice(0, 3),
      )
      setTags(data.tags || [])
      setType(data.type || "原则卡")
      setLevel(data.level || 3)
      setSource("原创")
      setShowDetailForm(true)
    } catch (error) {
      console.error("Generate note error:", error)
      alert("AI生成失败，请稍后重试")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()])
      setKeywordInput("")
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleActionChange = (index: number, value: string) => {
    const newActions = [...actions]
    newActions[index] = value
    setActions(newActions)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      summary,
      threeMetrics: {
        threeSeconds,
        fifteenSeconds,
        keywords,
      },
      threeActions: actions.filter((a) => a.trim()),
      source,
      tags,
      type,
      level,
    })
  }

  const handleVoiceTranscription = (text: string) => {
    setRawContent((prev) => (prev ? `${prev}\n${text}` : text))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" onClick={onCancel} className="gap-2 mb-6">
        <ArrowLeft className="h-4 w-4" />
        取消
      </Button>

      {!showDetailForm && !note && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              AI智能生成笔记
            </CardTitle>
            <div className="flex items-center justify-between">
              <CardDescription>只需输入你想记录的内容，AI将自动生成结构化的复盘笔记</CardDescription>
              <VoiceInput onTranscription={handleVoiceTranscription} disabled={isGenerating} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rawContent" className="text-base font-medium">
                输入你的想法或学习内容
              </Label>
              <Textarea
                id="rawContent"
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                placeholder="例如：今天学到了一个重要的道理，公开工作可以扩大接触面和建立信任，分享知识可以逼迫自己学习和提升地位，认真做事可以产出可交换的价值。这三件事相互促进，形成正向循环..."
                rows={6}
                className="text-base"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleGenerateNote}
                disabled={isGenerating || !rawContent.trim()}
                className="flex-1 gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    AI正在分析生成...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    AI智能生成
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowDetailForm(true)}>
                手动填写
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 详细表单 - 只在AI生成后或手动填写时显示 */}
      {showDetailForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{note ? "编辑笔记" : "确认笔记内容"}</CardTitle>
            {!note && <CardDescription>AI已生成以下内容，你可以修改后保存</CardDescription>}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 标题 */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-medium">
                  标题 *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="输入笔记标题"
                  required
                  className="text-lg"
                />
              </div>

              {/* 一句话要点 */}
              <div className="space-y-2">
                <Label htmlFor="summary" className="text-base font-medium">
                  一句话要点 *
                </Label>
                <Textarea
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="用一句话概括核心内容"
                  required
                  rows={2}
                />
              </div>

              {/* 三指标 */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium text-lg">三指标</h3>

                <div className="space-y-2">
                  <Label htmlFor="threeSeconds">3秒概括</Label>
                  <Input
                    id="threeSeconds"
                    value={threeSeconds}
                    onChange={(e) => setThreeSeconds(e.target.value)}
                    placeholder="用简短关键词概括，如：公开工作 | 分享知识 | 认真做事"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fifteenSeconds">15秒展开</Label>
                  <Textarea
                    id="fifteenSeconds"
                    value={fifteenSeconds}
                    onChange={(e) => setFifteenSeconds(e.target.value)}
                    placeholder="详细解释每个要点的含义和关联"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>共鸣词</Label>
                  <div className="flex gap-2">
                    <Input
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      placeholder="添加关键词"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddKeyword())}
                    />
                    <Button type="button" variant="outline" onClick={handleAddKeyword}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="gap-1">
                          {keyword}
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(keyword)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 三步动作 */}
              <div className="space-y-3">
                <Label className="text-base font-medium">三步动作</Label>
                {actions.map((action, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-medium flex items-center justify-center">
                      {index + 1}
                    </span>
                    <Input
                      value={action}
                      onChange={(e) => handleActionChange(index, e.target.value)}
                      placeholder={`第 ${index + 1} 步行动`}
                    />
                  </div>
                ))}
              </div>

              {/* 来源/引用 */}
              <div className="space-y-2">
                <Label htmlFor="source">来源/引用</Label>
                <Input
                  id="source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="原创 / 书名 / 作者 / 链接等"
                />
              </div>

              {/* 标签 */}
              <div className="space-y-2">
                <Label>标签</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="添加标签"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* 类型 */}
              <div className="space-y-2">
                <Label>类型</Label>
                <div className="flex flex-wrap gap-2">
                  {noteTypes.map((t) => (
                    <Button
                      key={t}
                      type="button"
                      variant={type === t ? "default" : "outline"}
                      size="sm"
                      onClick={() => setType(t)}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 素材等级 */}
              <div className="space-y-2">
                <Label>素材等级</Label>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setLevel(i + 1)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          i < level ? "fill-accent text-accent" : "text-muted-foreground/30 hover:text-accent/50"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">{level}/5</span>
                </div>
              </div>

              {/* 提交按钮 */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  {note ? "保存修改" : "创建笔记"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (note) {
                      onCancel()
                    } else {
                      setShowDetailForm(false)
                    }
                  }}
                >
                  {note ? "取消" : "返回重新生成"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
