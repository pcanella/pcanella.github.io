// macintosh-window.ts
import styles from './style.scss?inline';
import interact from 'interactjs';

// ---------- Template defined outside the component ----------
const template = document.createElement('template');
template.innerHTML = `
  <style>${styles}</style>
  <div class="macintosh-window__wrapper">
    <div class="macintosh-window__window" aria-hidden="false" data-x="0" data-y="0">
      <div class="macintosh-window__header">
        <div class="macintosh-window__background">
          <div class="macintosh-window__decor-line">
            <button class="macintosh-window__top-button macintosh-window__top-button--left">
              <div class="macintosh-window__inner-button"></div>
            </button>
          </div>
        </div>
        <div class="macintosh-window__middle-header"></div>
        <div class="macintosh-window__background">
          <div class="macintosh-window__decor-line">
            <button class="macintosh-window__top-button macintosh-window__top-button--right">
              <div class="macintosh-window__inner-button"></div>
            </button>
          </div>
        </div>
        <div class="macintosh-window__right-header-side"></div>
        <span class="macintosh-window__border macintosh-window__border--first"></span>
        <span class="macintosh-window__border macintosh-window__border--second"></span>
      </div>

      <div class="macintosh-window__main-content">
        <div class="macintosh-window__body" style="visibility: hidden;">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
`;

// ---------- Web Component ----------
export class MacintoshWindow extends HTMLElement {
    private shadow: ShadowRoot;
    private position = { x: 0, y: 0 };
    private resizeObserver?: ResizeObserver;

    private rootEl?: HTMLElement;
    private headerEl?: HTMLElement;
    private bodyEl?: HTMLElement;
    private mainContentEl?: HTMLElement;
    private leftMenuButtonEl?: HTMLElement;
    private rightMenuButtonEl?: HTMLElement;
    private isActive: boolean = false
    private interact: any;
    private isDragging: boolean = false;
    static get observedAttributes() {
        return ['header', 'x', 'y', 'width', 'height', 'aria-hidden', 'drag-id','data-active'];
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {
        this.resizeObserver?.disconnect();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.shadowRoot) return;
                debugger;

        switch (name) {
            case 'width':
            case 'height':
                this.rootEl?.style.setProperty(name, `${newValue}px`);
                this.rootEl?.style.setProperty(`min-${name}`, `${newValue}px`);
                break;
            case 'x':
            case 'y':
                this.position[name] = Number(newValue);

                if (this.rootEl) {
                this.rootEl.style.transform =
                    `translate(${this.position.x}px, ${this.position.y}px)`;
                }
                break;
            // etc.
            case 'data-active':
                if (newValue === "true") {
                    this.interact?.draggable(true);
                } else {
                    this.interact?.draggable(false);
                }
                break;
            default:
                this.render(); // only rerender for big changes
        }
    }


    private render() {
        this.shadow.innerHTML = '';
        const frag = template.content.cloneNode(true) as DocumentFragment;
        this.shadow.appendChild(frag);

        const header = this.getAttribute('data-header') ?? '';
        const dragId = this.getAttribute('drag-id') ?? '0';
        const x = Number(this.getAttribute('x') ?? 0);
        const y = Number(this.getAttribute('y') ?? 0);
        const width = (this.getAttribute('width') ?? '300') + 'px';
        const height = (this.getAttribute('height') ?? '300') + 'px';
        const hidden = this.getAttribute('aria-hidden') === 'true';
        const active = this.getAttribute('data-active') ?? "false";
        this.isActive = active === 'true';
        this.rootEl = this.shadow.querySelector('.macintosh-window__window') as HTMLElement;
        this.headerEl = this.shadow.querySelector('.macintosh-window__header') as HTMLElement;
        this.bodyEl = this.shadow.querySelector('.macintosh-window__body') as HTMLElement;
        this.mainContentEl = this.shadow.querySelector('.macintosh-window__main-content') as HTMLElement;
        this.leftMenuButtonEl = this.shadow.querySelector('.macintosh-window__top-button--left') as HTMLElement
        this.rightMenuButtonEl = this.shadow.querySelector('.macintosh-window__top-button--right') as HTMLElement

        const draggableId = `macintosh-window-${dragId}`;
        const headerId = `macintosh-window__header-${dragId}`;
        const bodyId = `macintosh-window__body-${dragId}`;
        const contentId = `macintosh-window__content-${dragId}`;

        if (this.rootEl) this.rootEl.id = draggableId;
        if (this.headerEl) this.headerEl.id = headerId;
        if (this.bodyEl) this.bodyEl.id = bodyId;
        if (this.mainContentEl) this.mainContentEl.id = contentId;

        if (this.rootEl) {
            this.rootEl.ariaHidden = String(hidden);
            this.rootEl.style.width = width;
            this.rootEl.style.minWidth = width;
            this.rootEl.style.height = height;
            this.rootEl.style.minHeight = height;
            this.rootEl.dataset.x = String(x);
            this.rootEl.dataset.y = String(y);
            this.rootEl.dataset.active = active;
            this.position.x = x;
            this.position.y = y;
            this.rootEl.style.transform = `translate(${x}px, ${y}px)`;
        }

        const middleHeader = this.shadow.querySelector('.macintosh-window__middle-header') as HTMLElement;
        if (middleHeader) {
            middleHeader.textContent = header;
        }

        setTimeout(() => {
            if (this.bodyEl) this.bodyEl.style.visibility = 'visible';
        }, 500);

        this.setupResizeObserver();
        this.setupGhostHandlers(headerId, draggableId);
        this.setupDraggable(headerId, draggableId);
    }

