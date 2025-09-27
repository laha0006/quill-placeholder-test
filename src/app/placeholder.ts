import Embed from 'quill/blots/embed';

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
