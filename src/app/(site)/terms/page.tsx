import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/site/StaticPageLayout";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `The terms that govern use of ${site.name}.`,
};

export default function TermsPage() {
  return (
    <StaticPageLayout
      title="Terms of Use"
      subtitle={`The terms that govern your use of ${site.name}.`}
      updated="July 2026"
    >
      <p>
        These Terms of Use (&quot;Terms&quot;) govern your access to and use of{" "}
        {site.url.replace(/^https?:\/\//, "")} (the &quot;Site&quot;). By using the Site,
        you agree to these Terms. If you don&apos;t agree, please don&apos;t use the
        Site.
      </p>

      <h2>1. Use of the site</h2>
      <p>
        You may use the Site for lawful, personal, non-commercial purposes. You
        agree not to misuse the Site — including attempting to disrupt its
        operation, scraping content at scale without permission, or using it to
        distribute malware or spam.
      </p>

      <h2>2. Content ownership</h2>
      <p>
        Unless otherwise noted, all articles, images, graphics, and other
        content on the Site are owned by {site.name} or its licensors and are
        protected by copyright and other intellectual property laws. You may
        share links to our articles and quote brief excerpts with attribution
        and a link back, consistent with fair use. Republishing full articles
        without permission is not allowed.
      </p>

      <h2>3. User-generated content</h2>
      <p>
        If the Site allows comments or other submissions, you retain ownership
        of what you post, but you grant {site.name} a non-exclusive,
        royalty-free license to display, distribute, and moderate that content
        on the Site. You&apos;re responsible for what you post, and we may remove
        content that violates these Terms at our discretion.
      </p>

      <h2>4. Prohibited conduct</h2>
      <ul>
        <li>Posting unlawful, defamatory, harassing, or hateful content</li>
        <li>Impersonating any person or entity</li>
        <li>Attempting to gain unauthorized access to the Site or its systems</li>
        <li>Interfering with the Site&apos;s normal operation</li>
      </ul>

      <h2>5. Third-party links</h2>
      <p>
        The Site may link to third-party websites we don&apos;t control. We&apos;re not
        responsible for the content or practices of those sites.
      </p>

      <h2>6. Disclaimers</h2>
      <p>
        The Site and its content are provided &quot;as is&quot; without warranties of any
        kind. While we work to report accurately, news coverage can change as
        facts develop, and we don&apos;t guarantee that any article is complete,
        current, or error-free at all times.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {site.name} is not liable for
        any indirect, incidental, or consequential damages arising from your use
        of the Site.
      </p>

      <h2>8. Changes to these terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of the Site
        after changes take effect constitutes acceptance of the updated Terms.
      </p>

      <h2>9. Contact us</h2>
      <p>
        Questions about these Terms? Email{" "}
        <a href="mailto:legal@scooproom.com">legal@scooproom.com</a>.
      </p>

      <hr />
      <p className="text-sm text-muted">
        This page is a general template and is not a substitute for legal
        advice. Review it with a lawyer before relying on it, particularly the
        governing-law and liability sections, which are jurisdiction-specific.
      </p>
    </StaticPageLayout>
  );
}
