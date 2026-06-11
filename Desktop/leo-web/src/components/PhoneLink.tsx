"use client";

import { useState, useCallback } from "react";

interface PhoneLinkProps {
  display?: string;
  className?: string;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

export default function PhoneLink({ display, className, icon, style }: PhoneLinkProps) {
  const [copied, setCopied] = useState(false);
  const phone = "+17867439361";
  const label = display || "(786) 743-9361";

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // On mobile, tel: works natively — let it proceed
      // On desktop, prevent default and copy instead
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      if (isMobile) return; // let tel: work

      e.preventDefault();
      navigator.clipboard.writeText(phone).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    },
    [phone]
  );

  return (
    <span className="relative inline-flex items-center">
      <a
        href={`tel:${phone}`}
        onClick={handleClick}
        className={className}
        style={style}
        aria-label={`Call ${label}`}
      >
        {icon}
        {label}
      </a>
      {copied && (
        <span
          className="absolute left-1/2 -translate-x-1/2 -top-8 px-2.5 py-1 bg-white text-black text-[0.65rem] font-medium uppercase tracking-[0.04em] rounded pointer-events-none whitespace-nowrap"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Copied!
        </span>
      )}
    </span>
  );
}
