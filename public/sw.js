/**
 * Minimal service worker for Scoop Room push notifications.
 *
 * This handles incoming push events and notification clicks. It does NOT
 * include a push server — pair it with a real backend (web-push + VAPID
 * keys, or a service like OneSignal/Firebase Cloud Messaging) that stores
 * subscriptions (see prisma/schema.prisma `PushSubscription`) and calls
 * this worker's `push` handler by sending to each subscription's endpoint.
 */

self.addEventListener("push", (event) => {
  let data = { title: "Scoop Room", body: "Breaking news just dropped.", url: "/" };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {
    /* payload wasn't JSON — fall back to defaults */
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/brand/icon-192.png",
      badge: "/brand/icon-192.png",
      data: { url: data.url },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";
  event.waitUntil(clients.openWindow(url));
});
