import features from '../feature-manager.js';
import {isEditable} from '../helpers/dom-utils.js';

async function handler({key, target}: KeyboardEvent): Promise<void> {
	if (key === 'y' && !isEditable(target)) {
		const url = location.href;
		const title = document.querySelector('title')?.textContent;

		try {
			if (title && navigator.clipboard) {
				// Copy as rich content (HTML link + plain text)
				const text = `${title} (${url})`;
				const permalink = `<a href="${url}">${title}</a>`;

				await navigator.clipboard.write([
					new ClipboardItem({
						'text/plain': new Blob([text], {type: 'text/plain'}),
						'text/html': new Blob([permalink], {type: 'text/html'}),
					}),
				]);

				// Show visual feedback
				showFeedback('Copied link with title');
			} else {
				// Fallback: copy URL only
				await navigator.clipboard.writeText(url);
				showFeedback('Copied link');
			}
		} catch {
			// Last resort fallback
			await navigator.clipboard.writeText(url);
			showFeedback('Copied link');
		}
	}
}

function showFeedback(message: string): void {
	// Create toast notification
	const toast = document.createElement('div');
	toast.textContent = message;
	toast.style.cssText = `
		position: fixed;
		bottom: 16px;
		right: 16px;
		padding: 8px 16px;
		background: #0366d6;
		color: white;
		border-radius: 4px;
		z-index: 9999;
	`;
	document.body.append(toast);
	setTimeout(() => toast.remove(), 2000);
}

function init(signal: AbortSignal): void {
	globalThis.addEventListener('keyup', handler, {signal});
}

void features.add(import.meta.url, {
	init,
});
// TODO: Add visual popup, maybe use GitHub's own clipboard element

/*

Test URLs

> Any page, particularly it should work copy the permalink when `y` is pressed on:

https://github.com/refined-github/refined-github/blob/main/.gitignore
feat(db): migrate to SingleStore and update connection handling by Abdulrahman-Sallam · Pull Request #1 · Abdulrahman-Sallam/plan

*/
