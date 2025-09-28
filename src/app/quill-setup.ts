import Quill from 'quill';
import { Placeholder } from './placeholder';
import { PlaceholderTooltip } from './placeholder-tooltip';

Quill.register(Placeholder);
Quill.register('modules/placeholderTooltip', PlaceholderTooltip);

console.log('setup complete!');
