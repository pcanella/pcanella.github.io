import styles from './style.scss?inline';

const template = document.createElement('template');
template.innerHTML = `
  <style>${styles}</style>
  <button id="macintosh-icon-button-component" data-single-click="false" class="macintosh-icon-button">
    <div class="macintosh-icon-button__button-container">
        <div class="macintosh-icon-button__icon-container" data-single-click="false">
            <div class="macintosh-icon-button__detail"></div>
        </div>
        <div class="macintosh-icon-button__inner-text"><slot/></div>

    </div>
</button>
`;

class MacintoshIconButton extends HTMLElement {
  private shadow: ShadowRoot | null | undefined = null;
  private name: string | null | undefined
  private src: string | null;
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
    this.shadow = shadow;
    this.name = this.getAttribute('name');
    this.src = this.getAttribute('src');
  }

  static get observedAttributes() {
    return ['src'];
  }

  handleDoubleClick(e: Event) {
    this.dispatchEvent(new CustomEvent('double-clicked', {
      bubbles: true, // allows the event to bubble up through the DOM
      composed: true, // allows the event to pass through shadow DOM boundaries
      detail: {
        message: 'Button was double clicked!',
        timestamp: Date.now()
      }
    }));
  }

  connectedCallback() {
    // const macIconButton = this.shadow?.getElementById('macintosh-icon-button');
    this.name = this?.getAttribute('name');

    const iconContainer = this.shadow?.querySelector('.macintosh-icon-button__icon-container');

    iconContainer?.setAttribute('data-type', String(this.name));


    // If SRC exists, we will append an image
    if (this.src) {
      const imageEl = document.createElement('img');
      const iconContainerEl = this.shadow?.querySelector('.macintosh-icon-button__icon-container');
      imageEl.src = this.src;
      iconContainerEl?.appendChild(imageEl);
      iconContainerEl?.setAttribute('data-type', 'image')
    }

    // const linkTo = this?.getAttribute('href');

    // // const thisPossibleLink = this.item.querySelector('a');

    // if (linkTo) {
    //     // this.removeAttribute('hidden');
    //     this.item.setAttribute('href', linkTo);
    //     this.item.setAttribute('role', 'link');
    // }

    // // const button = shadow?.querySelector(menuButtonClassName);
    // // const dropdown = shadow?.querySelector('.macintosh-menu__content');
    // // this.button = this.shadow?.querySelector(menuButtonClassName);
    // // this.content = this.shadow?.querySelector('.macintosh-menu__content');

    // this.addEventListener('click', this.handleClick)
    this.addEventListener('dblclick', this.handleDoubleClick)

  }

}

customElements.define('macintosh-icon-button', MacintoshIconButton);
