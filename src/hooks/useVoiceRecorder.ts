'use client';

import { useState, useRef, useCallback } from 'react';

type RecordingState = 'idle' | 'recording' | 'processing';

export function useVoiceRecorder() {
  const [state, setState] = useState<RecordingState>('idle');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setState('recording');
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current) {
        reject(new Error('No recording in progress'));
        return;
      }

      const mediaRecorder = mediaRecorderRef.current;

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        
        // Stop all tracks
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        
        setState('idle');
        resolve(blob);
      };

      mediaRecorder.onerror = (event) => {
        reject(event);
      };

      mediaRecorder.stop();
    });
  }, []);

  const setProcessing = useCallback(() => {
    setState('processing');
  }, []);

  return {
    state,
    startRecording,
    stopRecording,
    setProcessing,
    isRecording: state === 'recording',
    isProcessing: state === 'processing',
  };
}
