import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/site/StaticPageLayout";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Advertise",
  description: `Advertise with ${site.name}.`,
};

const formats = [
  {
    title: "Display advertising",
    body: "Standard IAB placements across the homepage, category pages, and article pages.",
  },
  {
    title: "Sponsored content",
    body: "Clearly labeled sponsored posts, written to our editorial quality bar and placed alongside regular coverage.",
  },
  {
    title: "Newsletter",
    body: "Reach readers directly with a placement in our newsletter as it grows.",
  },
];

export default function AdvertisePage() {
  return (
    <StaticPageLayout
      title="Advertise with us"
      subtitle={`Reach readers who follow Nigeria, Africa, and world news closely.`}
    >
      <p>
        {site.name} reaches readers who care about what&apos;s happening in Nigeria,
        across Africa, and around the world — across politics, business,
        technology, entertainment, sports, and lifestyle.
      </p>

      <div className="not-prose grid gap-4 sm:grid-cols-3">
        {formats.map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-surface p-5">
            <p className="font-display text-sm font-semibold">{f.title}</p>
            <p className="mt-2 text-sm text-foreground/70">{f.body}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10">Get a media kit</h2>
      <p>
        For rates, audience data, and available placements, email{" "}
        <a href="mailto:ads@scooproom.com">ads@scooproom.com</a> and we&apos;ll send
        over our current media kit.
      </p>

      <h2>Our standards</h2>
      <p>
        All advertising is clearly distinguished from editorial content.
        Advertisers have no influence over our reporting or editorial decisions —
        see our <a href="/ethics">Newsroom Ethics</a> page.
      </p>
    </StaticPageLayout>
  );
}
