import webpush from 'web-push';
import type { PushSubscription } from 'web-push';

// This is a reusable function to send any notification.
// It is now the ONLY place where web-push is configured.
export async function sendPushNotification(subscription: PushSubscription, title: string, body: string) {
  
  // --- THE FIX ---
  // We configure the VAPID details INSIDE the function.
  // This ensures it only runs at runtime, not during the build process,
  // which solves the Vercel deployment error.
  webpush.setVapidDetails(
    'mailto:ashishkadian239@gmail.com', // Replace with your email
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const payload = JSON.stringify({ title, body });
  
  try {
    console.log("Attempting to send notification...");
    await webpush.sendNotification(subscription, payload);
    console.log("Notification sent successfully.");
  } catch (error) {
    console.error("Failed to send push notification:", error);
    // Re-throw the error so the calling function can handle it
    throw error;
  }
}