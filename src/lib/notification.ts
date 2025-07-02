import webpush from 'web-push';

// This is a reusable function to send any notification.
export async function sendPushNotification(subscription: webpush.PushSubscription, title: string, body: string) {
  
  // Configure web-push (only needs to be done once)
  if (!process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
      'mailto:your-email@example.com',
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    );
  }

  const payload = JSON.stringify({ title, body });
  try {
    await webpush.sendNotification(subscription, payload);
  } catch (error) {
    console.error("Failed to send push notification:", error);
    // Re-throw the error so the calling function can handle it (e.g., delete an invalid subscription)
    throw error;
  }
}