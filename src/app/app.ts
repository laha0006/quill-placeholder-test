import { Component, signal } from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import Quill from 'quill';

@Component({
  selector: 'app-root',
  imports: [QuillEditorComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  quillInstance: Quill | null = null;

  showPlaceholderModal = signal(false);
  placeholderLabel = signal('');
  placeholderKey = signal('');

  modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        ['link'],
        // Add our button
        ['placeholder'],
      ],
      handlers: {
        // When ql-placeholder is clicked, open our tooltip form
        placeholder: function (this: any, value: boolean) {
          console.log('>>>> CLICKED');
          const comp = (this.quill as any).__hostComponent as App;
          comp?.openPlaceholderModal();
        },
      },
    },
    // Enable our module
    placeholderTooltip: true,
  };

  created($event: Quill) {
    this.quillInstance = $event;
    ($event as any).__hostComponent = this;
  }

  openPlaceholderModal() {
    // Prefill label from selection
    const range = this.quillInstance?.getSelection(true);
    if (range && range.length > 0) {
      const selected = this.quillInstance!.getText(range.index, range.length).trim();
      this.placeholderLabel.set(selected);
    } else {
      this.placeholderLabel.set('');
    }
    this.placeholderKey.set('');
    this.showPlaceholderModal.set(true);
  }

  cancelPlaceholderModal() {
    this.showPlaceholderModal.set(false);
  }

  submitPlaceholderModal() {
    if (!this.quillInstance) return;
    const quill = this.quillInstance;
    const label = this.placeholderLabel().trim();
    const key = this.placeholderKey().trim();

    const range = quill.getSelection(true);
    if (!range) return;

    let insertIndex = range.index;
    if (range.length > 0) {
      const selectedText = quill.getText(range.index, range.length).trim();
      quill.deleteText(range.index, range.length, 'user');
      // If label not provided, default to selection
      const effectiveLabel = label || selectedText;
      quill.insertEmbed(insertIndex, 'placeholder', { label: effectiveLabel, key }, 'user');
    } else {
      quill.insertEmbed(insertIndex, 'placeholder', { label, key }, 'user');
    }
    quill.insertText(insertIndex + 1, ' ', 'user');
    quill.setSelection(insertIndex + 2, 0, 'user');

    this.showPlaceholderModal.set(false);
  }
  addPlaceholder() {
    const testData = {
      label: 'First Name',
      key: 'user.firstName',
    };
    const promptValue = prompt('Enter placer holder label:');
    // console.log(promptValue);
    const range = this.quillInstance?.getSelection(true) || { index: 0 };
    // this.quillInstance?.insertEmbed(range?.index, 'placeholder', testData, 'user');
    this.quillInstance?.format('placeholder', {
      label: 'Placeholder',
      key: promptValue,
    });
  }

  showDelta() {
    console.log(this.quillInstance?.getContents());
  }
}
