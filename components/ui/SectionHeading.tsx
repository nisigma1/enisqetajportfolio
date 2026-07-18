type Props = {
  marker: string;
  title: string;
  intro?: string;
  className?: string;
};

export function SectionHeading({ marker, title, intro, className = "" }: Props) {
  return (
    <header className={`section-heading ${className}`}>
      <p className="section-marker">{marker}</p>
      <h2>{title}</h2>
      {intro && <p className="section-intro">{intro}</p>}
    </header>
  );
}

