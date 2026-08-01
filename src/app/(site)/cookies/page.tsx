import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/site/StaticPageLayout";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `How ${site.name} uses cookies.`,
};

const cookieTypes = [
  {
    name: "Essential",
    example: "Theme preference, session/login state for the admin dashboard",
    always: true,
  },
  {
    name: "Analytics",
    example: "Understanding aggregate traffic and readership patterns, where enabled",
    always: false,
  },
  {
    name: "Advertising",
    example: "Serving and measuring ads via providers like Google AdSense, where enabled",
    always: false,
  },
  {
    name: "Preferences",
    example: "Remembering settings like saved bookmarks",
    always: false,
  },
];

export default function CookiesPage() {
  return (
    <StaticPageLayout
      title="Cookie Policy"
      subtitle="What cookies are, which ones we use, and how to control them."
      updated="July 2026"
    >
      <h2>What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a
        website. They help the site remember information about your visit,
        like your preferences, and can be used to understand how the site is
        used.
      </p>

      <h2>Cookies we use</h2>
      <div className="not-prose overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Used for</th>
              <th className="px-4 py-3 font-semibold">Can be disabled?</th>
            </tr>
          </thead>
          <tbody>
            {cookieTypes.map((c) => (
              <tr key={c.name} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-foreground/70">{c.example}</td>
                <td className="px-4 py-3 text-foreground/70">
                  {c.always ? "No — required for the site to work" : "Yes, via your browser"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Third-party cookies</h2>
      <p>
        Where we use third-party services such as analytics or advertising
        providers, those providers may set their own cookies subject to their
        own privacy and cookie policies.
      </p>

      <h2>How to control cookies</h2>
      <p>
        Most browsers let you block or delete cookies through their settings.
        Blocking essential cookies may affect how parts of the Site work — for
        example, your theme preference may not be remembered, or the admin
        dashboard may not stay signed in.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this Cookie Policy as our use of cookies changes. Check
        the &quot;Last updated&quot; date above for the most recent revision.
      </p>

      <h2>Questions</h2>
      <p>
        Email <a href="mailto:privacy@scooproom.com">privacy@scooproom.com</a>{" "}
        with any questions about this policy.
      </p>
    </StaticPageLayout>
  );
}
