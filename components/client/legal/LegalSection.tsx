import type { ReactNode } from "react";

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2.5">
      <h3 className="text-base font-bold text-[#0f172a]">{title}</h3>
      <div className="space-y-2.5 text-sm leading-relaxed text-gray-600">
        {children}
      </div>
    </section>
  );
}
