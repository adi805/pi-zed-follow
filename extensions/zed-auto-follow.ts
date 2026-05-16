import * as path from "node:path";
import { execSync } from "node:child_process";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

/**
 * Pi extension: Zed Auto-Follow
 *
 * Automatically opens files in Zed editor when Pi writes or edits them.
 * Mimics ACP's auto-follow behavior but works with Pi running in terminal.
 */
export default function zedAutoFollow(pi: ExtensionAPI) {
	const ZED_BIN = process.env.ZED_PATH || "C:\\Users\\acer\\AppData\\Local\\Programs\\Zed\\bin\\zed.exe";
	const recentlyOpened = new Set<string>();
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	const pendingOpens: string[] = [];

	function openInZed(filePath: string) {
		try {
			execSync(`"${ZED_BIN}" "${filePath}"`, { stdio: "ignore", timeout: 3000 });
		} catch {}
	}

	function queueOpen(filePath: string) {
		if (recentlyOpened.has(filePath)) return;
		recentlyOpened.add(filePath);
		pendingOpens.push(filePath);

		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			for (const p of pendingOpens) openInZed(p);
			pendingOpens.length = 0;
		}, 300);

		setTimeout(() => recentlyOpened.delete(filePath), 5000);
	}

	pi.on("tool_execution_end", async (event, ctx) => {
		if (event.toolName !== "write" && event.toolName !== "edit") return;
		if (event.isError) return;

		const args = (event as any).args || {};
		const filePath = typeof args.path === "string" ? args.path : null;
		if (!filePath) return;

		const abs = path.isAbsolute(filePath) ? filePath : path.join(ctx.cwd, filePath);
		queueOpen(abs);
	});

	pi.on("session_start", async (_event, ctx) => {
		if (ctx.hasUI) {
			ctx.ui.notify("Zed auto-follow active", "info");
		}
	});
}
