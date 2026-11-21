import type { ReactNode } from "react";

export default function SectionHeading({
  eyebrow,
  title,
  text,
  action,
  center = false,
}: {
  eyebrow: string;
  title: ReactNode;
  text?: string;
  action?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-5 ${center ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}>
      <div className={center ? "max-w-2xl" : "max-w-2xl"}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="h-display mt-3 text-[2.1rem] leading-[1.08] sm:text-5xl">
          <span className="line-mask">
            <span>{title}</span>
          </span>
        </h2>
        {text && <p className="mt-4 text-base leading-relaxed text-muted">{text}</p>}
      </div>
      {action}
    </div>
  );
}
