// Repo path: src/app/(site)/ethics/page.tsx
import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/site/StaticPageLayout";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Newsroom Ethics",
  description: `The editorial principles guiding ${site.name}'s newsroom.`,
  alternates: { canonical: "/ethics" },
};

export default function EthicsPage() {
  return (
    <StaticPageLayout
      title="Newsroom Ethics"
      subtitle="At Scoop Room, trust is our most valuable asset. Our newsroom is guided by the principles of accuracy, integrity, transparency, independence, and accountability. These standards shape every story we publish and every decision we make."
      updated="August 2026"
    >
      <h2>Accuracy Above Speed</h2>
      <p>
        We strive to report breaking news quickly, but never at the expense
        of accuracy.
      </p>
      <p>
        Every story is reviewed against reliable sources before publication.
        When information cannot be independently verified, we clearly state
        what is confirmed, what remains unverified, and what is still
        developing.
      </p>
      <p>If we cannot verify a claim, we do not publish it as fact.</p>

      <h2>Fair &amp; Responsible Reporting</h2>
      <p>
        We are committed to reporting honestly, fairly, and without
        unnecessary sensationalism.
      </p>
      <p>
        Our coverage seeks to provide context, present verified facts, and
        respect the dignity and privacy of individuals affected by the news.
      </p>

      <h2>Our Sources</h2>
      <p>
        We rely on trusted news organizations, official government agencies,
        public records, eyewitness accounts, and other credible sources.
      </p>
      <p>
        Whenever possible, we credit and link to the original source.
      </p>
      <p>We clearly distinguish between:</p>
      <ul>
        <li>Verified facts</li>
        <li>Official statements</li>
        <li>Developing reports</li>
        <li>Opinion and analysis</li>
      </ul>
      <p>
        Anonymous sources are used only when necessary and after careful
        editorial review.
      </p>

      <h2>Technology in Our Newsroom</h2>
      <p>
        Scoop Room uses technology to monitor breaking news and identify
        stories of public interest across multiple trusted sources.
      </p>
      <p>
        Automation helps our newsroom discover potential stories, but it
        never publishes content automatically.
      </p>
      <p>
        Every article is reviewed, verified, and approved by a human editor
        before publication.
      </p>

      <h2>Corrections &amp; Updates</h2>
      <p>Accuracy does not end at publication.</p>
      <p>
        If we discover an error, we will correct it promptly and
        transparently. Significant corrections or updates will be clearly
        noted within the article.
      </p>
      <p>
        Readers are encouraged to report mistakes or provide additional
        verified information.
      </p>

      <h2>Editorial Independence</h2>
      <p>
        Our editorial decisions are made independently of advertisers,
        sponsors, governments, political parties, corporations, and other
        outside interests.
      </p>
      <p>
        Commercial relationships never determine what we report or how we
        report it.
      </p>
      <p>
        Any sponsored or promotional content will always be clearly
        identified.
      </p>

      <h2>Conflicts of Interest</h2>
      <p>
        Our editors and contributors must avoid situations that could
        compromise—or appear to compromise—their independence.
      </p>
      <p>
        Any personal, financial, or professional conflict related to a story
        must be disclosed, and where appropriate, the individual will not
        participate in that coverage.
      </p>

      <h2>Accountability</h2>
      <p>We believe journalism should be transparent and accountable.</p>
      <p>
        If you believe we have made a mistake, published inaccurate
        information, or failed to meet our editorial standards, we encourage
        you to contact us. Every concern is reviewed seriously and fairly.
      </p>
      <p>
        Email:{" "}
        <a href="mailto:scooproomhq@gmail.com">scooproomhq@gmail.com</a>
      </p>

      <h2>Our Vision</h2>
      <p>
        To become one of the world&apos;s most trusted digital
        newsrooms—delivering accurate journalism, meaningful stories, and
        responsible reporting that informs the public, respects human
        dignity, and strengthens free expression.
      </p>

      <hr />
      <p className="text-sm text-muted">
        Scoop Room — The People&apos;s Stories. Told With Integrity.
      </p>
    </StaticPageLayout>
  );
}