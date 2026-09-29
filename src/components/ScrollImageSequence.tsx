import React, { useEffect, useRef, useCallback } from 'react';

interface Props {
  totalFrames?: number;
  containerRef: React.RefObject<HTMLDivElement>;
  onLoadingProgress?: (progress: number) => void;
  onReady?: () => void;
}

export const ScrollImageSequence: React.FC<Props> = ({
  totalFrames = 300,
  containerRef,
  onLoadingProgress,
  onReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cache = useRef<Map<number, HTMLImageElement>>(new Map());
  const loading = useRef<Set<number>>(new Set());
  const currentFrame = useRef(1);
  const targetFrame = useRef(1);
  const rafId = useRef<number | null>(null);
  const readyFired = useRef(false);
  const isMounted = useRef(true);
  const reducedMotion = useRef(false);

  /* ─── Frame path format ─── */
  const getFramePath = (n: number) => `/frames/frame_${String(n).padStart(4, '0')}.jpg`;

  /* ─── Draw a specific frame to canvas ─── */
  const draw = useCallback((frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /* Search for exact or nearest loaded frame */
    const targetN = Math.round(Math.max(1, Math.min(totalFrames, frameNum)));
    let img = cache.current.get(targetN);

    if (!img) {
      let minDistance = Infinity;
      let closestN = 1;
      cache.current.forEach((cachedImg, k) => {
        const dist = Math.abs(k - targetN);
        if (dist < minDistance && cachedImg.complete && cachedImg.naturalWidth > 0) {
          minDistance = dist;
          closestN = k;
        }
      });
      img = cache.current.get(closestN);
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    /* COVER mode math */
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }, [totalFrames]);

  /* ─── Single frame loader ─── */
  const loadFrame = useCallback((n: number): Promise<HTMLImageElement | null> => {
    if (n < 1 || n > totalFrames) return Promise.resolve(null);
    if (cache.current.has(n)) return Promise.resolve(cache.current.get(n)!);
    if (loading.current.has(n)) return Promise.resolve(null);

    loading.current.add(n);

    return new Promise(resolve => {
      const img = new Image();
      img.src = getFramePath(n);
      img.onload = () => {
        if (!isMounted.current) return resolve(null);
        cache.current.set(n, img);
        loading.current.delete(n);

        const loadedCount = cache.current.size;
        onLoadingProgress?.(loadedCount / totalFrames);

        /* Trigger ready state after frame 1 + 5 keyframes are available */
        if (!readyFired.current && cache.current.has(1) && loadedCount >= 6) {
          readyFired.current = true;
          onReady?.();
        }

        /* If this loaded frame is close to current active frame, render it */
        if (Math.abs(n - currentFrame.current) <= 2) {
          draw(currentFrame.current);
        }

        resolve(img);
      };
      img.onerror = () => {
        loading.current.delete(n);
        resolve(null);
      };
    });
  }, [totalFrames, onLoadingProgress, onReady, draw]);

  /* ─── Canvas Resize Handler ─── */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
      }
    }
    draw(currentFrame.current);
  }, [draw]);

  /* ─── Scroll Progress Handler ─── */
  const handleScroll = useCallback(() => {
    const section = containerRef.current;
    if (!section || reducedMotion.current) return;

    const rect = section.getBoundingClientRect();
    const scrollableDistance = section.offsetHeight - window.innerHeight;

    if (scrollableDistance <= 0) return;

    /* -rect.top is the distance scrolled into the sticky section */
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

    const target = 1 + progress * (totalFrames - 1);
    targetFrame.current = target;

    /* Prefetch frames around target position */
    const center = Math.round(target);
    for (let offset = -8; offset <= 8; offset++) {
      const f = center + offset;
      if (f >= 1 && f <= totalFrames && !cache.current.has(f) && !loading.current.has(f)) {
        loadFrame(f);
      }
    }
  }, [containerRef, totalFrames, loadFrame]);

  /* ─── Smooth Animation Loop ─── */
  const startAnimationLoop = useCallback(() => {
    const loop = () => {
      if (!isMounted.current) return;

      if (reducedMotion.current) {
        draw(1);
      } else {
        const delta = targetFrame.current - currentFrame.current;

        if (Math.abs(delta) > 0.005) {
          if (Math.abs(delta) < 0.05) {
            currentFrame.current = targetFrame.current;
          } else {
            /* Smooth lerp factor 0.22 */
            currentFrame.current += delta * 0.22;
          }
          draw(currentFrame.current);
        }
      }
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);
  }, [draw]);

  /* ─── Fast Concurrent Preload Strategy ─── */
  const startPreloadStrategy = useCallback(async () => {
    /* 1. Load frame 1 first and draw immediately */
    const firstImg = await loadFrame(1);
    if (firstImg) {
      draw(1);
    }

    /* 2. Load coarse keyframes (every 5th frame: 5, 10, 15... 300) with high concurrency */
    const keyframes: number[] = [];
    for (let i = 5; i <= totalFrames; i += 5) {
      keyframes.push(i);
    }

    const runQueue = async (items: number[], concurrency: number) => {
      let idx = 0;
      const worker = async () => {
        while (idx < items.length && isMounted.current) {
          const frameNum = items[idx++];
          if (frameNum && !cache.current.has(frameNum) && !loading.current.has(frameNum)) {
            await loadFrame(frameNum);
          }
        }
      };
      const pool = Array.from({ length: concurrency }, () => worker());
      await Promise.all(pool);
    };

    /* Load keyframes rapidly with 8 parallel requests */
    await runQueue(keyframes, 8);

    /* 3. Fill in all remaining frames with 6 parallel requests */
    const remainingFrames: number[] = [];
    for (let i = 2; i <= totalFrames; i++) {
      if (!cache.current.has(i)) {
        remainingFrames.push(i);
      }
    }

    await runQueue(remainingFrames, 6);
  }, [loadFrame, draw, totalFrames]);

  /* ─── Lifecycle & Event Listeners ─── */
  useEffect(() => {
    isMounted.current = true;
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    resizeCanvas();
    handleScroll();
    startAnimationLoop();
    startPreloadStrategy();

    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      isMounted.current = false;
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [resizeCanvas, handleScroll, startAnimationLoop, startPreloadStrategy]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  );
};
