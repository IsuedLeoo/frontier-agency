import Image from "next/image";

interface LogoProps {
  variant: "dark" | "light";
  className?: string;
  width?: number;
}

export default function Logo({
  variant,
  className = "",
  width = 140,
}: LogoProps) {
  const src = variant === "dark" ? "/logowhite.png" : "/logoblack.png";

  return (
    <Image
      src={src}
      alt="Frontier Agency"
      width={width}
      height={width * (1024 / 1536)}
      className={`h-auto object-contain ${className}`}
      priority
    />
  );
}
