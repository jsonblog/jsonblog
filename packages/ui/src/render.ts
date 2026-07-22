import type { VNode } from 'preact';
import { render } from 'preact-render-to-string';

/** Render a page component to a complete static HTML document (with doctype). */
export function renderDocument(vnode: VNode): string {
  return `<!doctype html>\n${render(vnode)}\n`;
}

/** Render a component to an HTML fragment (no doctype) — handy for the styleguide. */
export function renderFragment(vnode: VNode): string {
  return render(vnode);
}
