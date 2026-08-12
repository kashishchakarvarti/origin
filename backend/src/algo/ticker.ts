import { config } from "../config.js";
import { db } from "../data/store.js";

let timer: NodeJS.Timeout | null = null;
let running = false;

export function startOrderAlgoTicker(): void {
  if (timer) return;
  console.log(`[crest] Order algo ticker every ${config.orderAlgoIntervalMs}ms`);
  timer = setInterval(() => {
    void (async () => {
      if (running) return;
      running = true;
      try {
        const { created, revenue } = await db.tickOrderAlgo();
        if (created > 0) {
          console.log(`[crest] algo tick → ${created} orders, ₹${revenue.toLocaleString("en-IN")}`);
        }
      } catch (err) {
        console.error("[crest] algo tick failed", err);
      } finally {
        running = false;
      }
    })();
  }, config.orderAlgoIntervalMs);
  timer.unref?.();
}

export function stopOrderAlgoTicker(): void {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
