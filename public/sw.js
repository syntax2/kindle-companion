self.addEventListener('push', function (event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png', // Make sure you have an icon here
    badge: '/icon-72x72.png',
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});
