import { useRef, useState, useEffect } from "react";
import { DESIGN_CONSTANTS } from "../constants";
export default function useResizeObserver(
  debounceTimeMs: number = DESIGN_CONSTANTS.DURATION.DEFAULT_DEBOUNCE_TIME_MS
) {
  const ref = useRef(null);

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const [outputDimensions, setOutputDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setDimensions({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height,
        });
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    timeout = setTimeout(() => {
      setOutputDimensions(dimensions);
    }, debounceTimeMs);

    return () => {
      clearTimeout(timeout);
    };
  }, [dimensions, debounceTimeMs]);

  return { ref, dimensions: outputDimensions };
}
