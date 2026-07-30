import type { Metadata } from "next";
import { BarberBrothersShowcase } from "@/components/showcase/BarberBrothersShowcase";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Barber Brothers portfolio cover",
  robots: { index: false, follow: false },
};

export default function BarberBrothersCover() {
  return (
    <main id="main" className="bb-cover-route">
      <BarberBrothersShowcase priority variant="cover" />
    </main>
  );
}
