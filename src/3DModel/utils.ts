import { useEffect } from 'react';
// import { getApiDrawingBimModelTokenObtain } from '@/services/plusDrawing/bimModelController';

// Record the time when the token was last obtained. It needs to be obtained again after 30 minutes.
// There is no need to obtain it again in the middle.
let lastFetchTime = 0;
let accessToken = '';

// Our own services should be used here
function fetchAccessToken() {
  // return getApiDrawingBimModelTokenObtain().then((res) => {
  //   if (res.code !== 0) {
  //     return '';
  //   }
  //   accessToken = res.data as string;
  //   lastFetchTime = Date.now();
  //   return accessToken;
  // });
}

export function getAutodeskAccessToken() {
  const now = Date.now();
  if (now - lastFetchTime > 30 * 60 * 1000 || !accessToken) {
    return fetchAccessToken();
  }
  return accessToken;
}

export function isWebGLSupported() {
  const canvas = document.createElement('canvas');

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (gl && gl instanceof WebGLRenderingContext) {
    return true;
  }

  return false;
}

// Load the css and js of Autodesk Viewer, load on demand
export function useAutodeskViewerAssets() {
  useEffect(() => {
    const autodeskCss = document.createElement('link');
    autodeskCss.rel = 'stylesheet';
    autodeskCss.id = 'autodeskCss';
    autodeskCss.href =
      'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css';
    autodeskCss.type = 'text/css';

    const autodeskJs = document.createElement('script');
    autodeskJs.id = 'autodeskJs';
    autodeskJs.src =
      'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js';

    if (!document.getElementById('autodeskCss')) {
      document.head.appendChild(autodeskCss);
    }
    if (!document.getElementById('autodeskJs')) {
      document.body.appendChild(autodeskJs);
    }
  }, []);
}

// Subscribe to viewer events and return a function to cancel the subscription
type GuiViewer3DType = typeof Autodesk.Viewing.GuiViewer3D.prototype;
export function subscribeEvents(
  viewer: GuiViewer3DType,
  eventMap: { [eventName: string]: (event: any) => void },
) {
  for (const eventName in eventMap) {
    viewer.addEventListener(eventName, eventMap[eventName]);
  }

  return () => {
    for (const eventName in eventMap) {
      viewer.removeEventListener(eventName, eventMap[eventName]);
    }
  };
}
