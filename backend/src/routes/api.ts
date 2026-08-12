import { Router } from "express";
import { z } from "zod";
import { db } from "../data/store.js";
import { requireAuth } from "../middleware/auth.js";
import { CATEGORIES, COUNTRIES } from "../types.js";

export const apiRouter = Router();
apiRouter.use(requireAuth);

apiRouter.get("/dashboard", async (_req, res, next) => {
  try {
    res.json(await db.getDashboard());
  } catch (err) {
    next(err);
  }
});

apiRouter.get("/bootstrap", async (_req, res, next) => {
  try {
    const data = await db.getAll();
    const { users: _users, ...rest } = data;
    res.json(rest);
  } catch (err) {
    next(err);
  }
});

apiRouter.post("/reset", async (_req, res, next) => {
  try {
    const data = await db.reset();
    const { users: _users, ...rest } = data;
    res.json({ ok: true, data: rest });
  } catch (err) {
    next(err);
  }
});

apiRouter.get("/opportunities", async (req, res, next) => {
  try {
    res.json(
      await db.getOpportunities({
        category: typeof req.query.category === "string" ? req.query.category : undefined,
        country: typeof req.query.country === "string" ? req.query.country : undefined,
        search: typeof req.query.search === "string" ? req.query.search : undefined,
        festival: "exclude",
      })
    );
  } catch (err) {
    next(err);
  }
});

apiRouter.get("/festivals", async (req, res, next) => {
  try {
    res.json(
      await db.getOpportunities({
        category: typeof req.query.category === "string" ? req.query.category : undefined,
        country: typeof req.query.country === "string" ? req.query.country : undefined,
        search: typeof req.query.search === "string" ? req.query.search : undefined,
        festival: "only",
      })
    );
  } catch (err) {
    next(err);
  }
});

apiRouter.get("/opportunities/:id", async (req, res, next) => {
  try {
    const opp = await db.getOpportunity(req.params.id);
    if (!opp) {
      res.status(404).json({ error: "Opportunity not found" });
      return;
    }
    res.json(opp);
  } catch (err) {
    next(err);
  }
});

apiRouter.get("/opportunities/:id/products", async (req, res, next) => {
  try {
    res.json(await db.getOpportunityProducts(req.params.id));
  } catch (err) {
    next(err);
  }
});

apiRouter.get("/products", async (req, res, next) => {
  try {
    res.json(
      await db.getProducts({
        category: typeof req.query.category === "string" ? req.query.category : undefined,
        search: typeof req.query.search === "string" ? req.query.search : undefined,
      })
    );
  } catch (err) {
    next(err);
  }
});

apiRouter.get("/businesses", async (_req, res, next) => {
  try {
    res.json(await db.getBusinesses());
  } catch (err) {
    next(err);
  }
});

apiRouter.get("/businesses/:id", async (req, res, next) => {
  try {
    const biz = await db.getBusiness(req.params.id);
    if (!biz) {
      res.status(404).json({ error: "Business not found" });
      return;
    }
    res.json(biz);
  } catch (err) {
    next(err);
  }
});

apiRouter.post("/businesses/launch", async (req, res, next) => {
  try {
    const body = z
      .object({
        opportunityId: z.string().min(1),
        selectedProductIds: z.array(z.string()).optional(),
      })
      .safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid launch payload" });
      return;
    }
    const business = await db.launchBusiness(body.data.opportunityId, body.data.selectedProductIds);
    if (!business) {
      res.status(400).json({ error: "Unable to launch business" });
      return;
    }
    res.status(201).json(business);
  } catch (err) {
    next(err);
  }
});

apiRouter.post("/businesses/custom", async (req, res, next) => {
  try {
    const body = z
      .object({
        name: z.string().min(1),
        category: z.enum(CATEGORIES),
        country: z.enum(COUNTRIES),
        selectedProductIds: z.array(z.string()).min(1),
        audienceTargeting: z.record(z.unknown()).optional(),
      })
      .safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid custom business payload" });
      return;
    }
    const business = await db.launchCustomBusiness({
      name: body.data.name,
      category: body.data.category,
      country: body.data.country,
      selectedProductIds: body.data.selectedProductIds,
      audienceTargeting: body.data.audienceTargeting,
    });
    if (!business) {
      res.status(400).json({ error: "Unable to create business" });
      return;
    }
    res.status(201).json(business);
  } catch (err) {
    next(err);
  }
});

