import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  ensureDefaultWorkspace,
  upsertWorkspaceLayer,
  createWorkspace,
} from "./workspaces";
import { fluxJson } from "./client";

vi.mock("./client", () => ({
  fluxJson: vi.fn(),
}));

const fluxJsonMock = vi.mocked(fluxJson);

describe("workspaces flux helpers", () => {
  beforeEach(() => {
    fluxJsonMock.mockReset();
  });

  it("ensureDefaultWorkspace returns existing row", async () => {
    fluxJsonMock.mockResolvedValueOnce([
      { id: "ws-1", owner_sub: "user-1", slug: "default", name: "My Logos Workspace" },
    ]);
    const ws = await ensureDefaultWorkspace("user-1");
    expect(ws.id).toBe("ws-1");
    expect(fluxJsonMock).toHaveBeenCalledTimes(1);
    expect(fluxJsonMock.mock.calls[0]?.[1]).toContain("owner_sub=eq.user-1");
  });

  it("ensureDefaultWorkspace creates when missing", async () => {
    fluxJsonMock.mockResolvedValueOnce([]);
    fluxJsonMock.mockResolvedValueOnce([
      { id: "ws-new", owner_sub: "user-1", slug: "default", name: "My Logos Workspace" },
    ]);
    const ws = await ensureDefaultWorkspace("user-1");
    expect(ws.id).toBe("ws-new");
    expect(fluxJsonMock).toHaveBeenCalledTimes(2);
    const postCall = fluxJsonMock.mock.calls[1];
    expect(postCall?.[1]).toBe("/workspaces");
    expect(JSON.parse(postCall?.[2]?.body as string)).toMatchObject({
      owner_sub: "user-1",
      slug: "default",
    });
  });

  it("upsertWorkspaceLayer PATCHes when layer exists", async () => {
    fluxJsonMock.mockResolvedValueOnce([
      {
        id: "layer-1",
        workspace_id: "ws-1",
        passage_id: "p-1",
        layer: "literal",
        content: "old",
        status: "draft",
      },
    ]);
    fluxJsonMock.mockResolvedValueOnce([
      {
        id: "layer-1",
        workspace_id: "ws-1",
        passage_id: "p-1",
        layer: "literal",
        content: "new text",
        status: "draft",
      },
    ]);
    const row = await upsertWorkspaceLayer("user-1", "ws-1", "p-1", "literal", "new text");
    expect(row.content).toBe("new text");
    expect(fluxJsonMock.mock.calls[1]?.[1]).toContain("/workspace_translation_layers");
    expect(fluxJsonMock.mock.calls[1]?.[2]?.method).toBe("PATCH");
  });

  it("createWorkspace never targets canonical translation_layers", async () => {
    fluxJsonMock.mockResolvedValueOnce([
      { id: "ws-1", owner_sub: "sub", slug: "default", name: "My Logos Workspace" },
    ]);
    await createWorkspace("sub", { slug: "default", name: "My Logos Workspace" });
    expect(fluxJsonMock.mock.calls[0]?.[1]).toBe("/workspaces");
    expect(fluxJsonMock.mock.calls[0]?.[1]).not.toContain("translation_layers");
  });
});
