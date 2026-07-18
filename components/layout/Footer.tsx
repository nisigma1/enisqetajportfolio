import { navigation } from "@/data/navigation";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-identity"><span className="brand-mark">EQ</span><h2>Enis Qetaj</h2><p>Crypto Trader<br />Financial Markets Researcher<br />AI Product Builder</p></div>
        <nav aria-label="Footer navigation">{navigation.slice(1).map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}</nav>
        <div className="footer-contact"><p>Direct contact</p><a href="mailto:enisqeta5@gmail.com">enisqeta5@gmail.com</a><a href="#top">Back to top ↑</a></div>
      </div>
      <div className="footer-closing"><p>Analyzing signals.<br /><em>Building systems.</em></p><span>© {new Date().getFullYear()} / Kosovo</span><i aria-hidden="true" /></div>
    </footer>
  );
}

