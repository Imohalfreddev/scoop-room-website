// Repo path: src/app/(site)/about/page.tsx
import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/site/StaticPageLayout";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name} — ${site.description}`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <StaticPageLayout
      title="About Scoop Room"
      subtitle="The People's Stories. Told With Integrity."
    >
      <p>
        Scoop Room is an independent digital news and media platform
        dedicated to delivering the stories that matter most. From breaking
        news and public affairs to business, technology, entertainment,
        sports, lifestyle, and the conversations shaping society, we keep
        readers informed with speed, accuracy, and context.
      </p>
      <p>
        Our mission is simple: deliver trusted information without
        compromising integrity.
      </p>

      <h2>What We Do</h2>
      <p>
        We monitor trusted news sources and emerging stories around the clock
        to bring readers timely, relevant, and verified reporting. Every
        story goes through editorial review before publication to ensure it
        meets our standards for accuracy, fairness, and public interest.
      </p>
      <p>We believe being first is important—but being right is essential.</p>

      <h2>What We Cover</h2>
      <p>Scoop Room covers:</p>
      <ul>
        <li>Breaking News</li>
        <li>Trending Stories</li>
        <li>Politics &amp; Government</li>
        <li>Business &amp; Economy</li>
        <li>Technology &amp; AI</li>
        <li>Entertainment &amp; Celebrity News</li>
        <li>Sports</li>
        <li>Lifestyle &amp; Culture</li>
        <li>Crime &amp; Public Safety</li>
        <li>Human Interest Stories</li>
      </ul>
      <p>
        Our coverage begins with the stories that matter most to our audience
        while keeping an eye on important developments around the world.
      </p>

      <h2>Our Editorial Values</h2>
      <p>We are committed to:</p>
      <ul>
        <li>Accuracy before speculation.</li>
        <li>Fair and balanced reporting.</li>
        <li>Transparency when corrections are necessary.</li>
        <li>Respect for facts, privacy, and human dignity.</li>
        <li>Editorial independence from political and commercial influence.</li>
      </ul>

      <h2>Our Vision</h2>
      <p>
        To build one of the world&apos;s most trusted digital-first news
        platforms—connecting millions of people through reliable journalism,
        meaningful storytelling, and responsible reporting.
      </p>

      <h2>Contact Us</h2>
      <p>
        Have a news tip, correction, question, or partnership inquiry?
        We&apos;d love to hear from you.
      </p>
      <p>
        Email:{" "}
        <a href="mailto:scooproomhq@gmail.com">scooproomhq@gmail.com</a>
        <br />
        Website: <a href="https://scooproomhq.com">https://scooproomhq.com</a>
      </p>

      <hr />
      <p className="text-sm text-muted">
        Scoop Room — The People&apos;s Stories. Told With Integrity.
      </p>
    </StaticPageLayout>
  );
}