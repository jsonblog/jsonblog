import type { VNode } from 'preact';
import { render } from 'preact-render-to-string';

/** Render a page component to a complete static HTML document (with doctype). */
// biome-ignore lint/suspicious/noExplicitAny: accept any component's vnode
export function renderDocument(vnode: VNode<any>): string {
  return `<!doctype html>\n${render(vnode)}\n`;
}

/** Render a component to an HTML fragment (no doctype) — handy for the styleguide. */
// biome-ignore lint/suspicious/noExplicitAny: accept any component's vnode
export function renderFragment(vnode: VNode<any>): string {
  return render(vnode);
}
