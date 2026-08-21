import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import "../ahpixel/styles.css";
import "../ahpixel/header-behavior.css";

import AHPixelApp from "../ahpixel/AHPixelApp";
const VantaRoute = lazy(() => import("../demos/vanta/VantaRoute"));
const LumenRoute = lazy(() => import("../demos/lumen/LumenRoute"));

function currentPath() {
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

type TransitionPhase = "cover" | "reveal";
type RouteTransition = {
  phase: TransitionPhase;
  label: string;
  number: string;
};

const routeMeta: Record<string, { en: string; es: string; number: string }> = {
  "/": { en: "Home", es: "Inicio", number: "01" },
  "/work": { en: "Work", es: "Proyectos", number: "02" },
  "/services": { en: "Services", es: "Servicios", number: "03" },
  "/about": { en: "Studio", es: "Estudio", number: "04" },
  "/contact": { en: "Contact", es: "Contacto", number: "05" },
  "/work/vanta-barber-club": { en: "Vanta", es: "Vanta", number: "02.1" },
  "/work/lumen-dental-studio": { en: "Lumen", es: "Lumen", number: "02.2" },
};

function transitionMeta(path: string) {
  const spanish = path === "/es" || path.startsWith("/es/");
  const normalized = path.replace(/^\/es(?=\/|$)/, "") || "/";
  const meta = routeMeta[normalized] ?? { en: "AHPixel", es: "AHPixel", number: "00" };
  return { label: spanish ? meta.es : meta.en, number: meta.number };
}

export function AppRouter() {
  const [path, setPath] = useState(currentPath);
  const [transition, setTransition] = useState<RouteTransition | null>(null);
  const transitionTimer = useRef<number | null>(null);
  const revealTimer = useRef<number | null>(null);
  const transitionActive = useRef(false);

  const clearTransitionTimers = useCallback(() => {
    if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
    if (revealTimer.current !== null) window.clearTimeout(revealTimer.current);
    transitionTimer.current = null;
    revealTimer.current = null;
  }, []);

  const navigate = useCallback((destination: URL, updateHistory: boolean) => {
    const nextPath = destination.pathname.replace(/\/+$/, "") || "/";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const commit = () => {
      if (updateHistory) window.history.pushState(null, "", `${destination.pathname}${destination.search}${destination.hash}`);
      setPath(nextPath);
      window.scrollTo({ top: 0, behavior: "auto" });
    };

    if (reducedMotion) {
      commit();
      return;
    }

    if (transitionActive.current) {
      if (!updateHistory) {
        clearTransitionTimers();
        setTransition(null);
        document.body.classList.remove("route-changing");
        document.documentElement.classList.remove("route-content-entering");
        transitionActive.current = false;
        commit();
      }
      return;
    }
    transitionActive.current = true;
    clearTransitionTimers();
    document.body.classList.add("route-changing");
    setTransition({ phase: "cover", ...transitionMeta(nextPath) });

    transitionTimer.current = window.setTimeout(() => {
      commit();
      document.documentElement.classList.add("route-content-entering");
      setTransition(current => current ? { ...current, phase: "reveal" } : null);

      revealTimer.current = window.setTimeout(() => {
        setTransition(null);
        document.body.classList.remove("route-changing");
        document.documentElement.classList.remove("route-content-entering");
        transitionActive.current = false;
      }, 560);
    }, 330);
  }, [clearTransitionTimers]);

  useEffect(() => {
    const onPopState = () => navigate(new URL(window.location.href), false);
    const onRequestedNavigation = (event: Event) => {
      const requested = (event as CustomEvent<string>).detail;
      if (!requested) return;
      navigate(new URL(requested, window.location.href), true);
    };
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
      navigate(destination, true);
    };
    window.addEventListener("popstate", onPopState);
    window.addEventListener("ahpixel:navigate", onRequestedNavigation);
    document.addEventListener("click", onInternalNavigation);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("ahpixel:navigate", onRequestedNavigation);
      document.removeEventListener("click", onInternalNavigation);
    };
  }, [navigate]);

  useEffect(() => () => {
    clearTransitionTimers();
    document.body.classList.remove("route-changing");
    document.documentElement.classList.remove("route-content-entering");
  }, [clearTransitionTimers]);

  const content = path.startsWith("/demos/vanta")
    ? <VantaRoute path={path} />
    : path.startsWith("/demos/lumen")
      ? <LumenRoute path={path} />
      : <AHPixelApp path={path} />;

  return <>
    <Suspense fallback={<div className="route-loader" role="status" aria-label="Loading"><i /><span>AHPixel Studio</span><small>Loading experience</small></div>}>{content}</Suspense>
    <div className={`page-transition${transition ? ` is-active is-${transition.phase}` : ""}`} aria-hidden="true">
      <div className="page-transition-panel page-transition-panel-top" />
      <div className="page-transition-panel page-transition-panel-bottom" />
      <div className="page-transition-trace" />
      <div className="page-transition-readout">
        <span>{transition?.number ?? "00"}</span>
        <small>AHPixel / Navigation</small>
        <strong>{transition?.label ?? "AHPixel"}</strong>
      </div>
      <div className="page-transition-mark"><i /><b>AHP</b><i /></div>
    </div>
  </>;
}
