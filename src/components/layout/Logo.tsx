import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false, priority = false }: { compact?: boolean; priority?: boolean }) {
  if (compact) {
    return (
      <Link href="/" aria-label="Scoop Room home" className="flex items-center">
        <Image
          src="/brand/scoop-room-mark.png"
          alt="Scoop Room"
          width={377}
          height={288}
          priority={priority}
          className="h-9 w-auto"
        />
      </Link>
    );
  }

  return (
    <Link href="/" aria-label="Scoop Room home" className="flex items-center">
      <Image
        src="/brand/scoop-room-logo-light.png"
        alt="Scoop Room — The People's Stories. Told With Integrity."
        width={1600}
        height={317}
        priority={priority}
        className="h-8 w-auto dark:hidden"
      />
      <Image
        src="/brand/scoop-room-logo-dark.png"
        alt="Scoop Room — The People's Stories. Told With Integrity."
        width={1600}
        height={317}
        priority={priority}
        className="hidden h-8 w-auto dark:block"
      />
    </Link>
  );
}
