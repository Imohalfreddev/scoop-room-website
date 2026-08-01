import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/site/StaticPageLayout";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses, and protects your information.`,
};

export default function PrivacyPage() {
  return (
    <StaticPageLayout
      title="Privacy Policy"
      subtitle={`This policy explains what information ${site.name} collects and how it's used.`}
      updated="July 2026"
    >
      <p>
        This Privacy Policy applies to {site.url.replace(/^https?:\/\//, "")} (the
        &quot;Site&quot;), operated by {site.name}. By using the Site, you agree to the
        collection and use of information as described here.
      </p>

      <h2>1. Information we collect</h2>
      <p>
        <strong>Information you provide directly:</strong> if you subscribe to our
        newsletter, leave a comment, or contact us, we collect the information
        you provide, such as your email address and any message content.
      </p>
      <p>
        <strong>Information collected automatically:</strong> like most websites,
        we automatically collect certain technical information when you visit —
        including IP address, browser type, device type, pages viewed, and
        referring URLs — typically via cookies and similar technologies. See our{" "}
        <a href="/cookies">Cookie Policy</a> for details.
      </p>

      <h2>2. How we use information</h2>
      <ul>
        <li>To operate, maintain, and improve the Site</li>
        <li>To send newsletters or notifications you&apos;ve opted into</li>
        <li>To understand aggregate readership and site performance</li>
        <li>To detect, prevent, and address technical issues or abuse</li>
        <li>To serve advertising, where enabled (see Section 4)</li>
      </ul>

      <h2>3. Cookies and tracking</h2>
      <p>
        We use cookies for essential site functionality (such as remembering
        your theme preference) and, where enabled, for analytics and
        advertising. You can control cookies through your browser settings. See
        our <a href="/cookies">Cookie Policy</a> for the full list of cookie
        categories we use.
      </p>

      <h2>4. Third-party services</h2>
      <p>
        We may use third-party services for analytics and advertising (for
        example, Google AdSense). These providers may collect information about
        your visits to this and other sites in order to serve relevant
        advertising. These providers have their own privacy policies governing
        their use of your information.
      </p>

      <h2>5. Data sharing</h2>
      <p>
        We do not sell your personal information. We may share information with
        service providers who help us operate the Site (such as hosting or
        analytics providers), or where required by law.
      </p>

      <h2>6. Data retention</h2>
      <p>
        We retain information for as long as necessary to provide the Site and
        fulfill the purposes described in this policy, unless a longer retention
        period is required by law.
      </p>

      <h2>7. Your rights</h2>
      <p>
        Depending on where you live, you may have rights to access, correct, or
        delete your personal information, or to object to certain processing.
        To exercise these rights, contact us at{" "}
        <a href="mailto:privacy@scooproom.com">privacy@scooproom.com</a>.
      </p>

      <h2>8. Children&apos;s privacy</h2>
      <p>
        The Site is not directed at children under 13, and we do not knowingly
        collect personal information from children under 13.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Material changes
        will be reflected by an updated &quot;Last updated&quot; date at the top of this
        page.
      </p>

      <h2>10. Contact us</h2>
      <p>
        Questions about this policy? Email{" "}
        <a href="mailto:privacy@scooproom.com">privacy@scooproom.com</a>.
      </p>

      <hr />
      <p className="text-sm text-muted">
        This page is a general template and is not a substitute for legal
        advice. Review it with a lawyer familiar with the data protection laws
        that apply to where your readers are located before relying on it.
      </p>
    </StaticPageLayout>
  );
}
