import React, { forwardRef, useEffect, useRef } from 'react';
import { ExplodeExtension } from './extensions/Explode/Explode';
import { LinkTicketExtension } from './extensions/LinkTicketExtension/LinkTicketExtension';
import { PropertyPanelExtend } from './extensions/PropertyPanelExtend/PropertyPanelExtend';

declare global {
    interface Window {
        Autodesk: typeof Autodesk;
    }
}

interface ViewerProps {
    runtime?: Autodesk.Viewing.InitializerOptions;
    urn?: string;
    selectedIds?: number[];
    onCameraChange?: (data: { viewer: Autodesk.Viewing.GuiViewer3D; camera: any }) => void;
    onSelectionChange?: (data: { viewer: Autodesk.Viewing.GuiViewer3D; ids: number[] }) => void;
}

const runtime = {
    options: null as Autodesk.Viewing.InitializerOptions,
    ready: null as Promise<void>,
};

function initializeViewerRuntime(options: Autodesk.Viewing.InitializerOptions): Promise<void> {
    if (!runtime.ready) {
        runtime.options = { ...options };
        runtime.ready = new Promise((resolve) => Autodesk.Viewing.Initializer(runtime.options, resolve));
    } else {
        if (['accessToken', 'getAccessToken', 'env', 'api', 'language'].some((prop) => options[prop] !== runtime.options[prop])) {
            return Promise.reject('Cannot initialize another viewer runtime with different settings.');
        }
    }
    return runtime.ready;
}

function Viewer(props: ViewerProps, ref: any): JSX.Element {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<any>(null);

    // useImperativeHandle(
    //   first,
    //   () => {
    //     second
    //   },
    //   [third],
    // )

    useEffect(() => {
        initializeViewerRuntime(props.runtime || {})
            .then(() => {
                viewerRef.current = new Autodesk.Viewing.GuiViewer3D(containerRef.current);
                viewerRef.current.loadExtension('Autodesk.VisualClusters', { attribName: 'Material', searchAncestors: true });

                viewerRef.current.start('shaver/0.svf', {
                    env: 'Local',
                    document: 'shaver/0.svf',
                    language: 'en',
                });
                viewerRef.current.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, onViewerCameraChange);
                viewerRef.current.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, onViewerSelectionChange);
                

                viewerRef.current.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated);
                // Autodesk.Viewing.theExtensionManager.registerExtension('Autodesk.Explode1', ExplodeExtension);

                viewerRef.current.setTheme('light-theme');
            })
            .catch((err) => console.error(err));

        return () => {
            if (viewerRef.current) {
                viewerRef.current.removeEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, onViewerCameraChange);
                viewerRef.current.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, onViewerSelectionChange);
                viewerRef.current.removeEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated);
                viewerRef.current.finish();
                viewerRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (viewerRef.current) {
            updateViewerState();
        }
    }, [props.urn]);

    function updateViewerState() {
        if (props.urn) {
            Autodesk.Viewing.Document.load(
                'urn:' + props.urn,
                (doc) => viewerRef.current.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry()),
                (code, message, errors) => console.error(code, message, errors)
            );
        } else if (viewerRef.current.model) {
            viewerRef.current.unloadModel(viewerRef.current.model);
        }

        
    }

    useEffect(() => {
        if (viewerRef.current) {
           const selectedIds = viewerRef.current.getSelection();
        if (JSON.stringify(props.selectedIds || []) !== JSON.stringify(selectedIds)) {
            viewerRef.current.select(props.selectedIds);
        }
        }
    }, [props.selectedIds])
    

    function onViewerCameraChange() {
        if (props.onCameraChange) {
            props.onCameraChange({ viewer: viewerRef.current, camera: viewerRef.current.getCamera() });
        }
    }

    function onViewerSelectionChange() {
        if (props.onSelectionChange) {
            const ids = viewerRef.current.getSelection()

            props.onSelectionChange({ viewer: viewerRef.current, ids });
        }
    }
    
    function onToolbarCreated() {
       setTimeout(() => {
        // const explodeExtension =  new ExplodeExtension(viewerRef.current, { explodeScale: 2 })
        // explodeExtension.load()
        // explodeExtension.onToolbarCreated(viewerRef.current.toolbar)

        const linkTaskExtension = new LinkTicketExtension(viewerRef.current)
        linkTaskExtension.load()
        linkTaskExtension.onToolbarCreated()


        const propertyPanelExtend = new PropertyPanelExtend(viewerRef.current)
        propertyPanelExtend.load()
       }, 100);


    };

    return <div ref={containerRef}></div>;
}

// Viewer.propTypes = {
//     runtime: PropTypes.object,
//     urn: PropTypes.string,
//     selectedIds: PropTypes.arrayOf(PropTypes.number),
//     onCameraChange: PropTypes.func,
//     onSelectionChange: PropTypes.func,
// };

export default forwardRef(Viewer);
