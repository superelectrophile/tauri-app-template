import { createFileRoute } from "@tanstack/react-router";
import { DateTime } from "luxon";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "../components/Button";
import BarGraph from "../components/BarGraph";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
});

function RouteComponent() {
  const [currentTime, setCurrentTime] = useState(DateTime.now());
  const [randomData, setRandomData] = useState<number[]>(
    Array.from({ length: 20 }, () => Math.random())
  );

  const graphData = useMemo(
    () => randomData.map((value, idx) => ({ x: idx, y: value })),
    [randomData]
  );

  const toValues = useCallback((data: { x: number; y: number }) => data, []);

  const tooltipContent = useCallback(
    (data: { x: number; y: number }) => <div>Data: {data.y.toFixed(2)}</div>,
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(DateTime.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-bold">Home</h1>
      <p className="text-sm color-hint">
        Current Time:{" "}
        <code className="text-text bg-bg-light p-1 rounded-md">
          {currentTime.toISO()}
          {/* Observe the slow drift of the time due to setInterval's inherent imprecision */}
        </code>
      </p>
      <div className="flex flex-row gap-4">
        <Button
          onClick={() => setRandomData((data) => data.map(() => Math.random()))}
        >
          Regenerate Random Data
        </Button>
        <Button
          onClick={() => setRandomData((data) => [...data, Math.random()])}
        >
          Add Random Data
        </Button>
        <Button onClick={() => setRandomData((data) => data.slice(0, -1))}>
          Remove Last Data
        </Button>
      </div>
      <div className="w-full h-48 rounded-md border border-hint p-2">
        <BarGraph
          data={graphData}
          toValues={toValues}
          tooltipContent={tooltipContent}
        />
      </div>
    </div>
  );
}
