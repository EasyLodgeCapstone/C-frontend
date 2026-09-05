import Image from "next/image";
import Link from "next/link";
import VideoPlayer from "../../Commponets/videoPlayer/VideoPlayer";

export const metadata = {
  title: "open | B&B BodyCare",
  description: "B&B Body Care Natural Glow Natural You.",
  openGraph: {
    title: "B&B Body Care - open",
    description: " B&B Body Care Natural Glow Natural You.",
    images: [
      {
        url: "/logo/WhatsApp Image 2026-09-05 at 9.10.32 AM.jpeg",
        width: 1200,
        height: 630,
        alt: "B&B Body Care open",
      },
    ],
  },
  // Keywords are optional
};

export default function Home() {
  return (
    <div>
      <VideoPlayer
        videoSrc="/OpenVideo/BB_BodyCare_Website_Opening_Compatible.mp4"
        redirectPath="/Protected/home"
      />
    </div>
  );
}
