import { lazy, Suspense, useEffect, useState } from "react";
import "../ahpixel/styles.css";

const AHPixelApp = lazy(() => import("../ahpixel/AHPixelApp"));
const VantaRoute = lazy(() => import("../demos/vanta/VantaRoute"));
const LumenRoute = lazy(() => import("../demos/lumen/LumenRoute"));

function currentPath() {
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

export function AppRouter() {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    const onPopState = () => setPath(currentPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const content = path.startsWith("/demos/vanta")
    ? <VantaRoute path={path} />
    : path.startsWith("/demos/lumen")
      ? <LumenRoute path={path} />
      : <AHPixelApp path={path} />;

  return <Suspense fallback={<div className="route-loader" aria-label="Loading"><i /><span>AHPixel Studio</span></div>}>{content}</Suspense>;
}
