import { menuId } from '../../store.js';
export const test = (mId, ddId) => {
    menuId.set(mId);
    debugger;
    const ddidEl = document.querySelector(`#${ddId} div`);
    const currentAriaStatus = ddidEl?.getAttribute('aria-expanded');
    debugger;
    if (mId === menuId) {
        ddidEl?.setAttribute('aria-expanded', currentAriaStatus === 'true' ? 'false' : 'true');
    }
}