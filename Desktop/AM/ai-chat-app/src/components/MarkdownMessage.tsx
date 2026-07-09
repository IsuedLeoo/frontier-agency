"use client";

import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import rust from "react-syntax-highlighter/dist/esm/languages/prism/rust";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import html from "react-syntax-highlighter/dist/esm/languages/prism/markup";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";
import go from "react-syntax-highlighter/dist/esm/languages/prism/go";
import cpp from "react-syntax-highlighter/dist/esm/languages/prism/cpp";
import csharp from "react-syntax-highlighter/dist/esm/languages/prism/csharp";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import php from "react-syntax-highlighter/dist/esm/languages/prism/php";
import ruby from "react-syntax-highlighter/dist/esm/languages/prism/ruby";
import swift from "react-syntax-highlighter/dist/esm/languages/prism/swift";
import kotlin from "react-syntax-highlighter/dist/esm/languages/prism/kotlin";
import lua from "react-syntax-highlighter/dist/esm/languages/prism/lua";
import docker from "react-syntax-highlighter/dist/esm/languages/prism/docker";
import graphql from "react-syntax-highlighter/dist/esm/languages/prism/graphql";
import regex from "react-syntax-highlighter/dist/esm/languages/prism/regex";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import vim from "react-syntax-highlighter/dist/esm/languages/prism/vim";
import make from "react-syntax-highlighter/dist/esm/languages/prism/makefile";

SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("rust", rust);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("html", html);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("go", go);
SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("csharp", csharp);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("php", php);
SyntaxHighlighter.registerLanguage("ruby", ruby);
SyntaxHighlighter.registerLanguage("swift", swift);
SyntaxHighlighter.registerLanguage("kotlin", kotlin);
SyntaxHighlighter.registerLanguage("lua", lua);
SyntaxHighlighter.registerLanguage("docker", docker);
SyntaxHighlighter.registerLanguage("graphql", graphql);
SyntaxHighlighter.registerLanguage("regex", regex);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("vim", vim);
SyntaxHighlighter.registerLanguage("makefile", make);
SyntaxHighlighter.registerLanguage("jsx", tsx);
SyntaxHighlighter.registerLanguage("js", javascript);
SyntaxHighlighter.registerLanguage("ts", typescript);
SyntaxHighlighter.registerLanguage("py", python);
SyntaxHighlighter.registerLanguage("sh", bash);
SyntaxHighlighter.registerLanguage("shell", bash);
SyntaxHighlighter.registerLanguage("zsh", bash);

const TERM_FG = "#00ff41";
const TERM_DIM = "#008f11";
const TERM_DARK = "#003b00";
const TERM_BORDER = "#005500";
const TERM_BG = "#0a0a0a";
const TERM_SURFACE = "#0f0f0f";
const TERM_ERROR = "#ff3333";
const TERM_WARN = "#ffff00";

const VIOLET = TERM_FG;
const BG = TERM_BG;
const SURFACE = TERM_SURFACE;
const BORDER = TERM_BORDER;
const TEXT_PRIMARY = TERM_FG;
const TEXT_SECONDARY = TERM_DIM;
const TEXT_TERTIARY = TERM_DARK;
const DANGER = TERM_ERROR;
const WARNING = TERM_WARN;

const customStyle: any = {
  'code[class*="language-"]': {
    color: "#c5f0c5",
    background: "transparent",
    fontFamily:
      '"SF Mono", "Fira Code", "JetBrains Mono", "Cascadia Code", Menlo, Monaco, Consolas, monospace',
    fontSize: "13px",
    lineHeight: "1.6",
    textShadow: "none",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    overflowWrap: "normal",
    tabSize: 2,
    hyphens: "none",
    padding: 0,
    margin: 0,
  },
  'pre[class*="language-"]': {
    color: "#c5f0c5",
    background: "transparent",
    fontFamily:
      '"SF Mono", "Fira Code", "JetBrains Mono", "Cascadia Code", Menlo, Monaco, Consolas, monospace',
    fontSize: "13px",
    lineHeight: "1.6",
    textShadow: "none",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    overflowWrap: "normal",
    tabSize: 2,
    hyphens: "none",
    padding: 0,
    margin: 0,
    overflow: "auto",
    borderRadius: 0,
  },
  comment: { color: "#3a5a3a", fontStyle: "italic" },
  prolog: { color: "#3a5a3a" },
  doctype: { color: "#3a5a3a" },
  cdata: { color: "#3a5a3a" },
  punctuation: { color: "#5a7a5a" },
  namespace: { opacity: 0.7 },
  property: { color: "#7adf7a" },
  tag: { color: "#4ade80" },
  boolean: { color: "#ff9f43" },
  number: { color: "#feca57" },
  constant: { color: "#ff9f43" },
  symbol: { color: "#ff9f43" },
  deleted: { color: DANGER },
  selector: { color: "#4ade80" },
  "attr-name": { color: "#a8e6a8" },
  string: { color: "#a8e6a8" },
  char: { color: "#a8e6a8" },
  builtin: { color: "#ff9f43" },
  inserted: { color: VIOLET },
  operator: { color: "#5a7a5a" },
  entity: { color: "#5a7a5a", cursor: "help" },
  url: { color: "#5a7a5a" },
  "attr-value": { color: "#a8e6a8" },
  keyword: { color: "#4ade80", fontWeight: "500" },
  function: { color: "#7adf7a" },
  "class-name": { color: "#7adf7a" },
  variable: { color: "#ff9f43" },
  regex: { color: "#feca57" },
  important: { color: "#ff9f43", fontWeight: "bold" },
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
};

