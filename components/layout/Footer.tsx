import { identity, navigation } from "@/data/site";
import Link from "next/link";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { ActionMark } from "@/components/ui/ActionMark";

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
        <a href={identity.emailHref} target="_blank" rel="noreferrer">{identity.email}</a>
        <Link href="/#index">Back to top <ActionMark direction="up" /></Link>
      </div>
    </footer>
  );
}
