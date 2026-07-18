import { navigation } from "@/data/site";

export function Footer() {
  return <footer className="site-footer"><p><span>Enis</span><span>Qetaj</span></p><nav aria-label="Footer navigation">{navigation.map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}</nav><div><span>© {new Date().getFullYear()}</span><span>Kosovo</span><a href="#index">Back to top ↑</a></div></footer>;
}

