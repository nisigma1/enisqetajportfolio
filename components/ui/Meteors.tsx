import type { CSSProperties } from "react";

type Meteor = {
  left: string;
  top: string;
  delay: string;
  duration: string;
  length: string;
};

const meteors: Meteor[] = [
  ["5%", "-16%", "0.2s", "7.2s", "5.5rem"], ["14%", "-28%", "2.4s", "8.4s", "4.5rem"],
  ["23%", "-8%", "4.8s", "7.7s", "6rem"], ["31%", "-22%", "1.1s", "9.1s", "4rem"],
  ["39%", "-12%", "6.3s", "8s", "5.25rem"], ["47%", "-31%", "3.6s", "9.4s", "6.5rem"],
  ["55%", "-4%", "7.5s", "7.8s", "4.75rem"], ["63%", "-25%", "0.8s", "8.8s", "5rem"],
  ["70%", "-10%", "5.2s", "7.4s", "6rem"], ["78%", "-35%", "2.7s", "9.5s", "4.25rem"],
  ["86%", "-18%", "6.8s", "8.1s", "5.75rem"], ["94%", "-6%", "4.1s", "9s", "4.5rem"],
].map(([left, top, delay, duration, length]) => ({ left, top, delay, duration, length }));

export function Meteors({ className = "" }: { className?: string }) {
  return (
    <span className={`meteors ${className}`.trim()} aria-hidden="true">
      {meteors.map((meteor, index) => (
        <i
          key={index}
          className="meteors__item"
          style={{
            "--meteor-left": meteor.left,
            "--meteor-top": meteor.top,
            "--meteor-delay": meteor.delay,
            "--meteor-duration": meteor.duration,
            "--meteor-length": meteor.length,
          } as CSSProperties}
        />
      ))}
    </span>
  );
}
