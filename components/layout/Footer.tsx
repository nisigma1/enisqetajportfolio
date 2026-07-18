import { navigation } from "@/data/site";

export function Footer() {
  return <footer className="site-footer"><div className="footer-statement"><p>Enis Qetaj</p><span>Markets, research and useful digital products.</span></div><nav aria-label="Footer navigation">{navigation.map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}</nav><div className="footer-meta"><span>© {new Date().getFullYear()}</span><span>Kosovo</span><a href="mailto:enisqeta5@gmail.com">enisqeta5@gmail.com</a><a href="#index">Back to top ↑</a></div></footer>;
}
