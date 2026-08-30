"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { heroSlides } from "@/lib/hero-slides";

export function HeroCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const directionRef = useRef<1 | -1>(1);
  const isAutoScrolling = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    const el = containerRef.current;
    if (!el) return;
    isAutoScrolling.current = true;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
    indexRef.current = index;
    setActiveIndex(index);
    window.setTimeout(() => {
      isAutoScrolling.current = false;
    }, 600);
  };

  const handleScroll = () => {
    if (isAutoScrolling.current) return;
    const el = containerRef.current;
    if (!el) return;
    const slideWidth = el.clientWidth;
    const index = Math.round(el.scrollLeft / slideWidth);
    indexRef.current = index;
    setActiveIndex(index);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      let nextDir = directionRef.current;
      let nextIndex = indexRef.current + directionRef.current;

      if (nextIndex >= heroSlides.length) {
        nextDir = -1;
        nextIndex = heroSlides.length - 2;
      } else if (nextIndex < 0) {
        nextDir = 1;
        nextIndex = 1;
      }

      directionRef.current = nextDir;
      scrollToIndex(nextIndex);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="mb-3 flex gap-3 overflow-x-auto snap-x snap-mandatory px-5 pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {heroSlides.map((slide) => (
          <div
            key={slide.key}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-5 min-w-[calc(100%-2.5rem)] snap-center"
          >
            <span className="relative inline-flex items-center gap-1.5 bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
              {slide.badge}
            </span>

            <h1 className="relative text-[26px] font-extrabold text-slate-900 leading-tight mt-3">
              {slide.line1}
              <br />
              <span className="text-blue-600">{slide.highlight}</span>
            </h1>
            <p className="relative text-slate-500 text-[13px] mt-3 max-w-[62%] leading-relaxed">
              {slide.desc}
            </p>

            <img
              src={slide.img}
              alt={slide.key}
              className="absolute right-0 bottom-0 w-40 h-52 object-cover object-top rounded-tl-3xl"
            />

            <div className="relative grid grid-cols-3 gap-2 mt-32">
              {slide.pills.map((pill) => {
                const PillIcon = pill.icon;
                return (
                  <div
                    key={pill.label}
                    className="bg-white rounded-xl px-2.5 py-2.5 flex flex-col gap-1.5 shadow-sm"
                  >
                    <PillIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-[10.5px] font-medium text-slate-700 leading-tight">
                      {pill.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <button className="relative w-full bg-blue-600 text-white text-sm font-semibold rounded-2xl py-3.5 mt-4 flex items-center justify-center gap-2">
              {slide.cta} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1.5 mb-6">
        {heroSlides.map((slide, i) => (
          <span
            key={slide.key}
            className={`h-1.5 rounded-full transition-all ${
              i === activeIndex ? "w-4 bg-blue-600" : "w-1.5 bg-slate-200"
            }`}
          />
        ))}
      </div>
    </>
  );
}
