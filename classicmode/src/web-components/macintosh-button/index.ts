import styles from './style.scss?inline';

const template = document.createElement('template');
template.innerHTML = `
  <style>${styles}</style>
  <button id="macintosh-button-component" class="macintosh-button">
    <slot/>
</button>
`;

class MacintoshButton extends HTMLElement {
  private shadow: ShadowRoot | null | undefined = null;
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['src'];
  }


  connectedCallback() {
   
  }

}

customElements.define('macintosh-button', MacintoshButton);
