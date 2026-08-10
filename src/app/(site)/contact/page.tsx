// Repo path: src/app/(site)/contact/page.tsx
import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/site/StaticPageLayout";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${site.name} — news tips, corrections, advertising, and general inquiries.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <StaticPageLayout
      title="Contact Us"
      subtitle="We'd love to hear from you. Whether you have a breaking news tip, correction, business inquiry, or general question, the Scoop Room team is here to help."
    >
      <h2>News Tips</h2>
      <p>
        Email:{" "}
        <a href="mailto:scooproomhq@gmail.com">scooproomhq@gmail.com</a>
      </p>
      <p>
        Have a breaking story, exclusive information, photos, or videos? Send
        them to us. We review every credible tip and protect confidential
        sources whenever possible.
      </p>

      <h2>Editorial &amp; Corrections</h2>
      <p>
        Email:{" "}
        <a href="mailto:scooproomhq@gmail.com">scooproomhq@gmail.com</a>
      </p>
      <p>
        Spotted an error or have feedback on one of our stories? Accuracy
        matters to us, and we welcome corrections and constructive feedback.
      </p>

      <h2>Advertising &amp; Partnerships</h2>
      <p>
        Email:{" "}
        <a href="mailto:scooproomhq@gmail.com">scooproomhq@gmail.com</a>
      </p>
      <p>
        Interested in advertising, sponsorships, collaborations, or business
        partnerships? We&apos;d be happy to discuss opportunities with you.
      </p>

      <h2>General Inquiries</h2>
      <p>
        Email:{" "}
        <a href="mailto:scooproomhq@gmail.com">scooproomhq@gmail.com</a>
      </p>
      <p>
        For all other questions, suggestions, media requests, or support,
        feel free to get in touch.
      </p>

      <h2>Follow Scoop Room</h2>
      <p>Stay connected and follow us for breaking news and updates.</p>
      <p>
        X (Twitter):{" "}
        <a
          href="https://x.com/ScoopRoomHQ"
          target="_blank"
          rel="noopener noreferrer"
        >
          @ScoopRoomHQ
        </a>
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