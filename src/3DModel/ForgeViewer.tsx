import { forwardRef, useEffect, useRef } from 'react';
import { subscribeEvents } from './utils';
import { PropertyPanelExtend } from 'src/extensions/PropertyPanelExtend/PropertyPanelExtend';
interface ForgeViewerProps {
  token: string;
  urn: string;
  selectedIds?: number[];
  // Callback for when the viewer camera changes.
  onCameraChange?: ({ viewer, camera }: { viewer: any; camera: any }) => void;
  // Callback for when the viewer selection changes.
  onSelectionChange?: ({ viewer, selection }: { viewer: any; selection: number[] }) => void;
}

const ForgeViewer = (props: ForgeViewerProps, ref: any) => {
  const {
    token,
    urn,
    selectedIds = [],
    // event handlers
    onCameraChange,
    onSelectionChange,
  } = props;
  const forgeViewerRef = useRef<HTMLDivElement>(null);
  const { Autodesk } = window;

  const viewer = useRef<any>(null);
  // init
  useEffect(() => {
    if (!Autodesk || !token || !urn || !forgeViewerRef.current) return null;
    let unSubscribe: () => void;
    const options = {
      env: 'AutodeskProduction2',
      api: 'streamingV2',
      language: 'en',
      getAccessToken: (onTokenReady: (token: string, expires: number) => void) => {
        const timeInSeconds = 3600;
        onTokenReady(token, timeInSeconds);
      },
      openPropertiesOnSelect: true,
    };

    Autodesk.Viewing.Initializer(options, () => {
      const viewerDiv = forgeViewerRef.current as HTMLDivElement;
      viewer.current = new Autodesk.Viewing.GuiViewer3D(viewerDiv);
      unSubscribe = subscribeEvents(viewer.current, {
        // [Autodesk.Viewing.CAMERA_CHANGE_EVENT]: onViewerCameraChange,
        [Autodesk.Viewing.SELECTION_CHANGED_EVENT]: onViewerSelectionChange,
        [Autodesk.Viewing.SETTINGS_PANEL_CREATED_EVENT]: onSettingsPanelCreated,
      });
      const startedCode = viewer.current.start();

      if (startedCode > 0) {
        console.error('Failed to create a Viewer: WebGL not supported.');
        return;
      }

      Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
      viewer.current.setTheme('light-theme');
      viewer.current.setPropertiesOnSelect(true);


    });

    const onDocumentLoadSuccess = (viewerDocument: any) => {
      console.log('viewerDocument: ', viewerDocument);
      const defaultModel = viewerDocument.getRoot().getDefaultGeometry();
      viewer.current.loadDocumentNode(viewerDocument, defaultModel);
    };

    const onDocumentLoadFailure = () => {
      console.error('Failed fetching Forge manifest');
    };

    return () => {
      unSubscribe?.();
      viewer.current.finish();
      viewer.current = null;
      Autodesk.Viewing.shutdown();
    };
  }, [token, urn, Autodesk]);

  // updateViewerState
  useEffect(() => {
    if (!viewer.current) return;
    const selectedIds = viewer.current.getSelection();
    if (JSON.stringify(props.selectedIds || []) !== JSON.stringify(selectedIds)) {
      viewer.current.select(props.selectedIds);
    }
  }, [selectedIds, viewer.current]);

  // events
  const onViewerCameraChange = () => {
    if (onCameraChange) {
      onCameraChange({ viewer: viewer.current, camera: viewer.current.getCamera() });
    }
  };

  const onViewerSelectionChange = () => {
    if (onSelectionChange) {
      onSelectionChange({ viewer: viewer.current, selection: viewer.current.getSelection() });
    }
  };

  const onSettingsPanelCreated = () => {
    
    setTimeout(() => {
      const propertyPanelExtend = new PropertyPanelExtend(viewer.current)
      propertyPanelExtend.load()
      propertyPanelExtend.onToolbarCreated()
    }, 500);
  };

  return <div ref={forgeViewerRef}></div>;
};

export default forwardRef(ForgeViewer);

// export default ForgeViewer;
