// macintosh-dialog-box.ts
import styles from './style.scss?inline';

// ---------- Template ----------
const template = document.createElement('template');
template.innerHTML = `
  <style>${styles}</style>
  <div class="macintosh-dialog-box">
   <div class="macintosh-dialog-box__container">
    <div class="macintosh-dialog-box__icon-container">
        <slot name="icon"/>
    </div>
    <div class="macintosh-dialog-box__text-content>
        <slot/>
    </div>
   </div>
  </div>
`;

export class MacintoshDialogBox extends HTMLElement {
  private shadow: ShadowRoot;
  private rootEl?: HTMLElement;
  private bodyEl?: HTMLElement;
  private leftBtn?: HTMLButtonElement | null;

  // Supported attributes:
  // - data-header: string (header text)
  // - width: CSS length (e.g., "420px" or "40rem")
  // - height: CSS length (optional)
  // - aria-hidden: "true" | "false"
  // - data-active: "true" | "false" (for styling states only)
  static get observedAttributes() {
    return ['data-header', 'width', 'height', 'aria-hidden', 'data-active'];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
  }

  attributeChangedCallback() {
    // Only reapply dynamic bits; avoid nuking & rebuilding the DOM
    this.applyAttributes();
  }

  private render() {
    this.shadow.innerHTML = '';
    this.shadow.appendChild(template.content.cloneNode(true));

    this.rootEl = this.shadow.querySelector('.macintosh-window__window') as HTMLElement;
    this.bodyEl = this.shadow.querySelector('.macintosh-dialog-box__text-content') as HTMLElement;
    this.iconEl = this.shadow.querySelector('.macintosh-dialog-box__icon-container') as HTMLElement;
    this.applyAttributes();
  }

  private applyAttributes() {
    if (!this.rootEl || !this.headerTextEl) return;

    const header = this.getAttribute('data-header') ?? '';
    const width = this.getAttribute('width') ?? '300px';
    const height = this.getAttribute('height');
    const ariaHidden = this.getAttribute('aria-hidden') === 'true';
    const active = this.getAttribute('data-active') ?? 'false';

    this.headerTextEl.textContent = header;
    this.rootEl.style.width = width;
    this.rootEl.style.minWidth = width;
    this.rootEl.style.height = height ?? '';
    this.rootEl.ariaHidden = String(ariaHidden);
    this.rootEl.dataset.active = active;
  }

}

customElements.define('macintosh-dialog-box', MacintoshDialogBox);
