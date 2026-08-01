import { apiFetch } from "./config";

export async function subscribeToNewsletter(
  email: string,
  source?: string
): Promise<{ success: boolean; email?: string; error?: string }> {
  try {
    return await apiFetch("/api/newsletter", {
      method: "POST",
      body: JSON.stringify({ email, source }),
      next: { revalidate: 0 },
    });
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
