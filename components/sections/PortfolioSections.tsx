import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SignalThread } from "@/components/visuals/SignalThread";
import { ServiceNavigator } from "./InteractiveSystems";
import { ContactForm } from "@/components/forms/ContactForm";
import { researchCategories } from "@/data/research";

export function WorkSection() {
  return (
    <section id="work" className="section work-section">
      <SectionHeading marker="05 / WORK" title="Selected systems and digital products." />
      <div className="work-exhibition">
        <div className="work-visual" aria-hidden="true">
          <span className="work-status">Archive framework / 00</span>
          <div className="work-system-map"><i /><i /><i /><i /><b /><b /></div>
          <p>Research → Interface → Product</p>
        </div>
        <div className="work-empty">
          <p className="technical-label">Private / In development</p>
          <h3>Selected work is being documented.</h3>
          <p>Real project narratives will appear here when their context, process and outcomes are ready to share. No invented case studies. No borrowed credibility.</p>
          <Link className="text-link" href="/work">Enter the work archive <span>↗</span></Link>
        </div>
      </div>
      <SignalThread label="Project path / Evidence before claims" variant="nodes" />
    </section>
  );
}

export function ResearchSection() {
  return (
    <section id="research" className="section research-section">
      <SectionHeading marker="06 / RESEARCH" title="Separate signals. A clearer view." />
      <div className="research-archive">
        <div className="research-categories" aria-label="Future research categories">
          {researchCategories.map((category, index) => <span key={category}><b>{String(index + 1).padStart(2, "0")}</b>{category}</span>)}
        </div>
        <div className="research-empty">
          <p className="technical-label">Archive status / In development</p>
          <h3>Research archive in development.</h3>
          <p>Future notes will connect market structure, liquidity, macroeconomics, geopolitics and digital assets.</p>
          <Link className="text-link" href="/research">View archive structure <span>↗</span></Link>
        </div>
      </div>
      <SignalThread label="Sources / Notes / Relationships / Research" />
    </section>
  );
}

export function ServicesSection() {
  return (
    <section className="section services-section">
      <SectionHeading marker="07 / SERVICES" title="What I can help you build." intro="Choose a direction to see what it is for, the problem it addresses and what a focused engagement can deliver." />
      <ServiceNavigator />
      <SignalThread label="Need / Scope / Delivery" variant="steps" />
    </section>
  );
}

const stages = [
  ["Understand", "Clarify the problem, audience, objective and required outcome."],
  ["Research", "Study the market, users, context, competitors and opportunities."],
  ["Structure", "Define the content hierarchy, user journey and product priorities."],
  ["Design", "Create a distinctive visual direction and intentional user experience."],
  ["Build", "Develop the responsive and functional digital product."],
  ["Refine", "Improve performance, accessibility, interaction and final details."],
];

export function ProcessSection() {
  return (
    <section className="section process-section">
      <SectionHeading marker="08 / PROCESS" title="A clear path from idea to launch." />
      <div className="process-path">
        <aside><p>Active path</p><strong>01—06</strong><i /></aside>
        <ol>
          {stages.map(([title, description], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{description}</p></li>)}
        </ol>
      </div>
      <SignalThread label="A controlled path / No hidden stages" variant="steps" />
    </section>
  );
}

export function EducationSection() {
  return (
    <section className="section education-section">
      <SectionHeading marker="09 / EDUCATION" title="Business thinking strengthened by finance." />
      <div className="education-timeline">
        <div><span>Bachelor’s degree</span><h3>Marketing</h3><p>Completed</p></div>
        <i aria-hidden="true" />
        <div><span>Master’s degree</span><h3>Banking and Finance</h3><p>First year currently in progress</p></div>
      </div>
      <p className="education-copy">Marketing developed my understanding of users, communication, positioning and business. Banking and Finance is strengthening my understanding of markets, financial systems and economic decision-making.</p>
      <SignalThread label="Marketing / Finance / Product thinking" variant="nodes" />
    </section>
  );
}

export function BeyondSection() {
  return (
    <section className="section beyond-section">
      <SectionHeading marker="10 / BEYOND" title="Beyond the analysis." />
      <div className="beyond-grid">
        <p>Curiosity shapes how I work. I enjoy learning, connecting ideas from different fields and understanding why systems behave the way they do. Outside markets and technology, football is one of the things I follow most.</p>
        <div className="formation" aria-label="Abstract football formation showing position, movement and connection">
          {[...Array(10)].map((_, index) => <i key={index} />)}
          <span /><span /><span /><b>Space → movement → connection</b>
        </div>
      </div>
      <SignalThread label="Curiosity / Position / Movement" />
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="section contact-section">
      <div className="contact-heading">
        <p className="section-marker">11 / CONTACT</p>
        <p className="availability"><i /> Available for select freelance projects</p>
        <h2>Have an idea<br /><em>worth building?</em></h2>
        <p>Let’s turn it into something useful, intelligent and visually distinct.</p>
        <a href="mailto:enisqeta5@gmail.com">enisqeta5@gmail.com <span>↗</span></a>
      </div>
      <ContactForm />
      <SignalThread label="The signal resolves here / Start a conversation" variant="nodes" />
    </section>
  );
}

