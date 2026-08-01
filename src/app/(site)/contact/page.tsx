import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/site/StaticPageLayout";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${site.name} team.`,
};

const contacts = [
  {
    label: "News tips",
    email: "tips@scooproom.com",
    note: "Have a story we should know about? This is the fastest way to reach the newsroom.",
  },
  {
    label: "Editorial & corrections",
    email: "editorial@scooproom.com",
    note: "Spotted an error, or have feedback on a story?",
  },
  {
    label: "Advertising",
    email: "ads@scooproom.com",
    note: "Interested in advertising with us? See also our Advertise page.",
  },
  {
    label: "General inquiries",
    email: "hello@scooproom.com",
    note: "Anything else — this one reaches the whole team.",
  },
];

export default function ContactPage() {
  return (
    <StaticPageLayout title="Contact" subtitle="We read everything that comes in.">
      <div className="not-prose grid gap-4 sm:grid-cols-2">
        {contacts.map((c) => (
          <div key={c.email} className="rounded-2xl border border-border bg-surface p-5">
            <p className="font-display text-sm font-semibold">{c.label}</p>
            <a
              href={`mailto:${c.email}`}
              className="mt-1 block text-sm font-medium text-signal hover:text-signal-bright"
            >
              {c.email}
            </a>
            <p className="mt-2 text-sm text-foreground/70">{c.note}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10">Follow us</h2>
      <p>
        You can also find us on X at{" "}
        <a
          href={`https://x.com/${site.twitter.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {site.twitter}
        </a>
        .
      </p>
    </StaticPageLayout>
  );
}
