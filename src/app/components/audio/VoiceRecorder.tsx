"use client";
import React, { useState, useRef } from "react";

interface VoiceRecorderProps {
  onAudioChange: (audio: Blob) => void;
  existingAudioUrl?: string;
}

export default function VoiceRecorder({ onAudioChange, existingAudioUrl }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingAudioUrl || null);

  // Refs to hold media recorder and audio chunks
  // Using useRef to avoid re-creating these on every render
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setIsRecording(true);
    audioChunksRef.current = [];
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream; // Store the stream to stop it later

    // If there's an existing recording, stop it
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      setAudioBlob(audioBlob);
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      onAudioChange(audioBlob);
      // Clean up the stream
      streamRef.current?.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach(track => track.stop());
  };

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  return (
    <section className="my-4">
      <h2 className="text-xl font-semibold mb-4 text-white">🎙️ Voice Recorder</h2>
      <div className="flex items-center space-x-4 flex-wrap gap-2">
        <button
          onClick={startRecording}
          disabled={isRecording}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isRecording ? "🔴 Recording..." : "🎤 Start Recording"}
        </button>
        <button
          onClick={stopRecording}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
          disabled={!isRecording}
        >
          ⏹️ Stop Recording
        </button>
        <button
          onClick={playRecording}
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
          disabled={!audioUrl}
        >
          ▶️ Play Recording 
        </button>
        <button
          onClick={deleteRecording}
          className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
          disabled={!audioUrl}
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
            Audio enregistré et prêt à être sauvegardé.
          </p>
        </div>
      )}
    </section>
  );
}