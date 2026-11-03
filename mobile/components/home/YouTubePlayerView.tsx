// mobile/components/home/YouTubePlayerView.tsx
import React from "react";
import { VideoPlayerCard } from "./VideoPlayerCard";

interface YouTubePlayerProps {
  url?: string;
  title?: string;
}

export const YouTubePlayerView: React.FC<YouTubePlayerProps> = ({
  url,
  title,
}) => {
  return <VideoPlayerCard videoUrl={url} title={title} />;
};
