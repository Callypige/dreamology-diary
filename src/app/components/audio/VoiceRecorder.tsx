"use client";
import React, { useState, useRef } from "react";

interface VoiceRecorderProps {
  onAudioChange: (audioUrl: string) => void; 
  existingAudioUrl?: string;
  dreamId?: string; // 
}

export default function VoiceRecorder({ 
  onAudioChange, 
  existingAudioUrl, 
  dreamId // 
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingAudioUrl || null);
  const [isUploading, setIsUploading] = useState(false); // 

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
      console.error('Erreur upload audio:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      audioChunksRef.current = [];
      
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
        
        const tempUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(tempUrl);
        
        try {
          const serverAudioUrl = await uploadAudio(audioBlob);
          setAudioUrl(serverAudioUrl); 
          onAudioChange(serverAudioUrl);
        } catch (error) {
          alert('Erreur lors de la sauvegarde audio');
          console.error(error);
        }
        
        streamRef.current?.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
    } catch (error) {
      console.error('Erreur microphone:', error);
      alert('Impossible d\'accéder au microphone');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const deleteRecording = () => {
    if (audioUrl && audioUrl.startsWith('blob:')) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    onAudioChange("");
  };

  return (
    <section className="my-4">
      <h2 className="text-xl font-semibold mb-4 text-white">🎙️ Voice Recorder</h2>
      <p className="text-gray-300 mb-2">
        Enregistrez une note vocale pour votre rêve. 
        {existingAudioUrl ? " Vous pouvez remplacer l'enregistrement existant." : ""}
      </p>
      <p className="text-gray-400 mb-4">
        Cliquez sur "Start Recording" pour commencer, puis "Stop Recording" pour terminer. 
        Vous pouvez écouter et supprimer l'enregistrement si nécessaire.
      </p>
      {/* Uploading status */}
      {isUploading && (
        <div className="mb-4 p-2 bg-blue-600 text-white rounded">
          📤 Upload en cours...
        </div>
      )}
      
      <div className="flex items-center space-x-4 flex-wrap gap-2">
        <button
          type="button"
          onClick={startRecording}
          disabled={isRecording || isUploading}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isRecording ? "🔴 Recording..." : "🎤 Start Recording"}
        </button>
        <button
          type="button"
          onClick={stopRecording}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
          disabled={!isRecording}
        >
          ⏹️ Stop Recording
        </button>
        <button
          type="button"
          onClick={playRecording}
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
          disabled={!audioUrl || isUploading}
        >
          ▶️ Play Recording 
        </button>
        <button
          type="button"
          onClick={deleteRecording}
          className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
          disabled={!audioUrl || isUploading}
        >
          🗑️ Delete Recording
        </button>
      </div>
      
      {audioUrl && (
        <div className="mt-4 p-4 bg-slate-700 rounded-lg border border-slate-600">
          <h3 className="text-lg font-semibold text-white mb-2">Audio Note</h3>
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
          <p className="text-sm text-gray-400 mt-2">
            {isUploading ? "Upload en cours..." : "Audio enregistré et sauvegardé."}
          </p>
        </div>
      )}
    </section>
  );
}