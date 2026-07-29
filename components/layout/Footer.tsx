import { identity, navigation } from "@/data/site";
import Link from "next/link";
import { ActionMark } from "@/components/ui/ActionMark";
import { LineSidebar } from "@/components/ui/LineSidebar";

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
        <LineSidebar
          className="footer-line-sidebar"
          items={navigation.map((item) => item.label)}
          hrefs={navigation.map((item) => item.href)}
          accentColor="var(--accent)"
          textColor="var(--text-secondary)"
          markerColor="var(--border-strong)"
          proximityRadius={110}
          maxShift={24}
          markerLength={52}
          tickScale={0.42}
          itemGap={15}
          fontSize={1.05}
          smoothing={110}
        />
      </div>
      <div className="footer-meta">
        <span>© {new Date().getFullYear()}</span>
        <span>Kosovo</span>
        <Link href="/about">About Enis Qetaj</Link>
        <a href={identity.emailHref} target="_blank" rel="noreferrer">{identity.email}</a>
        <Link href="/#index">Back to top <ActionMark direction="up" /></Link>
      </div>
    </footer>
  );
}
