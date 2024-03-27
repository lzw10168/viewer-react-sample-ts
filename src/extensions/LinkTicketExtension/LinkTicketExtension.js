

const {ISOLATE_EVENT,
    AGGREGATE_SELECTION_CHANGED_EVENT,
} = Autodesk.Viewing;
const avp = Autodesk.Viewing.Private;
const {Button } = Autodesk.Viewing.UI;

/**
 * LinkTicketExtension Extension class.
 * @memberof Autodesk.Viewing.Extensions
 */
class LinkTicketExtension  extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this.viewer = viewer;
        this.options = options;
        this.name = "linkTicket";
        this._panel = null;
        this._toolbarButton = null;
        this._onSelectionChangeEvent = this._onSelectionChangeEvent.bind(this);
    }

    load() {
        this.viewer.addEventListener(AGGREGATE_SELECTION_CHANGED_EVENT, this._onSelectionChangeEvent);
        return true;
    }

    unload() {
        this.viewer.removeEventListener(AGGREGATE_SELECTION_CHANGED_EVENT, this._onSelectionChangeEvent);
        this.deactivate();
        this.setPanel(null);
        if (this._toolbarButton) {
            this.viewer.settingsTools.removeControl(this._toolbarButton);
            this.viewer.settingsTools.linkTicketButton = null;
            this._toolbarButton = null;
        }
    }

    onToolbarCreated() {
        this.setDefaultPanel();
        this._addToolbarButton();
    }

    activate() {
        if (this._panel) {
            this._panel.setVisible(true);
            return true;
        }
        return false;
    }

    deactivate() {
        if (this._panel) {
            this._panel.setVisible(false);
        }
        return true;
    }

    isActive() {
        if (this._panel) {
            return this._panel.isVisible();
        }
        return false;
    }

    setPanel(propertyPanel) {
        if (propertyPanel === this._panel) {
            return false;
        }
        if (this._panel) {
            this._panel.setVisible(false);
            this.viewer.removePanel(this._panel); 
            this._panel.uninitialize();
        }
        this._panel = propertyPanel;
        if (propertyPanel) {
            this.viewer.addPanel(propertyPanel);
            propertyPanel.addVisibilityListener(visible => {
                if (visible) {
                    this.viewer.onPanelVisible(this._panel);
                }
                this._toolbarButton.setState(visible ? Button.State.ACTIVE : Button.State.INACTIVE);
            });
        }
        return true;
    }

    setDefaultPanel() {
        const linkTaskPanel = new Autodesk.Viewing.UI.DockingPanel(this.viewer.container, 'linkTaskPanel', 'Link Task');
        linkTaskPanel.container.classList.add('link-task-panel');
        this.setPanel(linkTaskPanel);
    }

    getPanel() {
        return this._panel;
    }

    getToolbarButton() {
        return this._toolbarButton;
    }

    _addToolbarButton() {
        if (this._toolbarButton) {
            return;
        }
        const linkTicketButton = this._toolbarButton = new Button('toolbar-linkTicket');
        linkTicketButton.setToolTip('Link Ticket');
        linkTicketButton.setIcon("iconfont");
        linkTicketButton.icon.classList.add('icon-link');
        linkTicketButton.onClick = () => {
            this._panel.setVisible(!this._panel.isVisible());
        };
        this.viewer.settingsTools.addControl(linkTicketButton, {
            index: 3
        });
        this.viewer.settingsTools.linkTicketButton = linkTicketButton;
    }


    /**
     * 选择零件, 直接打开任务关联面板
     * @param {*} event 
     */
    _onSelectionChangeEvent(event) {
        // if (!this.viewer.prefs.get('openPropertiesOnSelect')) {
        //     return;
        // }
        // let hasSelection = false;
        // for (let i = 0; i < event.selections.length; ++i) {
        //     if (event.selections[i].dbIdArray.length > 0) {
        //         hasSelection = true;
        //         break;
        //     }
        // }
        // if (hasSelection) {
        //     this.activate();
        // } else {
        //     this.deactivate();
        // }
    }
}

export { LinkTicketExtension };
