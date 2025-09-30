import Quill from 'quill';
import Embed from 'quill/blots/embed';
import { Blot } from '../../node_modules/parchment/dist/parchment';

export interface PlaceholderValue {
  label: string;
  key: string;
}

export class Placeholder extends Embed {
  static override blotName = 'placeholder';
  static override className = 'ql-placeholder';
  static override tagName = 'SPAN';

  static override create(value: PlaceholderValue) {
    const node = super.create() as HTMLElement;
    node.setAttribute('data-label', value?.label ?? '');
    node.setAttribute('data-key', value?.key ?? '');

    const tooltipText = `placeholder referencing: ${value?.key}`;
    node.setAttribute('title', tooltipText);
    node.setAttribute('contenteditable', 'false');
    node.setAttribute('tabindex', '0'); // focusable for keyboard users
    node.textContent = `{{ ${value?.label} }}`;
    return node;
  }

  static override value(node: HTMLElement): PlaceholderValue {
    return {
      label: node.getAttribute('data-label') || '',
      key: node.getAttribute('data-key') || '',
    };
  }
}

export function setupPlaceholderSelection(quill: Quill) {
  const root = quill.root;

  const selectWholeBlot = (evt: any) => {
    const target = evt.target.closest('.ql-placeholder');
    if (!target) return;

    // Prevent native partial selection
    evt.preventDefault();

    const blot = Quill.find(target) as Blot; // returns your PlaceholderBlot
    const index = quill.getIndex(blot);
    const length = 1; // typically 1 for embed, but see note below
    quill.setSelection(index, length, 'user');
  };

  root.addEventListener('mousedown', selectWholeBlot);
  root.addEventListener('click', selectWholeBlot);
  root.addEventListener('dblclick', selectWholeBlot);
}

export function setupClickToEnd(quill: Quill) {
  const root = quill.root;

  root.addEventListener('mousedown', (e) => {
    console.log('e', e);
    // If you clicked a real blot/leaf, let Quill handle it
    const blot = Quill.find(e.target as Node, true);
    if (blot && blot !== Quill.find(root)) return;

    // Otherwise, force caret to the end
    e.preventDefault();
    const index = Math.max(0, quill.getLength() - 1);
    quill.setSelection(index, 0, 'user');
  });
}
