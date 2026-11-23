import { identity } from "@/data/site";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="portfolio-footer-inner">
        <p>© {new Date().getFullYear()} {identity.name}</p>
        <nav aria-label="About and social links">
          <Link href="/about">About</Link>
          {identity.social.map(({ label, href }) => <a key={label} href={href} rel="me">{label}</a>)}
        </nav>
        <a className="portfolio-footer-top" href="#app-shell">Back to top</a>
        <p className="portfolio-footer-credit">
          Designed &amp; developed by <a href="https://www.malera.studio/">Malera Studio</a>
        </p>
      </div>
    </footer>
  );
}
