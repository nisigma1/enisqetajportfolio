import { identity, navigation } from "@/data/site";
import Link from "next/link";
import { SocialDock } from "@/components/layout/SocialDock";
import { DeferredLineSidebar } from "@/components/performance/DeferredIslands";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-statement">
        <p>Enis Qetaj</p>
        <span>Context first. Then build.</span>
      </div>
      <div className="footer-navigation-panel">
        <div className="footer-navigation-panel__intro">
          <span>Portfolio index</span>
          <p>Move through the practice, one context at a time.</p>
        </div>
        <DeferredLineSidebar
          items={navigation.map((item) => item.label)}
          hrefs={navigation.map((item) => item.href)}
        />
      </div>
      <SocialDock />
      <div className="footer-meta">
        <span>© {new Date().getFullYear()}</span>
        <span>Kosovo</span>
        <Link href="/about">About Enis Qetaj</Link>
        <a href={identity.emailHref} target="_blank" rel="noreferrer">{identity.email}</a>
        <Link className="footer-back-to-top" href="/#index">Back to top <span className="footer-back-to-top__icon" aria-hidden="true" /></Link>
      </div>
    </footer>
  );
}
