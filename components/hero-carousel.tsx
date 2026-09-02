"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { heroSlides } from "@/lib/hero-slides";

export function HeroCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const directionRef = useRef<1 | -1>(1);
  const isProgrammatic = useRef(false);
  const isTyping = useRef(false);
  const [index, setIndex] = useState(0);

  // Met en pause le défilement auto tant qu'un champ de saisie est actif sur la page
  useEffect(() => {
    const isFormField = (el: EventTarget | null) =>
      el instanceof HTMLElement &&
      (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);

    const onFocusIn = (e: FocusEvent) => {
      if (isFormField(e.target)) isTyping.current = true;
    };
    const onFocusOut = (e: FocusEvent) => {
      if (isFormField(e.target)) isTyping.current = false;
    };

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  // Défile uniquement le carrousel horizontal, jamais la page verticale
  useEffect(() => {
    const slide = slideRefs.current[index];
    const container = containerRef.current;
    if (!slide || !container) return;
    isProgrammatic.current = true;
    const targetLeft = slide.offsetLeft - container.offsetLeft;
    container.scrollTo({ left: targetLeft, behavior: "smooth" });
    const t = window.setTimeout(() => {
      isProgrammatic.current = false;
    }, 700);
    return () => window.clearTimeout(t);
  }, [index]);

  // Défilement automatique en va-et-vient, infini (en pause si l'utilisateur saisit du texte)
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (isTyping.current) return;
      setIndex((prev) => {
        let dir = directionRef.current;
        let next = prev + dir;
        if (next >= heroSlides.length) {
          dir = -1;
          next = heroSlides.length - 2;
        } else if (next < 0) {
          dir = 1;
          next = 1;
        }
        directionRef.current = dir;
        return next;
      });
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  // Suivi du swipe manuel : trouve la slide la plus proche de la position de scroll réelle
  const handleScroll = () => {
    if (isProgrammatic.current) return;
    const container = containerRef.current;
    if (!container) return;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    let closest = 0;
    let closestDist = Infinity;
    slideRefs.current.forEach((slide, i) => {
      if (!slide) return;
      const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
      const dist = Math.abs(slideCenter - containerCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    if (closest !== index) setIndex(closest);
  };

  return (
    <>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="mb-3 flex gap-3 overflow-x-auto snap-x snap-mandatory px-5 pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {heroSlides.map((slide, i) => (
          <Link
            key={slide.key}
            href={slide.href}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-5 min-w-[calc(100%-2.5rem)] h-[430px] flex flex-col snap-center"
          >
            <div>
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
            </div>

            <img
              src={slide.img}
              alt={slide.key}
              className="absolute right-0 bottom-0 w-40 h-52 object-cover object-top rounded-tl-3xl"
            />

            <div className="relative grid grid-cols-3 gap-2 mt-auto">
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

            <span className="relative w-full bg-blue-600 text-white text-sm font-semibold rounded-2xl py-3.5 mt-4 flex items-center justify-center gap-2">
              {slide.cta} <ChevronRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </div>
      <div className="flex justify-center gap-1.5 mb-6">
        {heroSlides.map((slide, i) => (
          <span
            key={slide.key}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-4 bg-blue-600" : "w-1.5 bg-slate-200"
            }`}
          />
        ))}
      </div>
    </>
  );
}
