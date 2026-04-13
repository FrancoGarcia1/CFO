'use client';

/**
 * Simple markdown renderer for CFO chat responses.
 * Handles: **bold**, *italic*, bullet lists (- or *), numbered lists, headers (#), and line breaks.
 * No external dependencies — just regex transforms to JSX.
 */
export function MarkdownText({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let listItems: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  function flushList() {
    if (listItems.length === 0) return;
    const Tag = listType === 'ol' ? 'ol' : 'ul';
    const className = listType === 'ol'
      ? 'list-decimal list-inside space-y-1 my-2'
      : 'list-disc list-inside space-y-1 my-2';
    elements.push(
      <Tag key={`list-${elements.length}`} className={className}>
        {listItems.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </Tag>
    );
    listItems = [];
    listType = null;
  }

  function renderInline(text: string): JSX.Element {
    // Process bold (**text**), italic (*text*), and inline code (`code`)
    const parts: (string | JSX.Element)[] = [];
    let remaining = text;
    let keyIdx = 0;

    while (remaining.length > 0) {
      // Bold: **text**
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      // Italic: *text* (not preceded by *)
      const italicMatch = remaining.match(/(?<!\*)\*([^*]+?)\*(?!\*)/);
      // Code: `text`
      const codeMatch = remaining.match(/`([^`]+?)`/);

      // Find the earliest match
      const matches = [
        boldMatch ? { type: 'bold', match: boldMatch } : null,
        italicMatch ? { type: 'italic', match: italicMatch } : null,
        codeMatch ? { type: 'code', match: codeMatch } : null,
      ].filter(Boolean).sort((a, b) => (a!.match.index ?? 0) - (b!.match.index ?? 0));

      if (matches.length === 0) {
        parts.push(remaining);
        break;
      }

      const first = matches[0]!;
      const idx = first.match.index ?? 0;

      if (idx > 0) {
        parts.push(remaining.substring(0, idx));
      }

      if (first.type === 'bold') {
        parts.push(<strong key={keyIdx++} className="font-bold text-foreground">{first.match[1]}</strong>);
      } else if (first.type === 'italic') {
        parts.push(<em key={keyIdx++} className="italic">{first.match[1]}</em>);
      } else if (first.type === 'code') {
        parts.push(<code key={keyIdx++} className="bg-input px-1.5 py-0.5 rounded text-primary text-xs font-mono">{first.match[1]}</code>);
      }

      remaining = remaining.substring(idx + first.match[0].length);
    }

    return <span key={`inline-${keyIdx}`}>{parts}</span>;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line
    if (trimmed === '') {
      flushList();
      elements.push(<div key={`br-${i}`} className="h-2" />);
      continue;
    }

    // Headers
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={`h3-${i}`} className="text-sm font-bold text-foreground mt-3 mb-1">{renderInline(trimmed.slice(4))}</h3>);
      continue;
    }
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={`h2-${i}`} className="text-base font-bold text-foreground mt-3 mb-1">{renderInline(trimmed.slice(3))}</h2>);
      continue;
    }
    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={`h1-${i}`} className="text-lg font-bold text-foreground mt-3 mb-1">{renderInline(trimmed.slice(2))}</h1>);
      continue;
    }

    // Unordered list: - item or * item
    const ulMatch = trimmed.match(/^[-*]\s+(.+)/);
    if (ulMatch) {
      if (listType === 'ol') flushList();
      listType = 'ul';
      listItems.push(ulMatch[1]);
      continue;
    }

    // Ordered list: 1. item
    const olMatch = trimmed.match(/^\d+\.\s+(.+)/);
    if (olMatch) {
      if (listType === 'ul') flushList();
      listType = 'ol';
      listItems.push(olMatch[1]);
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(<p key={`p-${i}`} className="text-sm leading-relaxed">{renderInline(trimmed)}</p>);
  }

  flushList();

  return <div className="space-y-0.5">{elements}</div>;
}
