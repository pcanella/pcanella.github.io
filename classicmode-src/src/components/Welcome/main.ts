// TO ANYONE READING THIS: I only asked AI to format this, the code itself is mine :) 

// ──────────────────────────────────────────────────────────────
// Imports
// ──────────────────────────────────────────────────────────────
import { isPatricksMacOpen, isStartingUp, progress } from "../../store.js";
import interact from 'interactjs';
// ──────────────────────────────────────────────────────────────
// Constants & Element Refs
// ──────────────────────────────────────────────────────────────
const SOUND_BIP = "/classic/assets/sounds/Bip.wav";
const DOUBLE_TAP_DELAY = 300; // ms

const welcomeWindow = document.getElementById("welcomewindow");
const myAppsWindow = document.getElementById("myappswindow");
const dialogBox = document.getElementById("openappdialog");
const folderEl = document.querySelector("[name='folder']");
const hardDriveEl = document.querySelector("[name='hard-drive']");
const aboutWindow = document.getElementById("aboutwindow");
const fhAppEl = document.querySelector("#fishharmonyicon");
const klickyTrackerIconEl = document.getElementById("klickytrackericon");
const mainWindow = document.getElementById("draggable-mainWindow");

const macFolders = [
    { thisEl: hardDriveEl, windowEl: welcomeWindow },
    { thisEl: folderEl, windowEl: myAppsWindow },
];

const macWindows = [welcomeWindow, myAppsWindow, aboutWindow];

let lastTap = 0;

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────
const playBip = () => {
    const audio = new Audio(SOUND_BIP);
    audio.play();
};

const isMobileDevice = () => {
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(navigator.userAgent);
}

const selectionHelper = (currentId) => {
    document.querySelectorAll("macintosh-window").forEach((el) => {
        el.setAttribute("data-active", el.id === currentId ? "true" : "false");
    });
};

// keep existing global exposure in case other code calls it
window.selectionHelper = selectionHelper;

const openWindowForFolder = (folderElement, windowElement) => {
    if (windowElement?.getAttribute("aria-hidden") === "false") return;
    folderElement?.blur();
    folderElement?.setAttribute("aria-selected", "true");

    document.body.classList.add('is-loading');
    document.body.style = "cursor: url('/classic/assets/loadingwatch.png') 16 16, auto;";
    // Play hard drive wav file!
    setTimeout(() => {
        windowElement?.setAttribute("aria-hidden", "false");
        selectionHelper(windowElement?.id);
        document.body.classList.remove('is-loading');
        document.body.style = '';
    }, 3500);

};

const handleDoubleTap = (event, callback) => {
    const now = Date.now();
    const tapLength = now - lastTap;

    if (tapLength < DOUBLE_TAP_DELAY && tapLength > 0) {
        callback();
        event.preventDefault();
    }
    lastTap = now;
};

const applyWindowDefaultsForOrientation = (el) => {
    if (!el) return;
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;

    if (isMobileDevice()) {
        el.setAttribute("x", String(100));
        el.setAttribute("y", String(isLandscape ? 0 : 100));
        el.setAttribute("width", String(400));
    }
};

// Fake boot progress for a nostalgic startup feel
function fakeLoad() {
    let value = 0;
    (function step() {
        if (value >= 100) return;
        const increment = Math.floor(Math.random() * 5) + 1; // 1–5
        value = Math.min(100, value + increment);
        progress.set(value);
        const delay = Math.random() * 100 + 100; // 100–200ms (comment said 100–400; original calc was 100–200)
        setTimeout(step, delay);
    })();
}

// ──────────────────────────────────────────────────────────────
// Initialization
// ──────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

    // optional: preload for smoother start
    fakeLoad();

    // Initial window layout defaults
    macWindows.forEach(applyWindowDefaultsForOrientation);

    // Hide main window at boot; allow startup sequence to reveal content
    mainWindow?.setAttribute("aria-hidden", "true");
});

