import Link from "next/link";
import { Logo } from "./Logo";
import { footerLinks, site } from "@/lib/constants";
import { PushNotificationsButton } from "./PushNotificationsButton";
import { XIcon, FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/icons/SocialIcons";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted">{site.description}</p>
            <div className="mt-5 flex items-center gap-3 text-muted">
              <XIcon className="transition hover:text-signal" />
              <FacebookIcon className="transition hover:text-signal" />
              <InstagramIcon className="transition hover:text-signal" />
              <YoutubeIcon className="transition hover:text-signal" />
            </div>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p className="wire pl-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">
                {heading}
              </p>
              <ul className="mt-3 space-y-2">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={"href" in l ? l.href : `/category/${l.slug}`}
                      className="text-sm text-foreground/75 transition hover:text-signal"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Scoop Room. All rights reserved.</p>
          <PushNotificationsButton />
          <p className="font-mono tracking-wide">THE PEOPLE&apos;S STORIES. TOLD WITH INTEGRITY.</p>
        </div>
      </div>
    </footer>
  );
}
