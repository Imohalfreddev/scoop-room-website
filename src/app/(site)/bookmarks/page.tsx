import type { Metadata } from "next";
import { BookmarksClient } from "@/components/news/BookmarksClient";

export const metadata: Metadata = {
  title: "Bookmarks",
  robots: { index: false, follow: false },
};

export default function BookmarksPage() {
  return <BookmarksClient />;
}
