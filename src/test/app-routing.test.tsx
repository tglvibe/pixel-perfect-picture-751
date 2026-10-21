import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
const makeRouter = () => createRouter({ routeTree, context: { queryClient: new QueryClient() } });

describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    expect(makeRouter().matchRoutes("/").at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("has company intelligence and skills pages", () => {
    const router = makeRouter();
    expect(router.matchRoutes("/company/intelligence").at(-1)?.routeId).toBe("/company/intelligence");
    expect(router.matchRoutes("/company/skills").at(-1)?.routeId).toBe("/company/skills");
  });

  it("has no login or dashboard pages", () => {
    const router = makeRouter();
    for (const path of ["/login", "/dashboard"]) {
      expect(router.matchRoutes(path).at(-1)?.routeId).toBe(rootRouteId);
    }
  });
});
