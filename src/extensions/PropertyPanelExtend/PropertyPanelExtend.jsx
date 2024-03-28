/**
 * 扩展原有的属性面板, 插入LinkTask一些功能.
 */
import LinkedData from './LinkedData';
import ReactDOM from 'react-dom';

const { ISOLATE_EVENT,
    AGGREGATE_SELECTION_CHANGED_EVENT,
} = Autodesk.Viewing;
const avp = Autodesk.Viewing.Private;
const { Button } = Autodesk.Viewing.UI;

/**
 * PropertyPanelExtend Extension class.
 * @memberof Autodesk.Viewing.Extensions
 */
class PropertyPanelExtend extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this.viewer = viewer;
        this.options = options;
        this.linkTaskPanel = null;
        this._onSelectionChangeEvent = this._onSelectionChangeEvent.bind(this)
    }

    load() {
        this.viewer.addEventListener(AGGREGATE_SELECTION_CHANGED_EVENT, this._onSelectionChangeEvent);

        return true;
    }

    unload() {
        this.viewer.removeEventListener(AGGREGATE_SELECTION_CHANGED_EVENT, this._onSelectionChangeEvent);
        this.deactivate();
    }

    insertCustomComponent() {
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

    setPanel(panel) {
        if (panel === this._panel) {
            return false;
        }
        if (this._panel) {
            this._panel.setVisible(false);
            this.viewer.removePanel(this._panel);
            this._panel.uninitialize();
        }
        this._panel = panel;
        if (panel) {
            this.viewer.addPanel(panel);
            panel.addVisibilityListener(visible => {
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
        const divHtml = document.createElement("div")

        this.linkTaskPanel = divHtml
        linkTaskPanel.container.appendChild(divHtml)
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
        if (event.selections.length === 0) {
            return;
        }
        // return
        const aggregatedSelection = [{
            model: event.selections[0].model,
            selection: event.selections[0].dbIdArray
        }]

        // Assign the propertyNodeId, to keep the previous functionality as in requestNodeProperties
        if (aggregatedSelection.length === 1 && aggregatedSelection[0].selection?.length === 1) {
            this.propertyNodeId = aggregatedSelection[0].selection[0];
        }

        const promises = [];
        aggregatedSelection.forEach((entry) => {
            promises.push(entry.model.getPropertySetAsync(entry.selection, { fileType: entry.model.getData()?.loadOptions?.fileExt, needsExternalId: entry.model.getData()?.loadOptions?.needsExternalId }));
        });
        const items = [];
        Promise.all(promises).then((propSets) => {
            const propSet = propSets[0];
            for (let i = 1; i < propSets.length; i++) {
                propSet.merge(propSets[i]);
            }
            propSet.forEach((key, props) => {
                items.push({
                    name: props[0].displayName,
                    value: props[0].displayValue
                })
            })
            ReactDOM.render(<LinkedData items={items} />, this.linkTaskPanel);
        })
        if (!this.viewer.prefs.get('openPropertiesOnSelect')) {
            return;
        }
        let hasSelection = false;
        for (let i = 0; i < event.selections.length; ++i) {
            if (event.selections[i].dbIdArray.length > 0) {
                hasSelection = true;
                break;
            }
        }
        if (hasSelection) {
            this.activate();
        } else {
            this.deactivate();
        }
    }
}

export { PropertyPanelExtend };
