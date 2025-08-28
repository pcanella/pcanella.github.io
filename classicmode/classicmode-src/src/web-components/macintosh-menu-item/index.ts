import styles from './style.scss?inline';

const template = document.createElement('template');
template.innerHTML = `
  <style>${styles}</style>
  <li id="macintosh-menu-item-component" class="macintosh-menu-item">
    <slot/>
  </li>
`;

class MacintoshMenuItem extends HTMLElement {

    private item: any = null;
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));
        this.item = shadow?.querySelector('.macintosh-menu-item');
    }

    handleTimeoutClickEffect(e) {
        const linkHref = this?.getAttribute('href');
        const clickHandler = this?.getAttribute('onclick');
        // if (e.target.id === scope("menu-item")) {
        // We want it to blink and THEN go to the href properly
        e.preventDefault();
        const listItemEl = this.shadowRoot?.querySelector('li');
        listItemEl?.classList.add("is-clicked");
        setTimeout(() => {
            // window.open(e.target.href, "_blank");
            // const linkHref = listItemEl?.getAttribute('href');
            // const onClickHandler = listItemEl?.getAttribute('onclick');
            debugger;
            if (linkHref) {
                let newTab = window.open();

                const interval = setInterval(() => {
                    try {
                        // Accessing location.href will throw a security error if not ready or cross-origin
                        newTab.location.href = linkHref;
                        clearInterval(interval);
                    } catch (e) {
                        // Wait until it's ready
                    }
                }, 150);

                // newTab.location.href = linkHref;
            } else if (clickHandler) {
                // this.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
                // debugger;
            }
            listItemEl?.classList.remove("is-clicked");

        }, 700);
        return;
    }

    connectedCallback() {


        this.item.addEventListener('click', (e) => {
            this.handleTimeoutClickEffect(e);
        })
    }

}

customElements.define('macintosh-menu-item', MacintoshMenuItem);
