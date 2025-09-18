import "dotenv/config"
import express from "express"
import { clerkMiddleware } from '@clerk/express'
import connectDB from "./config/database.js";
import { Webhook } from "svix";
import User from "./models/User.js";

const app = express();
connectDB();
const PORT = process.env.PORT || 3000;

app.use(clerkMiddleware())

app.get("/health", (req, res) => {
    res.send("Working fine...")
})

app.get('/protected', (req, res) => {
    // requireAuth throws 401 if not logged in
    if (!req.auth.userId) return res.status(401).json({ message: 'Unauthorized' });

    res.json({ message: `Hello user ${req.auth.userId}` });
});

app.post(
  "/webhooks/clerk",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
      const evt = wh.verify(req.body, req.headers);

      if (evt.type === "user.created") {
        const clerkUser = evt.data;
        await User.create({ clerkId: clerkUser.id });
      }

      res.json({ ok: true });
    } catch (err) {
      console.error("Webhook error", err);
      res.status(400).json({ error: "Invalid signature" });
    }
  }
);
app.listen(PORT, () => {
    console.log(`Server running on :${PORT}`)
})

export default app;