import "dotenv/config"
import express from "express"
import { clerkMiddleware } from '@clerk/express'
import connectDB from "./config/database.js";
import { Webhook } from "svix";
import User from "./models/User.js";
import { users } from '@clerk/clerk-sdk-node';
import trafficdata from "./models/trafficdata.js";


const app = express();
connectDB();
const PORT = process.env.PORT || 3000;

app.use(clerkMiddleware())
app.use(express.json());

app.get("/health", (req, res) => {
  res.send("Working fine...")
})

app.post('/traffic-data',async (req, res) => {
  try {
    const { camera_id, vehicle_count, timestamp, avg_count } = req.body;
    console.log(camera_id, vehicle_count, timestamp, avg_count);
    if(!camera_id || !vehicle_count || !timestamp || !avg_count) return res.send("incomplete data. Required Data:camera_id, vehicle_count, timestamp, avg_count ")
    const data = new trafficdata({
      camera_id,
      vehicle_count,
      timestamp: new Date(timestamp * 1000), 
      avg_count
    });

    await data.save();
    res.status(201).json({ message: 'Traffic data saved', data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
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

        await users.updateUser(clerkUser.id, {
          publicMetadata: { role: 'user' }
        });
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