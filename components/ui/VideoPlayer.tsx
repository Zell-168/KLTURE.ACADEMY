import React from 'react';

interface VideoPlayerProps {
  url?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  if (!url) return null;

  let embedUrl = url;

  // Handle YouTube (Robust Regex for various URL formats)
  // Covers: youtu.be, www.youtube.com/watch?v=, embed/, etc.
  const ytRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const ytMatch = url.match(ytRegex);

  if (ytMatch && ytMatch[2].length === 11) {
    embedUrl = `https://www.youtube.com/embed/${ytMatch[2]}`;
  }
  // Handle Google Drive
  else if (url.includes('drive.google.com')) {
    // Ensure we use the preview link instead of view/sharing for embedding
    embedUrl = url.replace('/view', '/preview').replace('/sharing', '/preview');
  }

  return (
    <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden bg-black border border-zinc-800 shadow-md my-4 group">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={embedUrl}
        title="Video Preview"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default VideoPlayer;