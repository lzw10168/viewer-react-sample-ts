import React, { useState, useRef } from 'react';
import Viewer from './Viewer';
import './App.css';
import './custom.scss';

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

    const onSelectionChange = (selectionInfo: { viewer: any; ids: number[] }) => {
        setSelectedIds(selectionInfo.ids);
    };

    return (
        <div className="app">
            <div style={{ position: 'relative', width: '1400px', height: '600px' }}>
                <Viewer
                    ref={wrapper}
                    runtime={{ accessToken: token, language: 'en', document: '/Fox/glTF/Fox.gltf', env: 'Local' }}
                    selectedIds={selectedIds}
                    onCameraChange={onCameraChange}
                    onSelectionChange={onSelectionChange}
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
