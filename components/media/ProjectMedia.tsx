/* eslint-disable @next/next/no-img-element -- Local, pre-compressed project media is art-directed with explicit dimensions. */

type ProjectMediaProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  mode?: "natural" | "landscape" | "portrait" | "identity";
  focalPoint?: string;
  caption?: string;
  priority?: boolean;
  className?: string;
};

export function ProjectMedia({
  src,
  alt,
  width,
  height,
  mode = "natural",
  focalPoint = "50% 50%",
  caption,
  priority = false,
  className = "",
}: ProjectMediaProps) {
  return (
    <figure className={`project-media project-media--${mode} ${className}`.trim()}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{ objectPosition: focalPoint }}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
