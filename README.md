# Kindle Companion: Your Personal AI Reading Agent

**Kindle Companion is a lean, intelligent web application designed to help you build and sustain a life-changing reading habit through proactive, motivational push notifications.**

This project is for anyone who wants to read more but finds it hard to stay consistent. It acts as a friendly AI companion that sends you inspiring quotes and reminders to help you pick up a book, turning your reading goal into a durable habit.

![Kindle Companion Screenshot](https://i.imgur.com/your-screenshot-url.png)

---

### The Mission: Why This Project Exists

In a world full of distractions, finding time to read is a challenge. Kindle Companion isn't another library app; it's a **behavioral AI** focused on one thing: helping you overcome inertia. By providing timely, intelligent, and inspiring nudges, it makes reading a rewarding and effortless part of your daily routine. This project is a testament to the idea that a simple habit, consistently practiced, can change your life.

### Tech Stack & Architecture

We chose a modern, lean, and highly scalable stack perfect for a quick launch and effortless maintenance.

* **Framework:** **Next.js** (React) with TypeScript and Tailwind CSS.
* **Hosting:** **Vercel**. The entire application is a single Next.js project, designed for seamless deployment on Vercel.
* **Backend Logic:** **Next.js API Routes**. The "brain" of our agent lives within the same app, simplifying development.
* **Notifications:** **Web Push API**. Using standard web push notifications to send messages directly to your phone or desktop browser.
* **Scheduling:** **Vercel Cron Jobs**. To send notifications at specific times, we use Vercel's built-in, serverless scheduler.
* **Storage:** A simple file-based store (`/tmp` directory) that is compatible with Vercel's serverless environment.

This architecture was chosen to be incredibly cost-effective (free on Vercel's hobby plan) and to get from idea to a live, working product as fast as possible.

### How It Works

1.  **Enable Notifications:** Visit the web app on your device (phone or desktop) and click one button to grant notification permissions.
2.  **Receive Your Nudge:** The AI companion will send you a random, hand-crafted motivational quote at scheduled times throughout the day (e.g., 1 PM, 4 PM, 10 PM).
3.  **Build the Habit:** These small, consistent reminders help you build the mental momentum to pick up a book and make reading a natural part of your life.

### Getting Started: Local Development

You can run your own Kindle Companion locally in just a few steps.

**1. Prerequisites:**
* Node.js (v18+)
* pnpm (or npm/yarn)
* Git

**2. Clone & Install:**
```bash
git clone [https://github.com/your-username/kindle-companion.git](https://github.com/your-username/kindle-companion.git)
cd kindle-companion
pnpm install
3. Generate VAPID Keys:These keys are required to authenticate your server for push notifications. You only need to do this once.npx web-push generate-vapid-keys
4. Create Environment File:Create a .env.local file in the root of the project and add your keys:NEXT_PUBLIC_VAPID_PUBLIC_KEY="Your-Public-Key-Here"
VAPID_PRIVATE_KEY="Your-Private-Key-Here"
5. Run the App:pnpm dev
Open http://localhost:3000 in your browser and enable notifications! To test a notification immediately, you can visit http://localhost:3000/api/cron/send-notification.Deploy to VercelPush your project to a GitHub repository.Import the repository into Vercel.In your Vercel project settings, add your NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY as environment variables.Create a vercel.json file in your project root to schedule the daily notifications:{
  "crons": [
    {
      "path": "/api/cron/send-notification",
      "schedule": "0 13 * * *"
    },
    {
      "path": "/api/cron/send-notification",
      "schedule": "0 16 * * *"
    },
    {
      "path": "/api/cron/send-notification",
      "schedule": "0 22 * * *"
    }
  ]
}
Deploy! Your AI companion is now live.This project was built to prove that a small