// ──────────────────────────────────────────────────────────────
// Event Listeners
// ──────────────────────────────────────────────────────────────
// Window chrome (close/expand) for each window, plus click-to-focus
macWindows.forEach((win) => {
    if (!win) return;

    win.addEventListener("macintosh:window-close-button", () => {
        win.setAttribute("aria-hidden", "true");
        win.setAttribute("data-active", "false");
        console.log('aaaaah')
        playBip();
    });

    win.addEventListener("macintosh:window-expand-button", () => {
        win.setAttribute("width", String(600));
        win.setAttribute("height", String(600));
    });
});

// Click to focus/activate any macintosh-window
document.querySelectorAll("macintosh-window").forEach((el) => {
    el.addEventListener("macintosh:window-click", (e) => {
        const currentId = e.currentTarget.id;
        debugger;
        console.log('setting data active to true')
        selectionHelper(currentId);
        document.getElementById(currentId)?.setAttribute("data-active", "true");

    });
});

// Folder interactions (double-click + double-tap)
macFolders.forEach(({ thisEl, windowEl }) => {
    thisEl?.addEventListener("dblclick", () => openWindowForFolder(thisEl, windowEl));
    thisEl?.addEventListener("touchend", (event) =>
        handleDoubleTap(event, () => openWindowForFolder(thisEl, windowEl))
    );

    const position = { x: 0, y: 0 }

    // interact(thisEl)?.draggable({
    //     // allowFrom: allowFromEl ?? undefined,
    //     modifiers: [
    //         interact.modifiers.restrictRect({
    //             restriction: '.mainWindow', // light-DOM restriction container
    //         }),
    //     ],
    //     listeners: {
    //         move: (event) => {
    //             position.x += event.dx
    //             position.y += event.dy

    //             event.target.style.transform =
    //                 `translate(${position.x}px, ${position.y}px)`
    //         },
    //     },
    // });

});

// Dialog buttons
document.querySelector("#cancelbtn")?.addEventListener("click", () => {
    dialogBox?.setAttribute("aria-hidden", "true");
});

// App icon double-clicks
klickyTrackerIconEl?.addEventListener("dblclick", () => {
    dialogBox?.setAttribute("aria-hidden", "false");
    playBip();
});

fhAppEl?.addEventListener("dblclick", () => {
    window.open("https://apps.apple.com/us/app/fish-harmony/id1309770017", "_blank");
});

// Store buttons (Android / iOS)
document.querySelector("#androidbtn")?.addEventListener("click", () => {
    window.open(
        "https://play.google.com/store/apps/details?id=com.klickytracker",
        "_blank"
    );
});

document.querySelector("#iosbtn")?.addEventListener("click", () => {
    window.open(
        "https://apps.apple.com/sg/app/klickytracker/id1660636101",
        "_blank"
    );
});

// ──────────────────────────────────────────────────────────────
// Store Subscriptions
// ──────────────────────────────────────────────────────────────
setTimeout(() => {
    // keep original timing behavior/note
    isStartingUp.set(false);
}, 5000); // TODO: ON LAUNCH CHANGE TO 6000

isPatricksMacOpen.subscribe(() => {
    if (isPatricksMacOpen.value === true) {
        document.getElementById("draggable-macintoshhdwindow")
            ?.setAttribute("aria-hidden", "false");
    }
});

progress.subscribe(() => {
    const progressBar = document.getElementById("startuploader");
    progressBar?.setAttribute("value", String(progress.value));
    if (progressBar?.getAttribute("value") === String(100)) {
        isStartingUp.set(false);
    }
});

isStartingUp.subscribe(() => {
    const isUp = isStartingUp.value === false;
    document.getElementById("mainContent")?.setAttribute("aria-hidden", String(!isUp));
    document.getElementById("startupContent")?.setAttribute("aria-hidden", String(isUp));
});
