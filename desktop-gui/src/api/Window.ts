import { getCurrentWindow, webFrame } from "./Electron";

type WindowState = "minimized" | "maximized" | "normal" | "fullScreened";

export default class Window {
    /**
     * The window's current state
     */
    private windowState: WindowState = "normal";
    
    /**
     * The current window
     */
    private window: any;

    /**
     * All event listeners
     */
    private events = {
        stateChange: [] as ((state: WindowState) => void)[]
    };

    /**
     * A class used to interact with the current BrowserWindow
     */
    public constructor() {
        this.window = getCurrentWindow();

        const handleWindowState = () => {
            if (this.window.isFullScreen()) {
                this.windowState = "fullScreened";
            } else if (this.window.isMaximized()) {
                this.windowState = "maximized";
            } else if (this.window.isMinimized()) {
                this.windowState = "minimized";
            } else {
                this.windowState = "normal";
            }

            this.events.stateChange.forEach(event => event(this.windowState));
        }

        handleWindowState();

        this.window.on("enter-full-screen", () => handleWindowState());
        this.window.on("leave-full-screen", () => handleWindowState());
        this.window.on("un" + "maximize", () => handleWindowState());
        this.window.on("maximize", () => handleWindowState());
        this.window.on("minimize", () => handleWindowState());
        this.window.on("restore", () => handleWindowState());
    }

    /**
     * Set the zoom factor
     * @param factor Zoom factor
     */
    public setZoom(factor: number) {
        webFrame.setZoomFactor(factor);
    }

    /**
     * Get the window's current state
     * @returns Window's current state
     */
    public getWindowState(): WindowState {
        return this.windowState;
    }

    /**
     * Set the state of the window
     * @param state The window's new state
     */
    public setWindowState(state: WindowState) {
        switch (state) {
            case "fullScreened":
                this.window.setFullScreen(true);
                break;

            case "maximized":
                this.window.maximize();
                break;

            case "minimized":
                this.window.minimize();
                break;

            case "normal":
                if (this.windowState == "fullScreened") {
                    this.window.setFullScreen(false);
                } else {
                    this.window.restore();
                }
                break;
        }
    }

    /**
     * Exit the current window
     */
    public exit() {
        this.window.close();
    }

    /**
     * Listen for window state change events
     * @param event Event name
     * @param listener Event callback
     * @param nullValue This param should not be used
     */
    public on(event: "stateChange", listener: (state: WindowState) => void, nullValue?: null): void;

    public on(event: any, listenerOrChannel: any, nullOrListener?: any) {
        (this.events as any)[event].push(listenerOrChannel);
    }
}
