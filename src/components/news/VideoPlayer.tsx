export function VideoPlayer({ src, poster }: { src: string; poster?: string }) {
  return (
    <div className="my-8 overflow-hidden rounded-2xl bg-ink">
      <video
        controls
        poster={poster}
        preload="metadata"
        className="aspect-video w-full bg-surface object-contain"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support embedded video.
      </video>
    </div>
  );
}
