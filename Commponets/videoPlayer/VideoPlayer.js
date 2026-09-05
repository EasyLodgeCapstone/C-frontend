"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function VideoPlayer({
  videoSrc,
  redirectPath = "/Protected/home",
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSkipHint, setShowSkipHint] = useState(false);
  const videoRef = useRef(null);
  const router = useRouter();

  // Handle video end
  const handleVideoEnd = () => {
    router.push(redirectPath);
  };

  // Handle click on video - navigate immediately if playing
  const handleClick = () => {
    if (isPlaying) {
      router.push(redirectPath);
    }
  };

  // Auto-play video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setShowSkipHint(true);
          })
          .catch((error) => {
            console.log("Autoplay prevented:", error);
            setIsPlaying(false);
            setShowSkipHint(false);
          });
      }
    }
  }, []);

  // Update playing state on play/pause events
  const handlePlay = () => {
    setIsPlaying(true);
    setShowSkipHint(true);
  };
  
  const handlePause = () => {
    setIsPlaying(false);
    setShowSkipHint(false);
  };

  // Check if video is actually playing
  useEffect(() => {
    const checkPlaying = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
        setIsPlaying(true);
        setShowSkipHint(true);
      }
    }, 1000);

    return () => clearInterval(checkPlaying);
  }, []);

  return (
    <div
      className="relative w-full h-screen bg-black cursor-pointer"
      onClick={handleClick}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onEnded={handleVideoEnd}
        onPlay={handlePlay}
        onPause={handlePause}
        autoPlay
        muted
        playsInline
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Controls hint (shown while playing) */}
      {showSkipHint && (
        <div className="absolute bottom-8 left-0 right-0 text-center animate-pulse">
          <span className="px-4 py-2 bg-black/50 text-white/80 text-sm rounded-lg backdrop-blur-sm">
            ⏭️ Click anywhere to skip
          </span>
        </div>
      )}
    </div>
  );
}