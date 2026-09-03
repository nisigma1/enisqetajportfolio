"use client";

import { useId, useState, type ReactNode } from "react";

type Tab = {
  title: string;
  value: string;
  content: ReactNode;
};

export function Tabs({ tabs, className = "" }: { tabs: readonly Tab[]; className?: string }) {
  const [activeValue, setActiveValue] = useState(tabs[0]?.value ?? "");
  const baseId = useId();
  const activeTab = tabs.find((tab) => tab.value === activeValue) ?? tabs[0];

  if (!activeTab) return null;

  return (
    <div className={`tabs ${className}`.trim()}>
      <div className="tabs__list" role="tablist" aria-label="Explore Enis Qetaj’s practice">
        {tabs.map((tab) => {
          const selected = activeTab.value === tab.value;
          return (
            <button
              key={tab.value}
              id={`${baseId}-${tab.value}-tab`}
              className="tabs__trigger"
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-${tab.value}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveValue(tab.value)}
            >
              {tab.title}
            </button>
          );
        })}
      </div>
      <div
        id={`${baseId}-${activeTab.value}-panel`}
        className="tabs__panel"
        role="tabpanel"
        aria-labelledby={`${baseId}-${activeTab.value}-tab`}
      >
        {activeTab.content}
      </div>
    </div>
  );
}
