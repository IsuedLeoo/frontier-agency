"use client";

/**
 * Fixed‑size dot separator used between inline text elements.
 *
 * The component renders a small (0.5 em) dot that is only visible on
 * the `sm` breakpoint and larger. It is an `inline‑block` element, which
 * prevents flex or grid containers from stretching it inadvertently.
 */
export default function Divider() {
  return (
    // `hidden sm:inline` keeps the element removed from the DOM on tiny screens.
    // `inline-block` forces a fixed box size, and the `text-[#333333]` colour
    // matches the surrounding text colour used throughout the site.
    <span className="hidden sm:inline-block text-[#333333]" style={{ width: "0.5em", textAlign: "center" }}>·</span>
  );
}
