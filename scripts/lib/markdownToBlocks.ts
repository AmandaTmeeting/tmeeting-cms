type TextNode = { type: 'text'; text: string; bold?: true };
type LinkNode = { type: 'link'; url: string; children: TextNode[] };
type InlineNode = TextNode | LinkNode;

type HeadingBlock = { type: 'heading'; level: 2 | 3; children: TextNode[] };
type ParagraphBlock = { type: 'paragraph'; children: InlineNode[] };
type ListItemBlock = { type: 'list-item'; children: InlineNode[] };
type ListBlock = { type: 'list'; format: 'unordered'; children: ListItemBlock[] };
type Block = HeadingBlock | ParagraphBlock | ListBlock;

function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push({ type: 'text', text: text.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      nodes.push({ type: 'text', text: match[1], bold: true });
    } else if (match[2] !== undefined && match[3] !== undefined) {
      nodes.push({ type: 'link', url: match[3], children: [{ type: 'text', text: match[2] }] });
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push({ type: 'text', text: text.slice(lastIndex) });
  }

  return nodes.length > 0 ? nodes : [{ type: 'text', text }];
}

export function markdownToBlocks(md: string): Block[] {
  const lines = md.split('\n');
  const blocks: Block[] = [];
  let listItems: ListItemBlock[] = [];

  function flushList() {
    if (listItems.length > 0) {
      blocks.push({ type: 'list', format: 'unordered', children: [...listItems] });
      listItems = [];
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flushList();
      blocks.push({ type: 'heading', level: 3, children: [{ type: 'text', text: trimmed.slice(4) }] });
    } else if (trimmed.startsWith('## ')) {
      flushList();
      blocks.push({ type: 'heading', level: 2, children: [{ type: 'text', text: trimmed.slice(3) }] });
    } else if (trimmed.startsWith('- ')) {
      listItems.push({ type: 'list-item', children: parseInline(trimmed.slice(2)) });
    } else {
      flushList();
      blocks.push({ type: 'paragraph', children: parseInline(trimmed) });
    }
  }

  flushList();
  return blocks;
}
