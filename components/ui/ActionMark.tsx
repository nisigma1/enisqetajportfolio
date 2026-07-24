type ActionMarkProps = {
  direction?: "external" | "forward" | "back" | "down" | "up";
  className?: string;
};

export function ActionMark({
  direction = "external",
  className = "",
}: ActionMarkProps) {
  return (
    <span
      className={`action-mark action-mark--${direction} ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
