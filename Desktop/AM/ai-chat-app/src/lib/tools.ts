import { invoke } from "@tauri-apps/api/core";

/* ------------------------------------------------------------------ */
/*  Tool definitions                                                    */
/* ------------------------------------------------------------------ */
export interface ToolDef {
  name: string;
  description: string;
  parameters: Record<string, { type: string; description: string }>;
}

export const TOOLS: ToolDef[] = [
  {
    name: "read_file",
    description: "Read the contents of a file at the given path.",
    parameters: {
      path: { type: "string", description: "Absolute or relative file path" },
    },
  },
  {
    name: "write_file",
    description: "Write text to a file. Creates directories if needed.",
    parameters: {
      path: { type: "string", description: "Absolute or relative file path" },
      contents: { type: "string", description: "Full file contents to write" },
    },
  },
  {
    name: "list_dir",
    description: "List files and directories inside a directory.",
    parameters: {
      path: { type: "string", description: "Directory path" },
    },
  },
  {
    name: "run_command",
    description: "Execute a shell command with arguments.",
    parameters: {
      cmd: { type: "string", description: "Command name (e.g. 'ls', 'cat', 'npm')" },
      args: { type: "array", description: "Array of string arguments" },
    },
  },
  {
    name: "search_files",
    description: "Search for files containing a string.",
    parameters: {
      query: { type: "string", description: "Text to search for" },
      dir: { type: "string", description: "Directory to search in" },
      ext: { type: "string", description: "Optional file extension filter (e.g. 'ts')" },
    },
  },
  {
    name: "get_cwd",
    description: "Get the current working directory.",
    parameters: {},
  },
];

/* ------------------------------------------------------------------ */
/*  Tool system prompt                                                  */
/* ------------------------------------------------------------------ */
export function getToolSystemPrompt(): string {
  const toolList = TOOLS.map((t) => {
    const params = Object.entries(t.parameters)
      .map(([k, v]) => `    ${k}: ${v.type} — ${v.description}`)
      .join("\n");
    return `- ${t.name}: ${t.description}${params ? "\n" + params : ""}`;
  }).join("\n\n");

  return `
You have access to local tools on the user's machine. Use them when asked to read, write, search, or run commands.
When you want to use tools, output one or more XML blocks like this (nothing else in between):

<tool_use>
<name>TOOL_NAME</name>
<args>{"path": "/some/path"}</args>
</tool_use>

Important rules:
- Each <tool_use> block must contain exactly <name> and <args> children.
- <args> is a JSON object with the parameters.
- Do NOT describe what you're doing in prose before or between tool blocks — only emit the XML.
- After seeing tool results, reply normally with the answer.
- If a task is large (refactoring, multi-file edits, long scripts), emit ONLY the first chunk of work, then signal you will continue. You will be automatically prompted to keep going until finished.

Available tools:
${toolList}
`.trim();
}

/* ------------------------------------------------------------------ */
/*  Tool execution                                                      */
/* ------------------------------------------------------------------ */
export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
}

export interface ToolResult {
  tool: string;
  args: Record<string, unknown>;
  output: string;
  error?: string;
}

export function parseToolCalls(text: string): ToolCall[] {
  const calls: ToolCall[] = [];
  const regex = /<tool_use>\s*<name>([\s\S]*?)<\/name>\s*<args>([\s\S]*?)<\/args>\s*<\/tool_use>/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    const name = m[1].trim();
    const argsRaw = m[2].trim();
    try {
      const args = JSON.parse(argsRaw);
      calls.push({ name, args });
    } catch {
      calls.push({ name, args: { _raw: argsRaw } });
    }
  }
  return calls;
}

export async function executeToolCall(call: ToolCall): Promise<ToolResult> {
  const { name, args } = call;
  try {
    switch (name) {
      case "read_file": {
        const path = String(args.path || "");
        const output = await invoke<string>("read_file", { path });
        return { tool: name, args, output };
      }
      case "write_file": {
        const path = String(args.path || "");
        const contents = String(args.contents || "");
        await invoke<void>("write_file", { path, contents });
        return { tool: name, args, output: `[ok] wrote ${path}` };
      }
      case "list_dir": {
        const path = String(args.path || "");
        const entries = await invoke<Array<{ name: string; is_dir: boolean; size: number }>>("list_dir", { path });
        const lines = entries.map((e) => {
          const kind = e.is_dir ? "dir" : "file";
          return `${kind.padEnd(6)} ${e.name}`;
        });
        return { tool: name, args, output: lines.join("\n") || "(empty directory)" };
      }
      case "run_command": {
        const cmd = String(args.cmd || "");
        const cmdArgs = Array.isArray(args.args) ? args.args.map(String) : [];
        const result = await invoke<{ stdout: string; stderr: string; code: number }>("run_command", {
          cmd,
          args: cmdArgs,
        });
        const out: string[] = [];
        if (result.stdout) out.push(result.stdout);
        if (result.stderr) out.push(`stderr: ${result.stderr}`);
        if (result.code !== 0) out.push(`exit code: ${result.code}`);
        return { tool: name, args, output: out.join("\n") || "(no output)" };
      }
      case "search_files": {
        const query = String(args.query || "");
        const dir = String(args.dir || "");
        const ext = args.ext ? String(args.ext) : undefined;
        const results = await invoke<string[]>("search_files", { query, dir, ext });
        return { tool: name, args, output: results.join("\n") || "(no matches)" };
      }
      case "get_cwd": {
        const cwd = await invoke<string>("get_cwd");
        return { tool: name, args, output: cwd };
      }
      default:
        return { tool: name, args, output: "", error: `Unknown tool: ${name}` };
    }
  } catch (err) {
    return { tool: name, args, output: "", error: String(err) };
  }
}

export async function executeToolCalls(calls: ToolCall[]): Promise<ToolResult[]> {
  const results: ToolResult[] = [];
  for (const call of calls) {
    results.push(await executeToolCall(call));
  }
  return results;
}

export function formatToolResults(results: ToolResult[]): string {
  return results
    .map((r) => {
      const status = r.error ? "ERROR" : "OK";
      const out = r.error || r.output;
      return `[${status}] ${r.tool} ${JSON.stringify(r.args)}\n${out}`;
    })
    .join("\n\n");
}
