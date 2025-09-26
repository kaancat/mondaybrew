"use client";
import dynamic from "next/dynamic";
const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });

type Props = {
  playbackId: string;
  poster?: string;
  auto?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  captions?: string; // VTT URL
};

export function Video({ playbackId, poster, auto = false, loop = false, muted = true, className, captions }: Props) {
  return (
    <MuxPlayer
      className={className}
      style={{ aspectRatio: "16 / 9", width: "100%" }}
      playbackId={playbackId}
      poster={poster}
      autoPlay={auto}
      muted={muted}
      loop={loop}
      preload="none"
    >
      {captions && <track default kind="captions" src={captions} />}
    </MuxPlayer>
  );
}
