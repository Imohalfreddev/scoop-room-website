// Repo path: src/app/(site)/terms/page.tsx
import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/site/StaticPageLayout";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `The Terms of Use governing access to and use of ${site.name}.`,
};

export default function TermsPage() {
  return (
    <StaticPageLayout
      title="Terms of Use"
      subtitle='Welcome to Scoop Room ("we," "our," or "us"). These Terms of Use govern your access to and use of https://scooproomhq.com (the "Site"). By accessing or using the Site, you agree to these Terms. If you do not agree, please do not use the Site.'
      updated="August 2026"
    >
      <h2>1. Acceptance of Terms</h2>
      <p>
        By using Scoop Room, you confirm that you have read, understood, and
        agreed to these Terms of Use and our Privacy Policy.
      </p>

      <h2>2. Use of the Website</h2>
      <p>You may use the Site only for lawful purposes. You agree not to:</p>
      <ul>
        <li>Violate any applicable laws or regulations.</li>
        <li>Interfere with the operation or security of the Site.</li>
        <li>Attempt unauthorized access to our servers or systems.</li>
        <li>
          Use automated tools to scrape or copy substantial portions of our
          original content without permission.
        </li>
        <li>Upload malware, spam, or malicious software.</li>
        <li>
          Misrepresent your identity or impersonate another person or
          organization.
        </li>
      </ul>

      <h2>3. Intellectual Property</h2>
      <p>
        Unless otherwise stated, the articles, original text, website design,
        graphics, logos, branding, and other content created by Scoop Room
        are owned by or licensed to Scoop Room and are protected by
        applicable copyright, trademark, and other intellectual property
        laws.
      </p>
      <p>
        Some news content, images, videos, headlines, social media posts, or
        other media displayed on the Site may originate from third-party
        publishers, public sources, official organizations, or content
        partners. Such materials remain the property of their respective
        owners and are used, where applicable, under license, permission,
        attribution, embedding, fair dealing/fair use principles, or other
        applicable legal exceptions. Scoop Room does not claim ownership of
        third-party content.
      </p>
      <p>
        If you believe any content on this Site infringes your intellectual
        property rights, please contact us at{" "}
        <a href="mailto:scooproomhq@gmail.com">scooproomhq@gmail.com</a>. We
        will promptly review the request and, where appropriate, remove or
        modify the content.
      </p>
      <p>
        You may share links to Scoop Room articles and quote brief excerpts
        with proper attribution and a link back to the original article.
        Republishing, reproducing, or distributing substantial portions of
        our original content without prior written permission is prohibited.
      </p>

      <h2>4. User Content</h2>
      <p>
        If you submit comments, news tips, photos, videos, or other content
        to Scoop Room, you retain ownership of your content.
      </p>
      <p>
        By submitting content, you grant Scoop Room a non-exclusive,
        worldwide, royalty-free license to use, display, reproduce, publish,
        edit, distribute, and moderate that content in connection with
        operating and promoting the Site.
      </p>
      <p>
        You confirm that you have the necessary rights to submit any content
        you provide.
      </p>

      <h2>5. News Tips and Submissions</h2>
      <p>
        By submitting news tips or media to Scoop Room, you acknowledge that:
      </p>
      <ul>
        <li>
          The information you provide should be accurate to the best of your
          knowledge.
        </li>
        <li>
          Scoop Room may verify, edit, or decline to publish submitted
          material.
        </li>
        <li>Submission does not guarantee publication.</li>
        <li>
          Scoop Room may contact you for additional information if necessary.
        </li>
      </ul>

      <h2>6. Third-Party Links</h2>
      <p>
        Our Site may contain links to third-party websites, services, or
        social media platforms. Scoop Room does not control or endorse these
        websites and is not responsible for their content, privacy
        practices, or availability.
      </p>

      <h2>7. News Disclaimer</h2>
      <p>
        Scoop Room publishes breaking news, trending stories, lifestyle
        content, entertainment, business, technology, politics, sports, and
        other public-interest information.
      </p>
      <p>
        While we strive to verify information before publication, news
        develops rapidly and facts may change. We do not guarantee that every
        article is complete, accurate, current, or error-free at all times.
      </p>
      <p>
        Readers should verify important information through official sources
        where appropriate.
      </p>

      <h2>8. Prohibited Conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>
          Publish or submit unlawful, defamatory, abusive, threatening, or
          hateful content.
        </li>
        <li>Spread intentionally false or misleading information.</li>
        <li>Infringe the intellectual property rights of others.</li>
        <li>Interfere with the operation or security of the Site.</li>
        <li>Use the Site for illegal or fraudulent activities.</li>
      </ul>

      <h2>9. Disclaimer of Warranties</h2>
      <p>
        The Site and its content are provided &quot;as is&quot; and &quot;as
        available.&quot; Scoop Room makes no warranties, express or implied,
        regarding the availability, reliability, accuracy, or completeness of
        the Site or its content.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, Scoop Room, its owners,
        employees, contributors, and partners shall not be liable for any
        direct, indirect, incidental, special, or consequential damages
        arising from your use of, or inability to use, the Site or its
        content.
      </p>

      <h2>11. Changes to These Terms</h2>
      <p>
        We may update these Terms of Use from time to time. Any changes will
        become effective immediately upon publication on this page. Your
        continued use of the Site constitutes acceptance of the updated
        Terms.
      </p>

      <h2>12. Governing Law</h2>
      <p>
        These Terms shall be governed by and interpreted in accordance with
        the applicable laws governing the operation of Scoop Room, without
        affecting any legal rights available to users under applicable
        consumer protection laws.
      </p>

      <h2>13. Contact Us</h2>
      <p>
        If you have any questions regarding these Terms of Use, copyright
        concerns, or legal matters, please contact us:
      </p>
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