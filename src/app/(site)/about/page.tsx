import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/site/StaticPageLayout";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name} — ${site.description}`,
};

export default function AboutPage() {
  return (
    <StaticPageLayout title={`About ${site.name}`} subtitle={site.tagline}>
      <p>
        {site.name} is a digital-first newsroom covering Nigeria, Africa, and the
        wider world — politics, business, technology, entertainment, sports, and
        culture. We exist to help readers understand what&apos;s happening, fast,
        without sacrificing accuracy.
      </p>

      <h2>What we do</h2>
      <p>
        Our newsroom combines wide, continuous monitoring of breaking news with
        editorial review before anything is published. Stories are surfaced from a
        broad set of sources, checked against our editorial standards, and
        reviewed by a human editor before they appear on the site. Speed matters
        to us, but not more than getting it right.
      </p>

      <h2>What we cover</h2>
      <p>
        We report on the stories shaping Nigeria and Africa alongside global
        politics, business, technology (including AI), entertainment, sports, and
        lifestyle. Our coverage is organized so you can follow the beats that
        matter to you specifically.
      </p>

      <h2>Editorial independence</h2>
      <p>
        Our reporting and editorial decisions are made independently of
        advertisers, sponsors, and any other commercial relationship. See our{" "}
        <a href="/ethics">Newsroom Ethics</a> page for more on how we handle
        sourcing, corrections, and conflicts of interest.
      </p>

      <h2>Get in touch</h2>
      <p>
        Have a tip, a correction, or a question about a story? Visit our{" "}
        <a href="/contact">Contact</a> page — we read everything that comes in.
      </p>
    </StaticPageLayout>
  );
}
