"use client";

import { useEffect, useState, type FormEvent } from "react";
import { MessageCircle } from "lucide-react";
import type { Comment } from "@/types";
import { getComments, postComment } from "@/lib/api/comments";
import { timeAgo } from "@/lib/utils";

export function CommentSection({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getComments(articleId).then(setComments).catch(() => {});
  }, [articleId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    setSubmitting(true);
    try {
      const comment = await postComment(articleId, name.trim(), body.trim());
      setComments((prev) => [comment, ...prev]);
      setBody("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-4">
      <div className="mb-5 flex items-center gap-2">
        <MessageCircle size={18} className="text-signal" />
        <h2 className="font-display text-xl font-semibold">
          Discussion {comments.length > 0 && `(${comments.length})`}
        </h2>
      </div>

      <form onSubmit={onSubmit} className="mb-8 space-y-3 rounded-2xl border border-border p-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-signal"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your thoughts…"
          rows={3}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-signal"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-signal px-5 py-2 text-sm font-semibold text-white transition hover:bg-signal-bright disabled:opacity-60"
        >
          {submitting ? "Posting…" : "Post comment"}
        </button>
      </form>

      <ul className="space-y-5">
        {comments.map((c) => (
          <li key={c.id} className="border-b border-border pb-5 last:border-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">{c.authorName}</p>
              <span className="font-mono text-[11px] text-muted">{timeAgo(c.createdAt)}</span>
            </div>
            <p className="mt-1.5 text-sm text-foreground/85">{c.body}</p>
          </li>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-muted">Be the first to share your thoughts.</p>
        )}
      </ul>
    </section>
  );
}
