'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';

interface VideoPlayerProps {
  title: string;
  description?: string | null;
  videoUrl?: string | null;
  duration?: number | null;
  onComplete: () => void;
  isCompleted: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  title,
  description,
  videoUrl,
  duration,
  onComplete,
  isCompleted,
}) => {
  console.log('[VideoPlayer] Rendering with videoUrl:', videoUrl);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration ? duration * 60 : 600);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hasVideo = !!videoUrl;
  console.log('[VideoPlayer] hasVideo:', hasVideo);

  // Memoize onComplete to prevent stale closures
  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  // Mock video progress for demo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !hasVideo) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, hasVideo, totalDuration, playbackSpeed]);

  // Update progress
  useEffect(() => {
    setProgress((currentTime / totalDuration) * 100);
  }, [currentTime, totalDuration]);

  // Hide controls after inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * totalDuration;
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const skip = (seconds: number) => {
    const newTime = Math.max(0, Math.min(totalDuration, currentTime + seconds));
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="flex flex-col h-full bg-[var(--gray-50)]">
      {/* Video Container */}
      <div 
        ref={containerRef}
        className="relative bg-gray-900 flex-shrink-0 group cursor-pointer"
        style={{ height: '65vh', minHeight: '280px', maxHeight: '582px' }}
        onClick={togglePlay}
      >
        {hasVideo ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setTotalDuration(e.currentTarget.duration)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          // Placeholder video display
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--primary-navy)] to-gray-900">
            {/* Center content */}
            <div className="relative z-10 text-center">
              <h3 className="text-white text-lg font-medium mb-4">{title}</h3>
              {!isPlaying ? (
                <button 
                  onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                  className="w-20 h-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              ) : (
                <div className="flex items-center gap-2 text-white/60">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Playing...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Video Controls Overlay */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress Bar */}
          <div 
            className="px-4 py-2 cursor-pointer group/progress"
            onClick={handleSeek}
          >
            <div className="h-1 bg-white/30 rounded-full overflow-hidden group-hover/progress:h-1.5 transition-all">
              <div 
                className="h-full bg-[var(--gold-accent)] rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="px-4 pb-4 flex items-center gap-4 text-white">
            {/* Play/Pause */}
            <button 
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              className="hover:text-[var(--gold-accent)] transition-colors"
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Skip buttons */}
            <button 
              onClick={(e) => { e.stopPropagation(); skip(-10); }}
              className="hover:text-[var(--gold-accent)] transition-colors"
              title="Rewind 10s"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
              </svg>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); skip(10); }}
              className="hover:text-[var(--gold-accent)] transition-colors"
              title="Forward 10s"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
              </svg>
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 group/volume">
              <button 
                onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                className="hover:text-[var(--gold-accent)] transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                onClick={(e) => e.stopPropagation()}
                className="w-0 group-hover/volume:w-20 transition-all duration-300 accent-[var(--gold-accent)]"
              />
            </div>

            {/* Time */}
            <span className="text-sm font-mono text-white/80">
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </span>

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Playback Speed */}
            <div className="relative group/speed">
              <button 
                onClick={(e) => e.stopPropagation()}
                className="text-sm hover:text-[var(--gold-accent)] transition-colors px-2 py-1"
              >
                {playbackSpeed}x
              </button>
              <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg overflow-hidden opacity-0 invisible group-hover/speed:opacity-100 group-hover/speed:visible transition-all">
                {speedOptions.map((speed) => (
                  <button
                    key={speed}
                    onClick={(e) => { e.stopPropagation(); setPlaybackSpeed(speed); }}
                    className={`block w-full px-4 py-2 text-sm text-left hover:bg-white/10 ${playbackSpeed === speed ? 'text-[var(--gold-accent)]' : 'text-white'}`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Fullscreen */}
            <button 
              onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
              className="hover:text-[var(--gold-accent)] transition-colors"
            >
              {isFullscreen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Video Info Section */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-[var(--gray-200)] p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">{title}</h2>
                {description && (
                  <p className="text-[var(--gray-600)]">{description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {isCompleted ? (
                  <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Completed
                  </span>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleComplete}
                  >
                    Mark as Complete
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </Button>
                )}
              </div>
            </div>

            {/* Video Stats */}
            <div className="flex items-center gap-6 text-sm text-[var(--gray-500)] pt-4 border-t border-[var(--gray-100)]">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {duration ? `${duration} min` : formatTime(totalDuration)}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Video Lesson
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
