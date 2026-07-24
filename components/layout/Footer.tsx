import { navigation } from "@/data/site";

const primaryLabels = new Set(["Index", "Research", "Markets", "Work", "Build", "Contact"]);
const primaryNavigation = navigation.filter((item) => primaryLabels.has(item.label));

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-statement">
        <p>Enis Qetaj</p>
        <span>Context first. Then build.</span>
      </div>
      <nav aria-label="Footer navigation">
        {primaryNavigation.map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}
      </nav>
      <div className="footer-meta">
        <span>© {new Date().getFullYear()}</span>
        <span>Kosovo</span>
        <a href="mailto:enisqeta5@gmail.com">enisqeta5@gmail.com</a>
        <a href="#index">Back to top <span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  );
}
