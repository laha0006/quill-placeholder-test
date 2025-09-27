import { Component, signal } from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import Quill from 'quill';
import { Placeholder } from './placeholder';

Quill.register(Placeholder);

@Component({
  selector: 'app-root',
  imports: [QuillEditorComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  quillInstance: Quill | null = null;

  created($event: Quill) {
    this.quillInstance = $event;
    console.log(this.quillInstance);
  }

  addPlaceholder() {
    const testData = {
      label: 'First Name',
      key: 'user.firstName',
    };
    const range = this.quillInstance?.getSelection(true) || { index: 0 };
    this.quillInstance?.insertEmbed(range?.index, 'placeholder', testData, 'user');
  }

  showDelta() {
    console.log(this.quillInstance?.getContents());
  }
}
