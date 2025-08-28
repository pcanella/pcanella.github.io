import styles from './style.scss?inline';

const template = document.createElement('template');
template.innerHTML = `
  <style>${styles}</style>
  <div id="macintosh-menu-component" class="macintosh-menu">
    <button class="macintosh-menu__button">
        <slot name="menuTitle"></slot>
    </button>
    <div class="macintosh-menu__content" aria-expanded="false">
        <ul>
            <slot name="menuList"></slot>
        </ul>
    </div>
  </div>
`;

class MacDropdown extends HTMLElement {
    private content: HTMLElement | null = null;
    private shadow: ShadowRoot | null = null;
    private button: HTMLButtonElement | null = null;
    private _isClicked: boolean = false;
    static get observedAttributes() {
    return ['open'];
  }
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));
        this.shadow = shadow;
        this.content = shadow?.querySelector('.macintosh-menu__content');
        this._isClicked = false;
        this.setAttribute('open', 'false');

    }

    connectedCallback() {
        const menuButtonClassName = '.macintosh-menu__button';
        // const button = shadow?.querySelector(menuButtonClassName);
        // const dropdown = shadow?.querySelector('.macintosh-menu__content');
        this.button = this.shadow?.querySelector(menuButtonClassName);
        this.content = this.shadow?.querySelector('.macintosh-menu__content');

        this.button?.addEventListener('click', this.toggleMenu);
        document.addEventListener('click', this.handleDocumentClick);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'open') {
            if (newValue === 'false') {
                 this.content?.setAttribute('aria-expanded', 'false');
            }
        }
    }

    get isClicked(): boolean {
        return this._isClicked;
    }

    set isClicked(clicked: boolean) {
        this._isClicked = clicked;


        if (clicked) {
            this.setAttribute('open', 'true');
            // this.button?.classList.add('is-clicked');
        } else {
            this.setAttribute('open', 'false');
            // this.button?.classList.remove('is-clicked');
        }

    }

    toggleMenu = (event: Event) => {
        event.stopPropagation();


        this.dispatchEvent(new CustomEvent('menu-clicked', {
            bubbles: true, // allows the event to bubble up through the DOM
            composed: true, // allows the event to pass through shadow DOM boundaries
            detail: {
                message: 'Button was clicked!',
                timestamp: Date.now()
            }
        }));

        if (!this.content) return;
        const currentAriaExpanded = this.content?.getAttribute('aria-expanded');
        this.isClicked = !this.isClicked;
        if (currentAriaExpanded === 'true') return;
        this.content?.setAttribute('aria-expanded', 'true');
        this.setAttribute('open', 'true');
    };

    handleDocumentClick = (event: MouseEvent) => {
        const currentAriaExpanded = this.content?.getAttribute('aria-expanded');
        if (event.composedPath()[0].classList.contains('mainWindow') || event.composedPath()[0].classList.contains('topBar')) {
            if (currentAriaExpanded === 'true') {
                this.content?.setAttribute('aria-expanded', 'false');
                this.setAttribute('open', 'false');
            }
            this.isClicked = false;
        } else {
            // if (currentAriaExpanded === 'true') return;
            // this.content?.setAttribute('aria-expanded', 'true');
        }
    };
}

customElements.define('macintosh-menu', MacDropdown);
