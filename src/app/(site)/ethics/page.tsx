import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/site/StaticPageLayout";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Newsroom Ethics",
  description: `The editorial standards ${site.name} holds itself to.`,
};

export default function EthicsPage() {
  return (
    <StaticPageLayout
      title="Newsroom Ethics"
      subtitle="The standards we hold ourselves to, and how to hold us accountable."
      updated="July 2026"
    >
      <h2>Accuracy first</h2>
      <p>
        We would rather be second and correct than first and wrong. Stories are
        reviewed by an editor against their original sources before publication.
        When we can&apos;t verify a claim to our standard, we don&apos;t publish it, or we
        say plainly what we don&apos;t yet know.
      </p>

      <h2>Sourcing</h2>
      <p>
        We attribute claims to their original source and link out to it wherever
        possible. We distinguish clearly between confirmed fact, official
        statements, and unverified reports. Anonymous sources are used sparingly
        and only when a story can&apos;t be reported otherwise.
      </p>

      <h2>How technology is used in our newsroom</h2>
      <p>
        {site.name} uses automated monitoring to help our editors track breaking
        news across a large number of sources in real time. That monitoring
        surfaces candidate stories — it does not publish them. A human editor
        reviews and approves every story before it appears on the site. We
        disclose this because we think readers deserve to know how their news
        gets made.
      </p>

      <h2>Corrections</h2>
      <p>
        When we get something wrong, we fix it and say so. Material corrections
        are noted at the bottom of the corrected article along with the date of
        the correction. If you spot an error, please tell us — see{" "}
        <a href="/contact">Contact</a>.
      </p>

      <h2>Independence</h2>
      <p>
        Advertisers and sponsors have no input into what we cover or how we cover
        it. Sponsored content, where it exists, is clearly labeled as such and is
        held to the same factual standard as our editorial work.
      </p>

      <h2>Conflicts of interest</h2>
      <p>
        Our editors and writers disclose personal, financial, or professional
        conflicts of interest related to a story, and recuse themselves from
        coverage where a conflict can&apos;t be adequately disclosed.
      </p>

      <h2>Questions or concerns</h2>
      <p>
        If you believe we&apos;ve fallen short of these standards, we want to hear
        about it. Reach us through <a href="/contact">Contact</a>.
      </p>
    </StaticPageLayout>
  );
}
