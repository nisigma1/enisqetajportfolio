"use client";

import { useState } from "react";
import { expertise, marketTopics } from "@/data/expertise";
import { productTypes, services } from "@/data/services";

export function ExpertiseIndex() {
  const [active, setActive] = useState(0);
  const item = expertise[active];
  return (
    <div className="expertise-system">
      <div className="expertise-index" role="tablist" aria-label="Areas of expertise">
        {expertise.map((entry, index) => (
          <button key={entry.title} type="button" role="tab" aria-selected={active === index} aria-controls="expertise-panel" onClick={() => setActive(index)}>
            <span>{String(index + 1).padStart(2, "0")}</span>{entry.title}<i aria-hidden="true">↗</i>
          </button>
        ))}
      </div>
      <div id="expertise-panel" className="expertise-detail" role="tabpanel">
        <div className="detail-number">{String(active + 1).padStart(2, "0")}<span>/ 06</span></div>
        <p>{item.description}</p>
        <div className="detail-keywords" aria-label="Supporting keywords">
          {item.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
        </div>
        <div className="detail-structure" aria-hidden="true"><i /><i /><i /><span /></div>
        <small>Selected capability / {item.title}</small>
      </div>
    </div>
  );
}

export function ResearchConstellation() {
  const [active, setActive] = useState(3);
  const item = marketTopics[active];
  return (
    <div className="constellation-system">
      <div className="constellation" role="tablist" aria-label="Market research topics">
        <div className="constellation-lines" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        {marketTopics.map((topic, index) => (
          <button
            key={topic.title}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-controls="market-topic"
            style={{ "--topic-index": index } as React.CSSProperties}
            onClick={() => setActive(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>{topic.title}
          </button>
        ))}
      </div>
      <div id="market-topic" className="constellation-detail" role="tabpanel">
        <p className="technical-label">Selected research lens / {String(active + 1).padStart(2, "0")}</p>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <div className="relation-line"><span>Signal</span><i /><span>Context</span><i /><span>Interpretation</span></div>
      </div>
    </div>
  );
}

export function BuildCanvas() {
  const [active, setActive] = useState(0);
  const item = productTypes[active];
  return (
    <div className="build-system">
      <div className="product-selector" role="tablist" aria-label="Product types">
        {productTypes.map((product, index) => (
          <button key={product.title} type="button" role="tab" aria-selected={active === index} aria-controls="product-panel" onClick={() => setActive(index)}>
            <span>{String(index + 1).padStart(2, "0")}</span>{product.title}
          </button>
        ))}
      </div>
      <div id="product-panel" className="product-panel" role="tabpanel">
        <div className="product-blueprint" aria-hidden="true">
          <span className="blueprint-label">INPUT / {item.title.toUpperCase()}</span>
          {item.flow.map((step, index) => <div className="blueprint-module" key={step}><small>0{index + 1}</small>{step}</div>)}
          <i className="blueprint-thread" />
        </div>
        <div className="product-copy">
          <dl>
            <div><dt>Who it is for</dt><dd>{item.audience}</dd></div>
            <div><dt>Problem</dt><dd>{item.problem}</dd></div>
            <div><dt>Possible deliverables</dt><dd>{item.deliverables}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export function ServiceNavigator() {
  const [active, setActive] = useState(0);
  const item = services[active];
  return (
    <div className="service-system">
      <div className="service-list" role="tablist" aria-label="Services">
        {services.map((service, index) => (
          <button key={service.title} type="button" role="tab" aria-selected={active === index} aria-controls="service-panel" onClick={() => setActive(index)}>
            <span>{String(index + 1).padStart(2, "0")}</span>{service.title}
          </button>
        ))}
      </div>
      <div id="service-panel" className="service-panel" role="tabpanel">
        <p className="technical-label">Service navigator / {String(active + 1).padStart(2, "0")}</p>
        <h3>{item.title}</h3>
        <dl>
          <div><dt>What is it?</dt><dd>{item.what}</dd></div>
          <div><dt>Who is it for?</dt><dd>{item.forWhom}</dd></div>
          <div><dt>What problem does it solve?</dt><dd>{item.problem}</dd></div>
          <div><dt>What can be delivered?</dt><dd>{item.deliverables}</dd></div>
        </dl>
        <a className="text-link" href="#contact">Discuss your project <span>↗</span></a>
      </div>
    </div>
  );
}

