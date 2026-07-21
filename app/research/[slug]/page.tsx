import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Research note not found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResearchEntry() {
  notFound();
}
