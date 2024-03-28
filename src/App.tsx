import React, { useState, useRef } from 'react';
import Viewer from './Viewer';
import './App.css';
import './custom.scss';
import ForgeViewer from './3DModel/ForgeViewer';

interface AppProps {
    token: string;
    urn: string;
}

function App(props: AppProps) {
    const { token, urn } = props;
    const [camera, setCamera] = useState<[number, number, number] | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const wrapper = useRef<HTMLDivElement>(null);

    const onInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const val = ev.target.value.trim();
        const ids = val.split(',').filter(e => e.length > 0).map(e => parseInt(e)).filter(e => Number.isInteger(e));
        setSelectedIds(ids);
    };

    const onCameraChange = (cameraInfo: { viewer: any; camera: any }) => {
        const position = cameraInfo.camera.getWorldPosition();
        setCamera([position.x, position.y, position.z]);
    };

    const onSelectionChange = ({ viewer, selection }: { viewer: any; selection: number[] }) => {
        setSelectedIds(selection);
    };

    return (
        <div className="app">
            <div style={{ position: 'relative', width: '1400px', height: '700px' }}>
                {/* <Viewer
                    ref={wrapper}
                    runtime={{ accessToken: token, language: 'en', document: '/Fox/glTF/Fox.gltf', env: 'Local' }}
                    selectedIds={selectedIds}
                    onCameraChange={onCameraChange}
                    onSelectionChange={onSelectionChange}
                /> */}
                <ForgeViewer
                    token={token}
                    urn={urn}
                    onSelectionChange={onSelectionChange}
                    onCameraChange={onCameraChange}
                    selectedIds={selectedIds}
                    />
            </div>
            <div>
                Camera Position: {camera && `${camera[0].toFixed(2)} ${camera[1].toFixed(2)} ${camera[2].toFixed(2)}`}
            </div>
            <div>
                Selected IDs: <input type="text" value={selectedIds.join(',')} onChange={onInputChange} />
            </div>
            {/* <button onClick={() => wrapper.current?.viewer.autocam.goHome()}>Reset View</button> */}
        </div>
    );
};

export default App;
