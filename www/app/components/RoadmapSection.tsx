'use client';

import Image from 'next/image';

const RoadmapSection = () => {
  const roadmapItems = [
    {
      icon: '/images/tree-icon.png',
      alt: 'Tree Icon',
      text: 'Build a decentralized protocol to validate land ownership and house details with the ROOT token',
    },
    {
      icon: '/images/home-icon.png',
      alt: 'Home Icon',
      text: 'Launch land-based Network Villages with community-owned economies',
    },
    {
      icon: '/images/hand-icon.png',
      alt: 'Hand holding home Icon',
      text: 'Start community lending for home ownership in Network Villages',
    },
  ];

  // --- Updated SVG Calculations for Absolute Positioning ---
  const svgHeight = 700;
  const svgWidth = 768;  // max-w-3xl
  const iconSize = 176; // md:w-44
  const verticalGap = 240;
  // X positions are center of icons pinned left/right
  const xLeft = iconSize / 2;
  const xRight = svgWidth - iconSize / 2;
  const y1 = iconSize / 2;
  const y2 = y1 + verticalGap;
  const y3 = y2 + verticalGap;
  // Recalculated SVG Path based on new X positions
  const pathD = `
    M ${xLeft}, ${y1 + iconSize / 2}
    C ${xLeft}, ${y1 + iconSize / 2 + verticalGap / 2},
      ${xRight}, ${y2 - verticalGap / 2},
      ${xRight}, ${y2 - iconSize / 2}
    M ${xRight}, ${y2 + iconSize / 2}
    C ${xRight}, ${y2 + iconSize / 2 + verticalGap / 2},
      ${xLeft}, ${y3 - verticalGap / 2},
      ${xLeft}, ${y3 - iconSize / 2}
  `;
  // --- End Updated SVG Calculations ---

  return (
    <section id="roadmap" className="relative container mx-auto px-6 py-16 overflow-hidden">
      <h2 className="text-3xl font-bold text-center text-[#556B2F] mb-16">
        Protocol Roadmap
      </h2>

      <div className="relative max-w-3xl mx-auto">
        {/* SVG Dashed Path */}
        <svg
          className="absolute inset-0 z-0 hidden md:block"
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d={pathD} // Using updated pathD
            stroke="#6B8E23"
            strokeWidth="3"
            strokeDasharray="8 8"
            strokeLinecap="round"
          />
        </svg>

        {roadmapItems.map((item, index) => (
          // Removed justify-start/end, added min-height for absolute positioning context
          <div key={index} className={`relative mb-16 flex flex-col md:flex-row items-center md:min-h-[176px]`}>
            {/* Icon Container - Absolute positioning on md+ */}
            <div className={`w-36 h-36 md:w-44 md:h-44 rounded-full bg-[#F7F7F2] flex items-center justify-center shadow-md z-10
                           mb-4 md:mb-0 md:absolute md:top-0 ${index % 2 === 0 ? 'md:left-0' : 'md:right-0'}`}>
              <Image
                src={item.icon}
                alt={item.alt}
                width={160}
                height={160}
                style={{ objectFit: 'contain' }}
              />
            </div>

            {/* Text Container - Padding ensures text clears icon + 1rem gap */}
            <div className={`w-full text-center ${index % 2 === 0 ? 'md:text-left md:pl-[calc(11rem+1rem)]' : 'md:text-right md:pr-[calc(11rem+1rem)]'}`}>
              <p className="text-xl font-semibold text-[#6B8E23] leading-relaxed">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Hills Background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 z-0">
        <Image
          src="/images/hills-background.png"
          alt="Green hills background"
          fill
          style={{ objectFit: 'cover', objectPosition: 'bottom' }}
          quality={80}
        />
      </div>
    </section>
  );
};

export default RoadmapSection;
