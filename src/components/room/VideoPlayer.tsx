interface VideoPlayerProps {
  videoId: string | null;
}

export default function VideoPlayer({ videoId }: VideoPlayerProps) {
  if (!videoId) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white rounded-lg">
        <p>No video selected or invalid URL.</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0`;

  return (
    <div className="w-full h-full aspect-video bg-black rounded-lg overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="rounded-lg"
      ></iframe>
    </div>
  );
}
