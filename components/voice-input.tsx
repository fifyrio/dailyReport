"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square, Languages } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface VoiceInputProps {
  onTranscription: (text: string) => void
  disabled?: boolean
}

export function VoiceInput({ onTranscription, disabled }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [language, setLanguage] = useState<"zh" | "en">("zh")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" })
        stream.getTracks().forEach((track) => track.stop())
        await transcribeAudio(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("[v0] Failed to start recording:", error)
      alert("无法访问麦克风，请检查权限设置")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true)
    try {
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.webm")
      formData.append("language", language)

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Transcription failed")
      }

      const data = await response.json()
      if (data.text) {
        onTranscription(data.text)
      }
    } catch (error) {
      console.error("[v0] Transcription error:", error)
      alert("语音转文字失败，请重试")
    } finally {
      setIsTranscribing(false)
      setRecordingTime(0)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* 语言选择 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isRecording || isTranscribing}
            className="gap-1.5 text-muted-foreground bg-transparent"
          >
            <Languages className="h-4 w-4" />
            {language === "zh" ? "中文" : "EN"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setLanguage("zh")}>中文</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 录音按钮 */}
      {isRecording ? (
        <Button type="button" variant="destructive" size="sm" onClick={stopRecording} className="gap-2 min-w-[120px]">
          <div className="relative flex items-center justify-center">
            <span className="absolute h-3 w-3 rounded-full bg-white/30 animate-ping" />
            <Square className="h-4 w-4 relative" />
          </div>
          <span className="font-mono tabular-nums">{formatTime(recordingTime)}</span>
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={startRecording}
          disabled={disabled || isTranscribing}
          className="gap-2 bg-transparent"
        >
          {isTranscribing ? (
            <>
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              转换中...
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              语音输入
            </>
          )}
        </Button>
      )}
    </div>
  )
}
