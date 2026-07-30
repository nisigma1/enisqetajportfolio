"use client";

/* eslint-disable @next/next/no-img-element -- The logo is a small pre-compressed local WebP with explicit intrinsic dimensions. */
import { useMemo, useState } from "react";
import {
  cryptoCurriculumModules,
  cryptoCurriculumTracks,
  type CryptoCurriculumModule,
  type CryptoCurriculumTrack,
} from "@/data/crypto-school";

function CurriculumIntroduction() {
  return (
    <div className="curriculum-introduction">
      <img
        className="curriculum-introduction__logo"
        src="/images/crypto-school-logo.webp"
        width="960"
        height="538"
        alt="Crypto School"
        loading="lazy"
        decoding="async"
      />
      <p className="section-label">02 / Applied learning</p>
      <h2 id="crypto-curriculum-title">Crypto Markets Curriculum</h2>
      <p className="curriculum-introduction__title">
        A structured foundation in crypto markets.
      </p>
      <p className="curriculum-introduction__copy">
        Completed a practical Crypto School curriculum covering blockchain
        technology, major crypto networks, security, market analysis, risk
        management, decentralized finance and investor behavior.
      </p>
      <p className="curriculum-introduction__status">
        <span aria-hidden="true" />
        Completed curriculum
      </p>
      <dl className="curriculum-introduction__facts" aria-label="Curriculum overview">
        <div>
          <dt>Modules</dt>
          <dd>11</dd>
        </div>
        <div>
          <dt>Learning tracks</dt>
          <dd>03</dd>
        </div>
        <div>
          <dt>Focus</dt>
          <dd>Applied markets</dd>
        </div>
      </dl>
      <p className="curriculum-introduction__relevance">
        This curriculum built the foundation for how I approach crypto markets:
        understand the technology, analyze the asset, manage risk and interpret
        market behavior.
      </p>
    </div>
  );
}

function CurriculumModule({
  module,
  track,
  active,
  onSelect,
}: {
  module: CryptoCurriculumModule;
  track: CryptoCurriculumTrack;
  active: boolean;
  onSelect: (module: CryptoCurriculumModule) => void;
}) {
  return (
    <li
      className="curriculum-module"
      data-active={active ? "true" : undefined}
      data-track={track.id}
    >
      <button
        type="button"
        aria-expanded={active}
        aria-controls={`curriculum-module-panel-${module.id} curriculum-active-detail`}
        onClick={() => onSelect(module)}
      >
        <span className="curriculum-module__number">{module.number}</span>
        <span className="curriculum-module__title">{module.title}</span>
        <span className="curriculum-module__track">{track.label}</span>
        <span className="curriculum-module__state" aria-hidden="true" />
      </button>
      <div
        id={`curriculum-module-panel-${module.id}`}
        className="curriculum-module__mobile-detail"
        hidden={!active}
      >
        <CurriculumDetailContent module={module} />
      </div>
    </li>
  );
}

function CurriculumTrack({
  track,
  modules,
  activeId,
  onSelect,
}: {
  track: CryptoCurriculumTrack;
  modules: readonly CryptoCurriculumModule[];
  activeId: string;
  onSelect: (module: CryptoCurriculumModule) => void;
}) {
  return (
    <section
      className="curriculum-track"
      data-track={track.id}
      aria-labelledby={`curriculum-track-${track.id}`}
    >
      <header>
        <span>{track.number}</span>
        <h3 id={`curriculum-track-${track.id}`}>{track.label}</h3>
        <p>{String(modules.length).padStart(2, "0")} modules</p>
      </header>
      <ol>
        {modules.map((module) => (
          <CurriculumModule
            key={module.id}
            module={module}
            track={track}
            active={module.id === activeId}
            onSelect={onSelect}
          />
        ))}
      </ol>
    </section>
  );
}

function CurriculumDetailContent({
  module,
}: {
  module: CryptoCurriculumModule;
}) {
  return (
    <>
      <h3 className="curriculum-detail__title">{module.title}</h3>
      <div>
        <p>What it covers</p>
        <p>{module.summary}</p>
      </div>
      <div>
        <p>Why it matters</p>
        <p>{module.whyItMatters}</p>
      </div>
      <p className="curriculum-detail__status">
        <span aria-hidden="true" />
        Completed module
      </p>
    </>
  );
}

function CurriculumModuleDetails({
  module,
  track,
}: {
  module: CryptoCurriculumModule;
  track: CryptoCurriculumTrack;
}) {
  return (
    <aside
      id="curriculum-active-detail"
      className="curriculum-detail"
      data-track={track.id}
      aria-live="polite"
    >
      <div className="curriculum-detail__identity">
        <span>Module {module.number}</span>
        <span>{track.label}</span>
      </div>
      <CurriculumDetailContent module={module} />
    </aside>
  );
}

function KnowledgeSpine() {
  const [activeId, setActiveId] = useState(cryptoCurriculumModules[0].id);
  const activeModule =
    cryptoCurriculumModules.find((module) => module.id === activeId) ??
    cryptoCurriculumModules[0];
  const activeTrack =
    cryptoCurriculumTracks.find((track) => track.id === activeModule.track) ??
    cryptoCurriculumTracks[0];

  const groupedModules = useMemo(
    () =>
      cryptoCurriculumTracks.map((track) => ({
        track,
        modules: cryptoCurriculumModules.filter(
          (module) => module.track === track.id,
        ),
      })),
    [],
  );

  return (
    <div className="knowledge-spine">
      <ol className="knowledge-spine__progression" aria-label="Learning progression">
        {cryptoCurriculumTracks.map((track, index) => (
          <li key={track.id} data-track={track.id}>
            <span>{track.number}</span>
            <strong>{track.progressionLabel}</strong>
            {index < cryptoCurriculumTracks.length - 1 ? (
              <i aria-hidden="true" />
            ) : null}
          </li>
        ))}
      </ol>

      <div className="knowledge-spine__workspace">
        <div className="knowledge-spine__tracks">
          {groupedModules.map(({ track, modules }) => (
            <CurriculumTrack
              key={track.id}
              track={track}
              modules={modules}
              activeId={activeModule.id}
              onSelect={(module) => setActiveId(module.id)}
            />
          ))}
        </div>
        <CurriculumModuleDetails module={activeModule} track={activeTrack} />
      </div>
    </div>
  );
}

export function CryptoCurriculumSection() {
  return (
    <section
      id="crypto-curriculum"
      className="site-section crypto-curriculum"
      aria-labelledby="crypto-curriculum-title"
    >
      <CurriculumIntroduction />
      <KnowledgeSpine />
      <p className="crypto-curriculum__closing">
        Technology provides the foundation. Analysis, risk and behavior shape
        the decision.
      </p>
    </section>
  );
}
