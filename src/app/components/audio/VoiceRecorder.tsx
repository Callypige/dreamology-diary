"use client";
import React, { useState, useRef, useEffect } from "react";

interface VoiceRecorderProps {
  onAudioChange: (audioUrl: string) => void; 
  existingAudioUrl?: string;
  dreamId?: string;
}

export default function VoiceRecorder({ 
  onAudioChange, 
  existingAudioUrl, 
  dreamId
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingAudioUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(!!existingAudioUrl);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer for recording duration
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const uploadAudio = async (audioBlob: Blob) => {
    setIsUploading(true);
    const formData = new FormData();
    const fileName = `dream_audio_${dreamId || Date.now()}.webm`;
    formData.append('audio', audioBlob, fileName);
    
    if (dreamId) {
      formData.append('dreamId', dreamId);
    }
    
    try {
      const response = await fetch('/api/upload/audio', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.audioUrl;
    } catch (error) {
      console.error('Audio upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setRecordingTime(0);
      audioChunksRef.current = [];
      
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(audioBlob);
        
        // Create temporary URL for immediate playback
        const tempUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(tempUrl);
        setHasRecording(true);
        
        try {
          const serverAudioUrl = await uploadAudio(audioBlob);
          setAudioUrl(serverAudioUrl);
          onAudioChange(serverAudioUrl);
        } catch (error) {
          alert('Erreur lors de la sauvegarde audio');
          console.error(error);
        }
        
        // Clean up stream
        streamRef.current?.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
    } catch (error) {
      console.error('Microphone error:', error);
      alert('Impossible d\'accéder au microphone');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };

  const playRecording = () => {
    if (audioUrl && audioElementRef.current) {
      setIsPlaying(true);
      audioElementRef.current.play();
    }
  };

  const pauseRecording = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    if (audioUrl && audioUrl.startsWith('blob:')) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setHasRecording(false);
    setIsPlaying(false);
    onAudioChange("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="my-4">
      <h2 className="text-xl font-semibold mb-4 text-white">🎙️ Voice Recorder</h2>
      
      {/* Instructions */}
      <div className="mb-4 p-3 bg-slate-800 rounded-lg border border-slate-600">
        <p className="text-gray-300 text-sm">
          Enregistrez une note vocale pour votre rêve. 
          {existingAudioUrl ? " Vous pouvez remplacer l'enregistrement existant." : ""}
        </p>
      </div>

      {/* Recording Status */}
      {isRecording && (
        <div className="mb-4 p-3 bg-red-600 text-white rounded-lg flex items-center gap-2">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <span className="font-semibold">Enregistrement en cours... {formatTime(recordingTime)}</span>
        </div>
      )}

      {/* Upload Status */}
      {isUploading && (
        <div className="mb-4 p-3 bg-blue-600 text-white rounded-lg flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Upload de l'audio...</span>
        </div>
      )}

      {/* Success Status */}
      {hasRecording && !isUploading && !isRecording && (
        <div className="mb-4 p-3 bg-green-600 text-white rounded-lg flex items-center gap-2">
          <span>✅</span>
          <span>Audio enregistré et sauvegardé avec succès !</span>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center space-x-3 flex-wrap gap-2 mb-4">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            disabled={isUploading}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors"
          >
            🎤 Commencer l'enregistrement
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            ⏹️ Arrêter l'enregistrement
          </button>
        )}

        {hasRecording && !isRecording && (
          <>
            {!isPlaying ? (
              <button
                type="button"
                onClick={playRecording}
                disabled={isUploading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors"
              >
                ▶️ Lire
              </button>
            ) : (
              <button
                type="button"
                onClick={pauseRecording}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                ⏸️ Pause
              </button>
            )}
            
            <button
              type="button"
              onClick={deleteRecording}
              disabled={isUploading}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors"
            >
              🗑️ Supprimer
            </button>
          </>
        )}
      </div>

      {/* Audio Player */}
      {audioUrl && (
        <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
          <h3 className="text-lg font-semibold text-white mb-3">Audio Note</h3>
          <audio 
            ref={audioElementRef}
            controls 
            className="w-full mb-2"
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={audioUrl} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
          <p className="text-sm text-gray-400">
            {isUploading ? "Upload en cours..." : "Audio enregistré et prêt à être sauvegardé avec votre rêve."}
          </p>
        </div>
      )}
    </section>
  );
}