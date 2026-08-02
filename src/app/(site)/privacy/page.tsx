// Repo path: src/app/(site)/privacy/page.tsx
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
      subtitle="Welcome to Scoop Room. Your privacy matters to us. This Privacy Policy explains what information we collect, how we use it, and the choices you have when using scooproomhq.com."
      updated="August 2026"
    >
      <p>
        By accessing or using our website, you agree to this Privacy Policy.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We may collect:</p>
      <ul>
        <li>
          Information you provide voluntarily, such as your email address when
          subscribing to our newsletter or contacting us.
        </li>
        <li>
          Technical information collected automatically, including your IP
          address, browser type, device information, pages visited, and
          referral source through cookies and similar technologies.
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Operate and improve Scoop Room.</li>
        <li>Deliver news updates and newsletters you subscribe to.</li>
        <li>Understand how visitors use our website.</li>
        <li>Protect the website against fraud, spam, and abuse.</li>
        <li>Display advertising where applicable.</li>
      </ul>

      <h2>3. Cookies</h2>
      <p>
        Scoop Room uses cookies to improve your browsing experience, remember
        your preferences, measure website performance, and support
        advertising. You can disable cookies at any time through your browser
        settings.
      </p>

      <h2>4. Third-Party Services</h2>
      <p>
        We may use trusted third-party services such as Google AdSense,
        Google Analytics, and other service providers to help operate the
        website. These services may collect information according to their
        own privacy policies.
      </p>

      <h2>5. Data Sharing</h2>
      <p>
        We do not sell your personal information. We may share limited
        information with trusted service providers that help operate the
        website or when required by law.
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We keep personal information only for as long as necessary to provide
        our services, comply with legal obligations, and protect our
        platform.
      </p>

      <h2>7. Your Rights</h2>
      <p>
        Depending on your location, you may have the right to access,
        correct, update, or delete your personal information. To make a
        request, contact us using the email below.
      </p>

      <h2>8. Children&apos;s Privacy</h2>
      <p>
        Scoop Room is not intended for children under the age of 13, and we
        do not knowingly collect personal information from children.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will
        be posted on this page with the updated revision date.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy or your personal
        information, please contact us:
      </p>
      <p>
        Email:{" "}
        <a href="mailto:scooproomhq@gmail.com">scooproomhq@gmail.com</a>
      </p>

      <hr />
      <p className="text-sm text-muted">
        Thank you for trusting Scoop Room — The People&apos;s Stories. Told
        With Integrity.
      </p>
    </StaticPageLayout>
  );
}