function langFromFence(meta?: string): string {
  if (!meta) return "text";
  const first = meta.split(/\s/)[0].toLowerCase();
  const aliases: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    jsx: "tsx",
    tsx: "tsx",
    py: "python",
    sh: "bash",
    shell: "bash",
    zsh: "bash",
    yml: "yaml",
    md: "markdown",
    vimscript: "vim",
    make: "makefile",
  };
  return aliases[first] || first || "text";
}

interface MarkdownMessageProps {
  content: string;
}

export default function MarkdownMessage({ content }: MarkdownMessageProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = useCallback((code: string, key: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    });
  }, []);

  let codeBlockIndex = 0;

  return (
    <div className="space-y-4">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1
              className="text-lg font-bold mt-6 mb-2 font-mono tracking-tight"
              style={{ color: TEXT_PRIMARY, borderBottom: `1px solid ${BORDER}`, paddingBottom: "0.25rem" }}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              className="text-base font-bold mt-5 mb-2 font-mono tracking-tight"
              style={{ color: TEXT_PRIMARY }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              className="text-sm font-bold mt-4 mb-1 font-mono uppercase tracking-wider"
              style={{ color: VIOLET }}
            >
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4
              className="text-sm font-semibold mt-3 mb-1 font-mono"
              style={{ color: TEXT_SECONDARY }}
            >
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-[15px] leading-relaxed" style={{ color: TEXT_PRIMARY }}>
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong style={{ color: "#c5f0c5", fontWeight: 600 }}>
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em style={{ color: "#7adf7a" }}>{children}</em>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className="border-l-2 pl-3 py-1 my-2"
              style={{
                borderColor: VIOLET,
                backgroundColor: "rgba(0,210,106,0.03)",
                color: TEXT_SECONDARY,
              }}
            >
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-none space-y-1 pl-0 my-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-none space-y-1 pl-0 my-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-2 text-[15px]" style={{ color: TEXT_PRIMARY }}>
              <span className="mt-[0.35rem] w-1 h-1 flex-shrink-0" style={{ backgroundColor: VIOLET }} />
              <span className="flex-1">{children}</span>
            </li>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-80"
              style={{ color: VIOLET }}
            >
              {children}
            </a>
          ),
          hr: () => (
            <hr className="my-4" style={{ borderColor: BORDER }} />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 border" style={{ borderColor: BORDER }}>
              <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead style={{ backgroundColor: SURFACE }}>
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th
              className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider font-mono"
              style={{ color: VIOLET, borderBottom: `1px solid ${BORDER}` }}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              className="px-3 py-2 text-[13px]"
              style={{ color: TEXT_PRIMARY, borderBottom: `1px solid ${BORDER}` }}
            >
              {children}
            </td>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-white/[0.02] transition-colors">
              {children}
            </tr>
          ),
          code: ({ children, className }) => {
            const isBlock = typeof children === "string" && children.includes("\n");
            if (isBlock || className) {
              const lang = langFromFence(className?.replace("language-", ""));
              const code = String(children).replace(/\n$/, "");
              const idx = `cb-${codeBlockIndex++}`;
              return (
                <div
                  className="border overflow-hidden my-3"
                  style={{
                    backgroundColor: BG,
                    borderColor: BORDER,
                  }}
                >
                  {/* Header */}
                  <div
                    className="flex items-center justify-between px-3 py-1.5 border-b"
                    style={{
                      borderColor: BORDER,
                      backgroundColor: SURFACE,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: TEXT_TERTIARY }}>
                        {lang === "text" ? "CODE" : lang}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(code, idx)}
                      className="text-[10px] px-2 py-0.5 border font-mono transition-colors hover:bg-white/5"
                      style={{ color: TEXT_TERTIARY, borderColor: BORDER }}
                    >
                      {copiedKey === idx ? "[copied]" : "[copy]"}
                    </button>
                  </div>
                  {/* Code body */}
                  <div className="px-3 py-2 overflow-x-auto">
                    <SyntaxHighlighter
                      language={lang}
                      style={customStyle}
                      PreTag="div"
                      showLineNumbers={false}
                      wrapLongLines={false}
                    >
                      {code}
                    </SyntaxHighlighter>
                  </div>
                </div>
              );
            }
            return (
              <code
                className="px-1 py-0.5 text-[13px] font-mono"
                style={{
                  backgroundColor: "rgba(0,210,106,0.08)",
                  color: "#7adf7a",
                  border: `1px solid ${BORDER}`,
                }}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => {
            return <>{children}</>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
