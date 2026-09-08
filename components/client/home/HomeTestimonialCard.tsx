"use client";

import { useState } from "react";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Testimonial } from "./testimonials";

export default function HomeTestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <figure className="group rounded-2xl border border-gray-100 border-l-4 border-l-[#0077d2] bg-white p-4 sm:p-5">
      <Quote
        className="mb-3 h-5 w-5 text-[#0077d2]"
        strokeWidth={1.75}
        aria-hidden
      />
      <div className="relative">
        <blockquote
          className={cn(
            "text-sm leading-relaxed text-gray-600",
            !expanded &&
              "line-clamp-4 [@media(hover:hover)]:group-hover:line-clamp-none [@media(hover:hover)]:group-focus-within:line-clamp-none"
          )}
        >
          <p>{testimonial.paragraphs.join(" ")}</p>
        </blockquote>
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent",
            expanded && "hidden",
            "[@media(hover:hover)]:group-hover:hidden [@media(hover:hover)]:group-focus-within:hidden"
          )}
        />
      </div>
      <button
        type="button"
        className={cn(
          "mt-2 text-xs font-semibold text-[#0077d2] hover:text-[#0062b0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077d2] focus-visible:ring-offset-2",
          expanded
            ? "[@media(hover:hover)]:hidden"
            : "[@media(hover:hover)]:group-hover:hidden"
        )}
        aria-expanded={expanded}
        onClick={() => setExpanded((current) => !current)}
      >
        {expanded ? "Réduire" : "Lire la suite"}
      </button>
      <figcaption className="mt-4 flex items-center gap-2.5 border-t border-gray-100 pt-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-[#0077d2] ring-1 ring-[#0077d2]/10"
          aria-hidden
        >
          {testimonial.initials}
        </div>
        <div className="min-w-0">
          <cite className="block text-sm not-italic font-semibold text-[#0f172a]">
            {testimonial.name}
          </cite>
          {testimonial.role ? (
            <p className="text-xs text-gray-500">{testimonial.role}</p>
          ) : null}
        </div>
      </figcaption>
    </figure>
  );
}
