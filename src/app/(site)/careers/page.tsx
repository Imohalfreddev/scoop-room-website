import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/site/StaticPageLayout";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Careers",
  description: `Open roles at ${site.name}.`,
};

export default function CareersPage() {
  return (
    <StaticPageLayout
      title="Careers"
      subtitle={`Help us build the newsroom ${site.name} is becoming.`}
    >
      <p>
        We&apos;re a small, fast-moving newsroom focused on covering Nigeria, Africa,
        and the world with speed and accuracy. We care about clear writing,
        rigorous sourcing, and shipping things that work.
      </p>

      <h2>Open roles</h2>
      <p>
        We don&apos;t have any open positions listed right now. When we do, they&apos;ll
        be posted here first. In the meantime, we&apos;re always glad to hear from
        strong reporters, editors, and engineers — send a note and your work to
        the email below and we&apos;ll keep it on file.
      </p>

      <h2>How to reach us</h2>
      <p>
        Email <a href="mailto:careers@scooproom.com">careers@scooproom.com</a> with
        a short note about what you&apos;re interested in and a couple of writing or
        work samples. We read every message.
      </p>
    </StaticPageLayout>
  );
}
