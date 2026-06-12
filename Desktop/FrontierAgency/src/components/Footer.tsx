export default function Footer() {
  return (
    <footer className="px-6 md:px-12 pt-10 pb-6 border-t border-[#333333]">
      {/* Ownership / partnership banner */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 pb-8 mb-8 border-b border-[#333333]">
        <span className="flex items-center gap-2 text-[0.65rem] sm:text-xs text-[#888888] tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-inter)" }}>
          <span className="text-[#555555]">A</span>
          <span className="relative group">
            <a href="https://gstudios.co" target="_blank" rel="noopener noreferrer" className="font-semibold text-white tracking-wide hover:text-[#C5A55A] transition-colors duration-300 cursor-pointer">gStudios</a>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5 bg-[#1a1a1a] border border-[#333333] rounded text-[0.65rem] sm:text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ fontFamily: "var(--font-inter)" }}>
              <span className="text-[#C5A55A]">Golden</span><span className="text-white"> Studios</span>
            </span>
          </span>
          <span className="text-[#555555]">company</span>
        </span>
        <span className="hidden sm:inline text-[#333333]">·</span>
        <span className="flex items-center gap-2 text-[0.65rem] sm:text-xs text-[#888888] tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-inter)" }}>
          <span className="text-[#555555]">In partnership with</span>
          <a href="https://globallistarealty.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-white hover:text-[#888888] transition-colors duration-300 tracking-wide">Globallista Realty</a>
        </span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <span
            className="text-xs text-[#888888]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            &copy; 2026 Frontier Agency. All rights reserved.
          </span>
          <a
            href="tel:+17867439361"
            className="text-xs text-[#888888] hover:text-white transition-colors duration-300"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            (786) 743-9361
          </a>
          <span
            className="text-xs text-[#333333] hidden sm:inline"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Personalized AI agencies for businesses of every size.
          </span>
        </div>
        <div className="flex gap-8 items-center">
          {["Privacy","Terms","Contact"].map((label)=>{
  const hrefMap={
    Privacy:'/privacy',
    Terms:'/terms',
    Contact:'/contact'
  }[label];
  return(
    <a
      key={label}
      href={hrefMap}
      className="text-xs text-[#888888] hover:text-white transition-colors duration-300"
      style={{fontFamily:"var(--font-inter)"}}
    >{label}</a>
  );
})}
        </div>
      </div>
    </footer>
  );
}
