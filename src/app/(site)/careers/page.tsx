// Repo path: src/app/(site)/careers/page.tsx
import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/site/StaticPageLayout";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Careers",
  description: `Careers and opportunities at ${site.name}.`,
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <StaticPageLayout
      title="Careers"
      subtitle="Build the Future of Scoop Room"
    >
      <p>
        At Scoop Room, we&apos;re building a modern digital newsroom driven
        by speed, accuracy, integrity, and innovation. Our mission is to tell
        The People&apos;s Stories while delivering trusted news, meaningful
        journalism, and stories that matter.
      </p>
      <p>
        Whether you&apos;re a journalist, editor, developer, designer, or
        creative thinker, we&apos;d love to hear from passionate people who
        share our vision.
      </p>

      <hr />

      <h2>Current Opportunities</h2>
      <p>We don&apos;t have any open positions at the moment.</p>
      <p>
        As Scoop Room continues to grow, all available roles will be
        published on this page.
      </p>
      <p>
        Even if there isn&apos;t a current opening that matches your skills,
        we welcome speculative applications from talented individuals who
        believe they can contribute to our mission.
      </p>

      <hr />

      <h2>Who We&apos;re Looking For</h2>
      <p>We&apos;re always interested in hearing from:</p>
      <ul>
        <li>Journalists &amp; Reporters</li>
        <li>Editors &amp; Fact-Checkers</li>
        <li>Software Engineers</li>
        <li>Product Designers (UI/UX)</li>
        <li>Data &amp; AI Engineers</li>
        <li>Social Media Managers</li>
        <li>Video Editors &amp; Content Creators</li>
        <li>SEO &amp; Growth Specialists</li>
        <li>Marketing &amp; Business Development Professionals</li>
      </ul>
      <p>
        If you&apos;re passionate about journalism, technology, storytelling,
        or building products that inform millions of people, we&apos;d love
        to connect.
      </p>

      <hr />

      <h2>Why Join Scoop Room?</h2>
      <ul>
        <li>Help shape a fast-growing digital media platform.</li>
        <li>Work on meaningful stories that inform and inspire.</li>
        <li>
          Collaborate with a team that values integrity, innovation, and
          excellence.
        </li>
        <li>Contribute to building the future of modern journalism.</li>
      </ul>

      <hr />

      <h2>Apply</h2>
      <p>To express your interest, send us:</p>
      <ul>
        <li>A short introduction about yourself.</li>
        <li>Your CV or résumé.</li>
        <li>Portfolio or work samples (if applicable).</li>
        <li>The role you&apos;re interested in.</li>
      </ul>
      <p>
        Email:{" "}
        <a href="mailto:scooproomhq@gmail.com">scooproomhq@gmail.com</a>
      </p>
      <p>
        Every application is carefully reviewed, and we&apos;ll contact you
        if there&apos;s a suitable opportunity.
      </p>

      <hr />
      <p className="text-sm text-muted">
        Scoop Room — The People&apos;s Stories. Told With Integrity.
      </p>
    </StaticPageLayout>
  );
}