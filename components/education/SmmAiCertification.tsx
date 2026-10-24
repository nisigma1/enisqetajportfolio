/* eslint-disable @next/next/no-img-element -- Official local SVG logo with intrinsic dimensions. */
import styles from "./SmmAiCertification.module.css";

// Verified against the certificate supplied as private evidence. The certificate
// photograph, credential number and signature are intentionally not published.
export function SmmAiCertification() {
  return (
    <li className={`journey-field ${styles.certification}`}>
      <div className="journey-field__identity">
        <span className="journey-field__number">04</span>
        <h3>SMM + AI</h3>
        <p className="journey-field__status"><span aria-hidden="true" />Completed</p>
      </div>

      <div className={`journey-field__education ${styles.education}`}>
        <a className={styles.provider} href="https://hallakate.com/" target="_blank" rel="noopener noreferrer" aria-label="Hallakate — training provider">
          <img src="/images/education/hallakate-logo.svg" width="183" height="39" alt="Hallakate" loading="lazy" decoding="async" />
        </a>
        <div>
          <p>Certificate of Achievement</p>
          <strong>AI Social Media Marketing</strong>
          <span>Hallakate · BËHU AI SMM 2026</span>
        </div>
      </div>

      <div className="journey-field__skills">
        <p>Applied training</p>
        <ul aria-label="SMM and AI training focus">
          <li>AI Brand Strategy</li>
          <li>Social Media Content Planning</li>
          <li>AI Creative &amp; Video Production</li>
          <li>Performance Analysis</li>
        </ul>
      </div>

      <div className={`journey-field__experience ${styles.training}`}>
        <span>Certification</span>
        <p>Completed</p>
        <time dateTime="2026-10-23">23 October 2026</time>
      </div>
    </li>
  );
}
