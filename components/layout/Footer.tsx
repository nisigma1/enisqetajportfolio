import { navigation } from "@/data/site";
import Link from "next/link";
import { TransitionLink } from "@/components/transition/TransitionLink";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-statement">
        <p>Enis Qetaj</p>
        <span>Context first. Then build.</span>
      </div>
      <nav aria-label="Footer navigation">
        {navigation.map((item) => (
          <TransitionLink key={item.label} href={item.href}>{item.label}</TransitionLink>
        ))}
      </nav>
      <div className="footer-meta">
        <span>© {new Date().getFullYear()}</span>
        <span>Kosovo</span>
        <a href="mailto:enisqeta5@gmail.com">enisqeta5@gmail.com</a>
        <Link href="/#index">Back to top <span aria-hidden="true">↑</span></Link>
      </div>
    </footer>
  );
}
