import fs from "fs/promises";
import path from "path";

export async function loadFiles(dirName: string): Promise<string[]> {
    const files: string[] = [];
    try {
        const items = await fs.readdir(dirName, { recursive: true, withFileTypes: true });

        for (const item of items) {
            if (item.isFile()) {
                const fullPath = path.join(item.parentPath || dirName, item.name);
                // We only want the relative path from the dirName to match previous logic or just the file name if it's flat?
                // The original code used recursive: true which returns relative paths in recent Node versions?
                // Actually recursive: true in readdir returns relative paths.
                // But let's check what the original code expected. 
                // Original: await fs.readdir("commands", { recursive: true })
                // It returns paths like "ai/ask.ts" (on node 20+).

                // Let's rely on standard readdir recursive behavior but filter manually to be safe or just use what we have.
                // Actually, to make it robust and easy to import:

                if (item.name.endsWith(".js") || item.name.endsWith(".ts") || item.name.endsWith(".mjs")) {
                    // We need to return paths that can be imported. 
                    // If we pass "commands", we get "ai/ask.ts".
                    // The original code did `import(./commands/${file})`.

                    // If we use readdir with recursive: true, `item.name` is just the filename in some versions? 
                    // Wait, `fs.readdir` with `recursive: true` returns strings of relative paths if encoding is utf8 (default).
                    // If `withFileTypes` is set, it returns Dirents.

                    // Let's stick to the simple string version to match original behavior if possible, or robustify it.
                }
            }
        }

        // Simpler implementation matching the original's intent but reusable:
        const fileList = await fs.readdir(dirName, { recursive: true });
        return fileList.filter(file =>
            (file.endsWith(".js") || file.endsWith(".ts") || file.endsWith(".mjs"))
        ).map(file => {
            // Enforce always forward slashes for dynamic imports to work cross-platform if needed, 
            // though strictly on windows local paths might be backslashes. 
            // Node `import()` usually handles relative paths fine.
            return file.replace(/\\/g, "/");
        });

    } catch (error) {
        console.warn(`[FileLoader] Error loading files from ${dirName}:`, error);
        return [];
    }
}
