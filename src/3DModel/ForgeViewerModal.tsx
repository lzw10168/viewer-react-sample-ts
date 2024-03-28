// import { useVisible } from '@/hooks';
// import Modal from '@/ops-shared/componentsUI/Modal/Modal';
// import { border } from '@/ops-shared/ui-spec/color';
// import { Box } from '@mui/material';
// import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
// import ForgeViewer from './ForgeViewer';
// import { getAutodeskAccessToken, isWebGLSupported, useAutodeskViewerAssets } from './utils';

// interface ForgeViewerProps {
//   token: string;
//   urn: string;
// }

// const ForgeViewerModal = (props: any, ref: any) => {
//   const { visible, open, close } = useVisible();
//   const [token, setToken] = useState('');
//   const [urn, setUrn] = useState('');
//   const [selectedIds, setSelectedIds] = useState<any[]>([]);
//   // load (js css) assets of the viewer
//   useAutodeskViewerAssets();

//   const onCameraChange = ({ viewer, camera }: { viewer: any; camera: any }) => {
//     console.log('onCameraChange: ', camera);
//   };
//   const onSelectionChange = ({ viewer, selection }: { viewer: any; selection: string[] }) => {
//     console.log('onSelectionChange: ', selection);
//     setSelectedIds(selection);
//   };
//   const subscribe = async (payload: ForgeViewerProps) => {
//     const res = getAutodeskAccessToken() as Promise<string> | string;
//     if (typeof res.then === 'function') {
//       res.then((accessToken) => {
//         setToken(accessToken);
//       });
//     } else {
//       setToken(res);
//     }
//     const { urn } = payload;
//     // setToken(token);
//     setUrn(urn);
//     open();
//   };

//   useImperativeHandle(
//     ref,
//     () => {
//       return {
//         subscribe,
//       };
//     },
//     [subscribe],
//   );

//   const onOk = async () => {
//     close();
//   };
//   const onCancel = () => {
//     setToken('');
//     setUrn('');
//     close();
//   };
//   return (
//     <Modal
//       fullScreen
//       footer={null}
//       transitionDirection="up"
//       destroyOnClose
//       maskClosable={false}
//       visible={visible}
//       showBottomLine={false}
//       style={{
//         top: 70,
//         boxShadow: '0px -12px 38px 0px rgba(0, 0, 0, 0.45)',
//         display: 'flex !important',
//         height: 'calc(100% - 70px)',
//         minHeight: 'auto',
//         overflow: 'hidden',
//       }}
//       bodyStyle={{ borderTop: `1px solid ${border}`, padding: '4px 8px' }}
//       closeIconStyle={{ zIndex: 1300 }}
//       onOk={onOk}
//       onCancel={onCancel}
//     >
//       {isWebGLSupported() ? (
//         <ForgeViewer
//           token={token}
//           urn={urn}
//           onSelectionChange={onSelectionChange}
//           onCameraChange={onCameraChange}
//           selectedIds={selectedIds}
//         />
//       ) : (
//         <Box
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             width: '100%',
//             height: '100%',
//           }}
//         >
//           <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
//             Your browser does not support WebGL. Please try again later or use a different browser.
//           </Box>
//         </Box>
//       )}
//     </Modal>
//   );
// };

// export default forwardRef(ForgeViewerModal);

// // export default ForgeViewer;
export default {}
