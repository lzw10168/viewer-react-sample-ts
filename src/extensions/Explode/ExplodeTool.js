
const GlobalManagerMixin = Autodesk.Viewing.GlobalManagerMixin;

export class ExplodeTool extends Autodesk.Viewing.ToolInterface {
    constructor(viewer) {
        super();

        this.names = ['explode1'];
        this.viewer = viewer;
        this.setGlobalManager(this.viewer.globalManager);
        this.active = false;

        this.activate = () => {
            this.active = true;
        };

        this.deactivate = (reset = true) => {
            if (reset)
                this.setScale(0);
            this.active = false;
        };

        this.isActive = () => {
            return this.active;
        };
    }

    setScale(value) {
        let scale = value;
        let options = this.viewer.getExplodeOptions();
        return this.viewer.explode(scale, options);
    }

    getScale() {
        return this.viewer.getExplodeScale();
    }

    setMagnitude(value) {
        let scale = this.viewer.getExplodeScale();
        let options = this.viewer.getExplodeOptions();
        options.magnitude = value;
        return this.viewer.explode(scale, options);
    }

    getMagnitude() {
        return this.viewer.getExplodeOptions().magnitude;
    }

    setDepthDampening(value) {
        let scale = this.viewer.getExplodeScale();
        let options = this.viewer.getExplodeOptions();
        options.depthDampening = value;
        return this.viewer.explode(scale, options);
    }

    getDepthDampening() {
        return this.viewer.getExplodeOptions().depthDampening;
    }
}

GlobalManagerMixin.call(ExplodeTool.prototype);
