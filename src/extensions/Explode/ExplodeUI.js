
// import {
//     logger
// } from "../../src/logger/Logger";

const { isIOSDevice, isAndroidDevice, stringToDOM, EXPLODE_CHANGE_EVENT } = Autodesk.Viewing
const { Button } = Autodesk.Viewing.UI
export class ExplodeUI {
    /**
     * Create toolbar button, explode slider and all other UI.
     *
     * @param ext
     */
    constructor(ext) {
        this.ext = ext;
        const viewer = ext.viewer;

        const explodeButton = new Button('toolbar-explodeTool-1');
        explodeButton.setIcon("adsk-icon-explode");
        explodeButton.setToolTip("Explode model-1");
        viewer.modelTools.addControl(explodeButton);

        const htmlString = '<div class="docking-panel docking-panel-container-solid-color-b explode-submenu"><input class="explode-slider" type="range" min="0" max="1" step="0.01" value="0"/></div>';

        let explodeSubmenu = stringToDOM(htmlString);

        // range input not draggable on touch devices when nested under button
        const parentDom = (viewer.getToolbar().container.querySelector('#toolbar-explodeTool-1')).parentNode;
        if (isIOSDevice()) {
            explodeSubmenu.classList.add("ios");
        } else if (isAndroidDevice()) {
            explodeSubmenu.classList.add("android");
        }
        parentDom.appendChild(explodeSubmenu);
        explodeButton.addEventListener(Autodesk.Viewing.UI.Control.Event.VISIBILITY_CHANGED, function(event) {
            if (event.isVisible) {
                explodeSubmenu.classList.add('visible');
            } else {
                explodeSubmenu.classList.remove('visible');
            }
        });

        const slider = explodeSubmenu.querySelector(".explode-slider");
        slider.addEventListener("input", function() {
            ext.setScale(slider.value);
        });

        explodeSubmenu.onclick = function(event) {
            event.stopPropagation();
        };

        // hack to disable tooltip
        var tooltip = explodeButton.container.querySelector(".adsk-control-tooltip");

        explodeButton.onClick = function() {

            if (ext.isActive()) {
                ext.deactivate();
            } else {
                ext.activate();

                // Track tool change only when interacted by the end user.
                // logger.track({
                //     category: 'tool_changed',
                //     name: 'explode'
                // });
            }
        };

        // Keep references
        this._slider = slider;
        this._explodeButton = explodeButton;
        this._explodeSubmenu = explodeSubmenu;
        this._tooltip = tooltip;

        // backwards compatibility references
        viewer.explodeSlider = slider;
        viewer.explodeSubmenu = explodeSubmenu;

        this._onExplode = this._onExplode.bind(this);
    }

    activate() {
        this._explodeSubmenu.classList.add('visible');
        this._explodeButton.setState(Button.State.ACTIVE);
        this._tooltip.style.display = "none";

        // Sync slider with viewer's explode value
        let lmvExplodeValue = this.ext.getScale();
        this._slider.value = lmvExplodeValue;

        // Update UI only when the event is fired
        this.ext.viewer.addEventListener(EXPLODE_CHANGE_EVENT, this._onExplode);
    }

    deactivate() {
        this._explodeButton.setState(Button.State.INACTIVE);
        this._hideSlider(this);

        // Update UI only when the event is fired
        this.ext.viewer.removeEventListener(EXPLODE_CHANGE_EVENT, this._onExplode);
    }

    destroy() {
        const viewer = this.ext.viewer;

        // early bail out if the UI hasn't actually been initialized.
        if (!this._slider) {
            return;
        }

        if (this._explodeButton) {
            this._explodeButton.removeFromParent();
        }

        // Reset references
        this._slider = null;
        this._explodeButton = null;
        this._explodeSubmenu = null;
        this._tooltip = null;

        // Reset backwards compatibility references
        viewer.explodeSlider = null;
        viewer.explodeSubmenu = null;
    }

    setUIEnabled(enable) {
        if (this._explodeButton) {
            if (enable) {
                // Re-enable button
                this._explodeButton.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);

                if (this._wasActive) {
                    this.ext.activate();
                }
            } else {
                this._wasActive = this.ext.isActive();

                // We don't just use deactivate() because you want to keep the explode scale.
                this._hideSlider(this);

                // Disable button
                this._explodeButton.setState(Autodesk.Viewing.UI.Button.State.DISABLED);
            }
        }
    }

    _hideSlider() {
        this._explodeSubmenu.classList.remove('visible');
        this._tooltip.style.display = "";
    }

    /**
     * @param event
     * @private
     */
    _onExplode(event) {
        this._slider.value = event.scale;
    }
}