apiRouter.get("/orders", async (req, res, next) => {
  try {
    const businessId = typeof req.query.businessId === "string" ? req.query.businessId : undefined;
    res.json(await db.getOrders(businessId));
  } catch (err) {
    next(err);
  }
});

apiRouter.get("/transactions", async (_req, res, next) => {
  try {
    res.json(await db.getTransactions());
  } catch (err) {
    next(err);
  }
});

apiRouter.post("/withdraw", async (req, res, next) => {
  try {
    const body = z.object({ amount: z.number().positive() }).safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid amount" });
      return;
    }
    const ok = await db.withdraw(body.data.amount);
    if (!ok) {
      res.status(400).json({ error: "Insufficient withdrawable balance" });
      return;
    }
    res.json({ ok: true, dashboard: await db.getDashboard() });
  } catch (err) {
    next(err);
  }
});

apiRouter.get("/notifications", async (_req, res, next) => {
  try {
    res.json(await db.getNotifications());
  } catch (err) {
    next(err);
  }
});

apiRouter.post("/notifications/:id/read", async (req, res, next) => {
  try {
    await db.markNotificationRead(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

apiRouter.post("/notifications/read-all", async (_req, res, next) => {
  try {
    await db.markAllNotificationsRead();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

apiRouter.get("/profile", async (_req, res, next) => {
  try {
    res.json((await db.getDashboard()).profile);
  } catch (err) {
    next(err);
  }
});

apiRouter.patch("/profile", async (req, res, next) => {
  try {
    const body = z
      .object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        avatar: z.string().optional(),
      })
      .safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid profile payload" });
      return;
    }
    res.json(await db.updateProfile(body.data));
  } catch (err) {
    next(err);
  }
});

apiRouter.patch("/profile/settings", async (req, res, next) => {
  try {
    const body = z
      .object({
        emailNotifications: z.boolean().optional(),
        pushNotifications: z.boolean().optional(),
        currency: z.string().optional(),
        language: z.string().optional(),
        theme: z.enum(["dark", "light"]).optional(),
      })
      .safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid settings payload" });
      return;
    }
    res.json(await db.updateSettings(body.data));
  } catch (err) {
    next(err);
  }
});

apiRouter.get("/reviews", async (req, res, next) => {
  try {
    const opportunityId =
      typeof req.query.opportunityId === "string" ? req.query.opportunityId : undefined;
    const productIds =
      typeof req.query.productIds === "string"
        ? req.query.productIds.split(",").filter(Boolean)
        : undefined;
    res.json(await db.getReviews({ opportunityId, productIds }));
  } catch (err) {
    next(err);
  }
});

apiRouter.get("/meta", (_req, res) => {
  res.json({ categories: CATEGORIES, countries: COUNTRIES });
});

apiRouter.post("/algo/tick", async (_req, res, next) => {
  try {
    const result = await db.tickOrderAlgo();
    res.json({
      created: result.created,
      revenue: result.revenue,
      dashboard: await db.getDashboard(),
    });
  } catch (err) {
    next(err);
  }
});

apiRouter.post("/algo/run", async (req, res, next) => {
  try {
    const body = z
      .object({
        days: z.number().int().positive().max(90).optional(),
        seed: z.number().optional(),
        maxOrdersPerBusinessPerDay: z.number().int().positive().max(40).optional(),
      })
      .safeParse(req.body ?? {});
    if (!body.success) {
      res.status(400).json({ error: "Invalid algo payload" });
      return;
    }
    const result = await db.runOrderAlgo(body.data);
    res.json({
      created: result.created,
      summary: result.result?.summary ?? null,
      dashboard: await db.getDashboard(),
    });
  } catch (err) {
    next(err);
  }
});
