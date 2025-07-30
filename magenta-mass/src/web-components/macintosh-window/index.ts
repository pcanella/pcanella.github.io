import styles from './style.scss?inline';

const template = document.createElement('template');
template.innerHTML = `
  <style>${styles}</style>
  <li id="macintosh-menu-item-component" class="macintosh-menu-item">
    <slot/>
  </li>
`;

class MacintoshMenuItem extends HTMLElement {
    private shadow: ShadowRoot | null = null;
    private item: any = null;
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));
        this.shadow = shadow;
        this.item = shadow?.querySelector('.macintosh-menu-item');
    }

    handleTimeoutClickEffect(e) {

        // if (e.target.id === scope("menu-item")) {
        // We want it to blink and THEN go to the href properly
        e.preventDefault();
        const listItemEl = this.shadowRoot.querySelector('li');
        listItemEl?.classList.add("is-clicked");
        setTimeout(() => {
            // window.open(e.target.href, "_blank");
            debugger;
            let newTab = window.open();
            newTab.location.href = listItemEl.getAttribute('href')
            listItemEl?.classList.remove("is-clicked");
        }, 700);
        return;
    }

    connectedCallback() {

        const linkTo = this?.getAttribute('href');

        // const thisPossibleLink = this.item.querySelector('a');

        if (linkTo) {
            // this.removeAttribute('hidden');
            this.item.setAttribute('href', linkTo);
            this.item.setAttribute('role', 'link');
        }

        // const button = shadow?.querySelector(menuButtonClassName);
        // const dropdown = shadow?.querySelector('.macintosh-menu__content');
        // this.button = this.shadow?.querySelector(menuButtonClassName);
        // this.content = this.shadow?.querySelector('.macintosh-menu__content');

        this.item.addEventListener('click', (e) => {
            debugger;
            this.handleTimeoutClickEffect(e);
        })




    }

}

customElements.define('macintosh-menu-item', MacintoshMenuItem);
