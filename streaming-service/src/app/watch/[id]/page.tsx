'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play } from 'lucide-react';

const API_URL = 'http://localhost:5000';
const WATCH_THRESHOLD_SECONDS = 15;

export default function MoviePlayer() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const lastSavedSecondRef = useRef(0);

  const movieId = Number(params?.id);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  useEffect(() => {
    const savedId = localStorage.getItem('userId');
    if (savedId) {
      setUserId(savedId);
    }
  }, []);

  const persistHistory = async (progressSeconds: number, markFinished: boolean) => {
    if (!userId || !isValidMovieId) {
      return;
    }

    try {
      await fetch(`${API_URL}/history/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          movieId,
          progressSeconds,
          durationSeconds: duration,
          isFinished: markFinished
        })
      });
    } catch (error) {
      console.error('Failed to persist watch history', error);
    }
  };

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

  const handleTimeUpdate = () => {
    if (!videoRef.current) {
      return;
    }

    const currentSeconds = Math.floor(videoRef.current.currentTime);
    if (currentSeconds < WATCH_THRESHOLD_SECONDS) {
      return;
    }

    if (currentSeconds - lastSavedSecondRef.current < 15) {
      return;
    }

    lastSavedSecondRef.current = currentSeconds;
    void persistHistory(currentSeconds, false);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);

    if (!videoRef.current) {
      return;
    }

    const finalSeconds = Math.floor(videoRef.current.currentTime);
    void persistHistory(finalSeconds, true);
  };

  if (!isValidMovieId) {
    return (
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
        <p>Invalid movie id.</p>
      </div>
    );
  }

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
        onLoadedMetadata={(event) => {
          const metadataDuration = event.currentTarget.duration;
          if (Number.isFinite(metadataDuration)) {
            setDuration(metadataDuration);
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
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