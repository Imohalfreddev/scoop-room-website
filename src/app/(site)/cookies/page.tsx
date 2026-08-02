// Repo path: src/app/(site)/cookies/page.tsx
import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/site/StaticPageLayout";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `How ${site.name} uses cookies and similar technologies.`,
};

export default function CookiesPage() {
  return (
    <StaticPageLayout
      title="Cookie Policy"
      subtitle='This Cookie Policy explains how Scoop Room ("we," "our," or "us") uses cookies and similar technologies on https://scooproomhq.com.'
      updated="August 2026"
    >
      <p>
        By using our website, you agree to the use of cookies as described in
        this policy.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a
        website. They help websites function properly, remember your
        preferences, improve performance, and provide a better browsing
        experience.
      </p>

      <h2>2. How We Use Cookies</h2>
      <p>We use cookies to:</p>
      <ul>
        <li>Keep the website functioning properly.</li>
        <li>Remember your preferences and settings.</li>
        <li>Understand how visitors use our website.</li>
        <li>Improve website performance and user experience.</li>
        <li>Deliver relevant advertisements where applicable.</li>
      </ul>

      <h2>3. Types of Cookies We Use</h2>
      <h3>Essential Cookies</h3>
      <p>
        These cookies are necessary for the website to function correctly.
        They support features such as login sessions, security, and website
        functionality. These cookies cannot be disabled through our website.
      </p>
      <h3>Analytics Cookies</h3>
      <p>
        These cookies help us understand how visitors use Scoop Room by
        collecting anonymous information about website traffic, page views,
        and performance. This information helps us improve the website.
      </p>
      <h3>Preference Cookies</h3>
      <p>
        These cookies remember your settings and preferences, such as theme
        selection, saved bookmarks, and other personalized features.
      </p>
      <h3>Advertising Cookies</h3>
      <p>
        If advertising is enabled, third-party providers such as Google
        AdSense may use cookies to display relevant advertisements and
        measure advertising performance.
      </p>

      <h2>4. Third-Party Cookies</h2>
      <p>
        Some third-party services used on Scoop Room, including analytics,
        advertising, embedded videos, and social media features, may place
        their own cookies on your device. These cookies are governed by the
        privacy policies of the respective providers.
      </p>

      <h2>5. Managing Cookies</h2>
      <p>
        Most web browsers allow you to control, block, or delete cookies
        through their settings. Please note that disabling essential cookies
        may affect certain features of the website and limit your browsing
        experience.
      </p>

      <h2>6. Changes to This Policy</h2>
      <p>
        We may update this Cookie Policy from time to time to reflect changes
        in our services, technology, or legal requirements. Any updates will
        be posted on this page with a revised &quot;Last updated&quot; date.
      </p>

      <h2>7. Contact Us</h2>
      <p>If you have any questions about this Cookie Policy, please contact us:</p>
      <p>
        Email:{" "}
        <a href="mailto:scooproomhq@gmail.com">scooproomhq@gmail.com</a>
      </p>

      <hr />
      <p className="text-sm text-muted">
        Scoop Room — The People&apos;s Stories. Told With Integrity.
      </p>
    </StaticPageLayout>
  );
}