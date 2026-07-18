type Props = { label?: string; variant?: "line" | "nodes" | "steps" };

export function SignalThread({ label = "Signal / Context / Intelligence / System", variant = "line" }: Props) {
  return (
    <div className={`signal-thread signal-thread--${variant}`} aria-hidden="true">
      <span className="signal-thread-line" />
      <span className="signal-thread-node signal-thread-node--a" />
      <span className="signal-thread-node signal-thread-node--b" />
      <small>{label}</small>
    </div>
  );
}

