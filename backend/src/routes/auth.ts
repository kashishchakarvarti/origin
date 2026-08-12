import { Router } from "express";
import { z } from "zod";
import { db } from "../data/store.js";
import { requireAuth, signToken } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post("/login", async (req, res, next) => {
  try {
    const body = z
      .object({ email: z.string().email(), password: z.string().min(1) })
      .safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid email or password payload" });
      return;
    }
    const user = await db.findUserByEmail(body.data.email);
    if (!user || user.password !== body.data.password) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }
    const token = signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      isOnboarded: user.isOnboarded,
    });
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isOnboarded: user.isOnboarded,
      },
    });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/signup", async (req, res, next) => {
  try {
    const body = z
      .object({
        email: z.string().email(),
        name: z.string().min(1),
        password: z.string().min(1).default("user"),
      })
      .safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid signup payload" });
      return;
    }
    const result = await db.signup(body.data.email, body.data.name, body.data.password);
    if ("error" in result) {
      res.status(409).json({ error: result.error });
      return;
    }
    const user = result.user!;
    const token = signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      isOnboarded: user.isOnboarded,
    });
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isOnboarded: user.isOnboarded,
      },
    });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/verify-otp", requireAuth, (_req, res) => {
  res.json({ ok: true, verified: true });
});

authRouter.post("/complete-onboarding", requireAuth, async (req, res, next) => {
  try {
    const body = z.object({ name: z.string().min(1) }).safeParse(req.body);
    if (!body.success || !req.user) {
      res.status(400).json({ error: "Invalid payload" });
      return;
    }
    const user = await db.completeOnboarding(req.user.email, body.data.name);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const token = signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      isOnboarded: user.isOnboarded,
    });
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isOnboarded: user.isOnboarded,
      },
    });
  } catch (err) {
    next(err);
  }
});

authRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await db.findUserByEmail(req.user!.email);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      isOnboarded: user.isOnboarded,
    });
  } catch (err) {
    next(err);
  }
});
