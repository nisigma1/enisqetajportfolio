import { permanentRedirect } from "next/navigation";

/**
 * Legacy route retained so existing bookmarks and external links consolidate on
 * the single Malera Studio page instead of competing with it in search.
 */
export default function MaleraLegacyRoute() {
  permanentRedirect("/companies");
}
