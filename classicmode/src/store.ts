import { atom } from 'nanostores';

export const windowIdxActive = atom(0);

export const isHardDriveClicked = atom(false);

export const isPatricksMacOpen = atom(false);

export const isStartingUp = atom(true);

export const progress = atom(0) // range 0 to 100

export const menuId = atom(-1);