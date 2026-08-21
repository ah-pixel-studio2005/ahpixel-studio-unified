import { lazy, Suspense, useEffect, useState } from "react";
import "../ahpixel/styles.css";

import AHPixelApp from "../ahpixel/AHPixelApp";
const VantaRoute = lazy(() => import("../demos/vanta/VantaRoute"));
const LumenRoute = lazy(() => import("../demos/lumen/LumenRoute"));

function currentPath() {
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

export function AppRouter() {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    const onPopState = () => setPath(currentPath());
    const onInternalNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const origin = event.target;
      if (!(origin instanceof Element)) return;
      const anchor = origin.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      const rawHref = anchor.getAttribute("href");
      if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;
      event.preventDefault();
      window.history.pushState(null, "", `${destination.pathname}${destination.search}${destination.hash}`);
      setPath(currentPath());
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onInternalNavigation);
    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onInternalNavigation);
    };
  }, []);

  const content = path.startsWith("/demos/vanta")
    ? <VantaRoute path={path} />
    : path.startsWith("/demos/lumen")
      ? <LumenRoute path={path} />
      : <AHPixelApp path={path} />;

  return <Suspense fallback={<div className="route-loader" role="status" aria-label="Loading"><i /><span>AHPixel Studio</span><small>Loading experience</small></div>}>{content}</Suspense>;
}
