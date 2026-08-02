// Repo path: src/app/(site)/advertise/page.tsx
import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/site/StaticPageLayout";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Advertise with us",
  description: `Advertising and sponsorship opportunities with ${site.name}.`,
};

export default function AdvertisePage() {
  return (
    <StaticPageLayout
      title="Advertise with us"
      subtitle="Reach readers who follow Nigeria, Africa, and world news closely."
    >
      <p>
        Scoop Room reaches readers who care about what&apos;s happening in
        Nigeria, across Africa, and around the world — across politics,
        business, technology, entertainment, sports, and lifestyle.
      </p>

      <h2>Display advertising</h2>
      <p>
        Standard IAB placements across the homepage, category pages, and
        article pages.
      </p>

      <h2>Sponsored content</h2>
      <p>
        Clearly labeled sponsored posts, written to our editorial quality bar
        and placed alongside regular coverage.
      </p>

      <h2>Newsletter</h2>
      <p>
        Reach readers directly with a placement in our newsletter as it
        grows.
      </p>

      <h2>Get a media kit</h2>
      <p>
        For rates, audience data, and available placements, email{" "}
        <a href="mailto:ads@scooproom.com">ads@scooproom.com</a> and
        we&apos;ll send over our current media kit.
      </p>

      <h2>Our standards</h2>
      <p>
        All advertising is clearly distinguished from editorial content.
        Advertisers have no influence over our reporting or editorial
        decisions — see our <a href="/ethics">Newsroom Ethics</a> page.
      </p>

      <hr />
      <p className="text-sm text-muted">
        Scoop Room — The People&apos;s Stories. Told With Integrity.
      </p>
    </StaticPageLayout>
  );
}