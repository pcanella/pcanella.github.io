import styles from './style.scss?inline';

export default class MacDropdown extends HTMLElement {
    constructor() {
        super();
        this._count = 0;
        this._listItems = [];

        const style = document.createElement('style');
        style.textContent = styles; // raw CSS string

        this.shadowRoot.appendChild(style);


        // Attach a shadow DOM to the custom element
        const shadowRoot = this.attachShadow({ mode: "open" });
        // Create a template for the component's content
        const template = document.getElementById("menuTemplate");
        // Append the template content to the shadow DOM
        shadowRoot.appendChild(template?.content?.cloneNode(true));
    }

    get count() {
        return this._count;
    }

    set count(value) {
        this._count = value;
        // this.render();
    }


    get listItems() {
        return this._listItems;
    }

    set listItems(value = '[]') {
        this._listItems = JSON.parse(value);
    }

    // Define observed attributes to react to changes
    static get observedAttributes() {
        return ["name"];
    }

    // Callback for when observed attributes change
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "name") {
            const slot = this.shadowRoot.querySelector(
                'slot[name="greeting-name"]',
            );
            if (slot) {
                slot.textContent = newValue;
            }
        }
    }

    handleClick() {
        debugger;
    }

    // Callback when the element is added to the DOM
    connectedCallback() {
        const listItems = this.getAttribute('data-list');
        this.listItems = listItems;

        debugger;
        this.shadowRoot?.getElementById('retro-mac-menu')?.addEventListener('click', () => {
            const dropDownMenuEl = this.shadowRoot?.querySelector('.dropdown-menu-content');
            const currentAriaStatus = dropDownMenuEl?.getAttribute("aria-expanded");
            dropDownMenuEl?.setAttribute(
                "aria-expanded",
                currentAriaStatus === "true" ? "false" : "true",
            );
        });


        // Set initial content for the slot based on the 'name' attribute
        const initialName = this.getAttribute("name") || "Default Name";
        const slot = this.shadowRoot.querySelector(
            'slot[name="greeting-name"]',
        );
        if (slot) {
            slot.textContent = initialName;
        }
    }
}

// Define the custom element
debugger;
customElements.define("retro-mac-menu", MacDropdown);