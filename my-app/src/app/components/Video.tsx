import React from "react";

interface VideoProps {
  src: string;
  type: string;
  width?: string;
  height?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string; // Add className prop
}

const Video: React.FC<VideoProps> = ({
  src,
  type,
  width = "100%",
  height = "auto",
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  className, // Include className in the destructured props
}) => {
  return (
    <video
      className={`object-cover ${className}`} // Apply className prop
      width={width}
      height={height}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline
    >
      <source src={src} type={type} />
      Your browser does not support the video tag.
    </video>
  );
};

export default Video;