    private setupResizeObserver() {
        this.resizeObserver?.disconnect();

        if (!this.bodyEl || !this.headerEl) return;

        this.resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const w = entry.contentRect.width;
                const h = entry.contentRect.height;
                this.headerEl!.style.width = `${w + 19.5}px `;
                this.headerEl!.style.height = `${19.5}px `;
            }
        });

        this.resizeObserver.observe(this.bodyEl);
    }

    private setupDraggable(headerId: string, draggableId: string) {
        if (!this.rootEl) return;

        const allowFromEl = this.shadow.getElementById(headerId) as HTMLElement | null;

        this.interact = interact(this.rootEl).draggable({
            allowFrom: allowFromEl ?? undefined,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: '.mainWindow', // light-DOM restriction container
                }),
            ],
            listeners: {
                move: (event) => {
                    this.position.x += event.dx;
                    this.position.y += event.dy;

                    this.rootEl!.style.transform =
                        `translate(${this.position.x}px, ${this.position.y}px)`;

                    // keep attributes in sync if you read them elsewhere
                    this.rootEl!.dataset.x = String(this.position.x);
                    this.rootEl!.dataset.y = String(this.position.y);
                },
            },
        });
    }

    private setupGhostHandlers(headerId: string, draggableId: string) {
        const headerEl = this.shadow.getElementById(headerId);
        const draggableEl = this.shadow.getElementById(draggableId) as HTMLElement | null;
        if (!headerEl || !draggableEl) return;

        const onMouseDown = () => {
            this.rootEl?.classList.add('is-dragging');
            this.isDragging = true;
            // if (!this.isActive) {
            //     this.interact.draggable(false)
            //     return;
            // }
            const ghost = document.createElement('div');
            ghost.className = 'macintosh-window__ghost';
            ghost.style.width = `${draggableEl.clientWidth}px`;
            ghost.style.height = `${draggableEl.clientHeight}px`;
            ghost.style.position = 'absolute';
            ghost.style.zIndex = '1';
            ghost.style.transform = draggableEl.style.transform;
            ghost.style.border = '2px dotted rgb(166,166,166)';
            // document.querySelector('main')?.appendChild(ghost);
        };

        const onMouseUp = () => {
            this.isDragging = false;


            this.rootEl?.classList.remove('is-dragging');

            if (!this.isActive) return;
            document.querySelectorAll('.macintosh-window__ghost').forEach((g) => g.remove());
        };

        this.rootEl?.addEventListener('click', (event) => {
            // debugger;
            // if (!this.isActive) {
            //     this.draggable.draggable(false);
            // } else {
            //     this.draggable.draggable(true);
            // }

            if ((event.target?.isEqualNode(this.leftMenuButtonEl) || event.target?.isEqualNode(this.rightMenuButtonEl)) && this.isActive) {
                event?.stopPropagation();
                return;
            }

            this.dispatchEvent(new CustomEvent('macintosh:window-click', {
                bubbles: true, // allows the event to bubble up through the DOM
                composed: true, // allows the event to pass through shadow DOM boundaries
                detail: {
                    message: 'window was clicked!!',
                    timestamp: Date.now()
                }
            }));
        })

        headerEl.addEventListener('mousedown', onMouseDown);
        headerEl.addEventListener('mouseup', onMouseUp);
        this.leftMenuButtonEl?.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('macintosh:window-close-button', {
                bubbles: true, // allows the event to bubble up through the DOM
                composed: true, // allows the event to pass through shadow DOM boundaries
                detail: {
                    message: 'button was clicked!!',
                    timestamp: Date.now()
                }
            }));
        })

        this.rightMenuButtonEl?.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('macintosh:window-expand-button', {
                bubbles: true, // allows the event to bubble up through the DOM
                composed: true, // allows the event to pass through shadow DOM boundaries
                detail: {
                    message: 'button was clicked!!',
                    timestamp: Date.now()
                }
            }));
        })
    }
}

customElements.define('macintosh-window', MacintoshWindow);
