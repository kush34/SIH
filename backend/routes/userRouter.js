import express from "express";
import { clerkClient, requireAuth, getAuth } from '@clerk/express'

const router = express.Router();

export default router;