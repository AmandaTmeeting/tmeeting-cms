/**
 * htmlToBlocks — converts an AirSquare content-block HTML subtree into the
 * Strapi v5 "blocks" rich-text shape (same shape produced by markdownToBlocks).
 *
 * Supported blocks: heading (2/3), paragraph, list (ordered/unordered), quote, image.
 * Inline: text, bold, italic, link. Embedded media (Vimeo/YouTube/iframes) and
 * <img> are captured into `media`/`embeds` for later linking and emitted as
 * placeholder paragraphs so nothing silently disappears.
 */
import { parseDocument } from 'htmlparser2';
import type { Node, Element, Document } from 'domhandler';

export type TextNode = { type: 'text'; text: string; bold?: true; italic?: true };
export type LinkNode = { type: 'link'; url: string; children: TextNode[] };
export type InlineNode = TextNode | LinkNode;

export type Block =
  | { type: 'heading'; level: 2 | 3 | 4; children: InlineNode[] }
  | { type: 'paragraph'; children: InlineNode[] }
  | { type: 'list'; format: 'ordered' | 'unordered'; children: { type: 'list-item'; children: InlineNode[] }[] }
  | { type: 'quote'; children: InlineNode[] }
  | { type: 'image'; image: { url: string; alt?: string } };

export type ExtractedMedia = { url: string; alt?: string; kind: 'image' };
export type ExtractedEmbed = { provider: 'vimeo' | 'youtube' | 'other'; url: string };

export interface BlocksResult {
  blocks: Block[];
  media: ExtractedMedia[];
  embeds: ExtractedEmbed[];
}

const isElement = (n: Node): n is Element => n.type === 'tag';
const isText = (n: Node): boolean => n.type === 'text';

function decodeEntities(s: string): string {
  return s
    .replace(/&#160;|&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

const collapse = (s: string): string => decodeEntities(s).replace(/\s+/g, ' ');

/** Walk inline children, accumulating text/bold/italic/link nodes. */
function inline(nodes: Node[], ctx: { bold?: true; italic?: true } = {}): InlineNode[] {
  const out: InlineNode[] = [];
  const pushText = (text: string) => {
    if (!text) return;
    const node: TextNode = { type: 'text', text };
    if (ctx.bold) node.bold = true;
    if (ctx.italic) node.italic = true;
    out.push(node);
  };

  for (const n of nodes) {
    if (isText(n)) {
      pushText(collapse((n as unknown as { data: string }).data));
    } else if (isElement(n)) {
      const tag = n.name.toLowerCase();
      if (tag === 'br') {
        pushText(' ');
      } else if (tag === 'strong' || tag === 'b') {
        out.push(...inline(n.children, { ...ctx, bold: true }));
      } else if (tag === 'em' || tag === 'i') {
        out.push(...inline(n.children, { ...ctx, italic: true }));
      } else if (tag === 'a') {
        const url = n.attribs?.href ?? '';
        const text = collapse(textOf(n));
        if (url && text) {
          out.push({ type: 'link', url, children: [{ type: 'text', text }] });
        } else {
          pushText(text);
        }
      } else {
        // span, font, etc. — recurse inline
        out.push(...inline(n.children, ctx));
      }
    }
  }
  return out;
}

function textOf(n: Node): string {
  if (isText(n)) return (n as unknown as { data: string }).data;
  if (isElement(n)) return n.children.map(textOf).join('');
  return '';
}

function nonEmpty(nodes: InlineNode[]): boolean {
  return nodes.some((x) => (x.type === 'text' ? x.text.trim() : x.children.some((c) => c.text.trim())));
}

export function htmlToBlocks(html: string): BlocksResult {
  const doc: Document = parseDocument(html);
  return collectBlocks(doc.children);
}

export function collectBlocks(roots: Node[]): BlocksResult {
  const blocks: Block[] = [];
  const media: ExtractedMedia[] = [];
  const embeds: ExtractedEmbed[] = [];

  function captureImg(el: Element) {
    const url = el.attribs?.src || el.attribs?.['data-src'] || '';
    if (!url || url.startsWith('data:')) return;
    const alt = el.attribs?.alt;
    media.push({ url, alt, kind: 'image' });
    blocks.push({ type: 'image', image: { url, ...(alt ? { alt } : {}) } });
  }

  function captureIframe(el: Element) {
    const url = el.attribs?.['data-src'] || el.attribs?.src || '';
    if (!url) return;
    const provider = /vimeo/.test(url) ? 'vimeo' : /youtu/.test(url) ? 'youtube' : 'other';
    embeds.push({ provider, url });
    blocks.push({ type: 'paragraph', children: [{ type: 'link', url, children: [{ type: 'text', text: `[${provider} video] ${url}` }] }] });
  }

  function walk(nodes: Node[]) {
    for (const n of nodes) {
      if (!isElement(n)) continue;
      const tag = n.name.toLowerCase();

      switch (tag) {
        case 'h1':
        case 'h2':
          pushBlock({ type: 'heading', level: 2, children: inline(n.children) });
          break;
        case 'h3':
          pushBlock({ type: 'heading', level: 3, children: inline(n.children) });
          break;
        case 'h4':
        case 'h5':
        case 'h6':
          pushBlock({ type: 'heading', level: 4, children: inline(n.children) });
          break;
        case 'p':
          pushBlock({ type: 'paragraph', children: inline(n.children) });
          break;
        case 'blockquote':
          pushBlock({ type: 'quote', children: inline(n.children) });
          break;
        case 'ul':
        case 'ol': {
          const items = n.children
            .filter((c): c is Element => isElement(c) && c.name.toLowerCase() === 'li')
            .map((li) => ({ type: 'list-item' as const, children: inline(li.children) }))
            .filter((li) => nonEmpty(li.children));
          if (items.length) blocks.push({ type: 'list', format: tag === 'ol' ? 'ordered' : 'unordered', children: items });
          break;
        }
        case 'img':
          captureImg(n);
          break;
        case 'iframe':
          captureIframe(n);
          break;
        case 'br':
        case 'script':
        case 'style':
        case 'noscript':
          break;
        default:
          // container (div, section, span, figure, ...) — descend
          walk(n.children);
      }
    }
  }

  function pushBlock(b: Block) {
    if ((b.type === 'heading' || b.type === 'paragraph' || b.type === 'quote') && !nonEmpty(b.children)) return;
    blocks.push(b);
  }

  walk(roots);
  return { blocks, media, embeds };
}
