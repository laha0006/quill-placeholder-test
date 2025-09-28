import Quill from 'quill';

const Module = Quill.import('core/module');

export interface PlaceholderValue {
  label: string;
  key: string;
}

export class PlaceholderTooltip extends Module {
  //override quill: Quill;
  tooltip: any; // Snow theme tooltip instance

  constructor(quill: Quill, options: any) {
    super(quill, options);
    this.quill = quill;
    console.log('Quill Instance:', this.quill);
    const theme: any = this.quill.theme;
    console.log('theme:', theme);
    this.tooltip = theme?.tooltip || null;
  }

  open(initial: Partial<PlaceholderValue> = {}) {
    if (!this.tooltip) return;
    const range = this.quill.getSelection(true);
    if (!range) return;

    // Show and position tooltip
    this.tooltip.show();
    const bounds = this.quill.getBounds(range);
    this.tooltip.position(bounds);

    // Reset state: ensure link-specific UI doesn't show
    this.tooltip.root.classList.remove('ql-editing');
    // Remove any ARIA/role attributes if the theme added specific ones for link mode
    this.tooltip.root.removeAttribute('data-mode');

    // Replace content entirely
    const prevHTML = this.tooltip.root.innerHTML;
    this.tooltip.root.innerHTML = '';

    // Build minimal form
    const container = document.createElement('div');
    container.className = 'ql-placeholder-form';
    container.innerHTML = `
      <label class="ql-placeholder-field">
        <span>Label</span>
        <input class="ql-placeholder-input" name="label" type="text"
               value="${(initial.label ?? '').replace(/"/g, '&quot;')}" />
      </label>
      <label class="ql-placeholder-field">
        <span>Key</span>
        <input class="ql-placeholder-input" name="key" type="text"
               value="${(initial.key ?? '').replace(/"/g, '&quot;')}" />
      </label>
      <div class="ql-placeholder-actions">
        <button type="button" class="ql-action ql-placeholder-insert">Insert</button>
        <button type="button" class="ql-cancel ql-placeholder-cancel">Cancel</button>
      </div>
    `;
    this.tooltip.root.appendChild(container);

    const labelEl = container.querySelector('input[name="label"]') as HTMLInputElement;
    const keyEl = container.querySelector('input[name="key"]') as HTMLInputElement;
    const insertBtn = container.querySelector('.ql-placeholder-insert') as HTMLButtonElement;
    const cancelBtn = container.querySelector('.ql-placeholder-cancel') as HTMLButtonElement;

    const cleanup = () => {
      this.tooltip.hide();
      // Restore Snow’s original tooltip content
      this.tooltip.root.innerHTML = prevHTML;
    };

    const insert = () => {
      const label = (labelEl?.value ?? '').trim();
      const key = (keyEl?.value ?? '').trim();
      this.insertPlaceholder(range.index, range.length, { label, key });
      cleanup();
    };

    insertBtn?.addEventListener('click', insert, { once: true });
    cancelBtn?.addEventListener('click', cleanup, { once: true });
    container.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        insert();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cleanup();
      }
    });

    // Prefill from selection
    if (range.length > 0 && !initial.label) {
      const selected = this.quill.getText(range.index, range.length).trim();
      if (selected) labelEl.value = selected;
    }

    setTimeout(() => labelEl?.focus(), 0);
  }

  private insertPlaceholder(index: number, length: number, value: PlaceholderValue) {
    let insertIndex = index;
    if (length > 0) {
      const selected = this.quill.getText(index, length).trim();
      this.quill.deleteText(index, length, 'user');
      if (!value.label) value.label = selected;
    }
    this.quill.insertEmbed(insertIndex, 'placeholder', value, 'user');
    this.quill.insertText(insertIndex + 1, ' ', 'user');
    this.quill.setSelection(insertIndex + 2, 0, 'user');
  }
}
