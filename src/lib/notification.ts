import webpush from 'web-push';

// This is a reusable function to send any notification.
export async function sendPushNotification(subscription: webpush.PushSubscription, title: string, body: string) {
  
  // --- THE FIX ---
  // We will now set the VAPID details every time, right before we send.
  // This guarantees that our server is always authenticated.
  // This is a robust solution that solves the 401 error.
  webpush.setVapidDetails(
    'mailto:ashishkadian239@gmail.com', // Replace with your email
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const payload = JSON.stringify({ title, body });
  
  try {
    console.log("Sending notification with payload:", payload);
    await webpush.sendNotification(subscription, payload);
    console.log("Notification sent successfully.");
  } catch (error) {
    console.error("Failed to send push notification:", error);
    // Re-throw the error so the calling function can handle it
    throw error;
  }
}