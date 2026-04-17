"use client";

import type { ReactNode } from "react";

type Props = {
  title: string;
  icon?: ReactNode;
  className?: string;
  required?: boolean;
  children: ReactNode;
};

export default function SelectCard({
  title,
  icon,
  className,
  required,
  children,
}: Props) {
  return (
    <section className={className}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h2 className="text-[14px] font-semibold text-gray-800">{title}</h2>
        {required && <span className="text-[11px] text-red-400 ml-auto">필수 입력</span>}
      </div>

      {children}
    </section>
  );
}
