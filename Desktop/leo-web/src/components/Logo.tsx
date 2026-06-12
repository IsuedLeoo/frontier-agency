import Image from "next/image";

interface LogoProps {
  variant: "dark" | "light";
  className?: string;
  width?: number;
}

import Link from "next/link";

export default function Logo({
  variant,
  className = "",
  width = 140,
}: LogoProps) {
  const src = variant === "dark" ? "/logowhite.png" : "/logoblack.png";

  return (
    <Link href="/" prefetch={false}>
      <Image
        src={src}
        alt="Frontier Agency"
        width={width}
        height={width * (1024 / 1536)}
        className={`h-auto object-contain ${className}`}
        priority
      />
    </Link>
  );
}
