'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function MoviePlayer() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Back Button */}
      <nav className="fixed top-0 w-full p-4 z-50 flex items-center gap-8 bg-linear-to-b from-black/70 to-transparent">
        <ArrowLeft 
          className="text-white cursor-pointer hover:scale-110 transition" 
          onClick={() => router.back()} 
          size={32} 
        />
      </nav>

      {/* Video Element */}
      <video
        ref={videoRef}
        className="h-full w-full"
        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
        controls
        autoPlay
      />

      {/* Custom Overlay (Optional for Netflix feel) */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
          onClick={togglePlay}
        >
          <Play size={80} fill="white" className="text-white" />
        </div>
      )}
    </div>
  );
}