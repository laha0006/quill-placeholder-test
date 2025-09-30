import { Delta } from 'quill/core';

export function render(delta: Delta): Delta | null {
  const ops = delta.ops;
  if (ops.length < 0) return null;

  const renderedOps = ops.map((op) => {
    if (!op.insert) return op;
    const insert = op.insert;
    const attributes = op.attributes;
    if (typeof insert !== 'object') return op;
    const placeholder = insert['placeholder'];
    if (!placeholder) return op;
    if (!attributes) {
      return { insert: 'RENDERED' };
    }
    return { attributes, insert: 'RENDERED' };
  });

  if (renderedOps === undefined) return null;

  return new Delta(renderedOps);
}
