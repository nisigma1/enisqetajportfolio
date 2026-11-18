export const vibes = [
  { id: "paper", label: "Paper", theme: "light" },
  { id: "mint", label: "Neon green", theme: "light" },
  { id: "amber", label: "Orange", theme: "light" },
  { id: "lime", label: "Lime", theme: "light" },
  { id: "lilac", label: "Lilac", theme: "light" },
  { id: "peach", label: "Peach", theme: "light" },
  { id: "slate", label: "Slate", theme: "dark" },
  { id: "night", label: "Night", theme: "dark" },
] as const;

export const VIBE_KEY = "enis-vibe";
export const THEME_KEY = "enis-theme";

export const themeBootstrap = `(()=>{const vibes=${JSON.stringify(vibes.map(({ id, theme }) => [id, theme]))};let id,theme;try{id=localStorage.getItem('${VIBE_KEY}');theme=localStorage.getItem('${THEME_KEY}')}catch{}const entry=vibes.find(v=>v[0]===id);const dark=theme==='dark'||(theme!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);const root=document.documentElement;root.dataset.vibe=entry?.[0]||(dark?'night':'paper');root.dataset.theme=entry?.[1]||(dark?'dark':'light')})();`;
