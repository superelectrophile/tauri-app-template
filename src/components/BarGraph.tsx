import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import useResizeObserver from "../hooks/useResizeObserver";
import { DESIGN_CONSTANTS } from "../constants";
import { clsx } from "clsx";

export interface BarGraphProps<T> {
  data: T[];
  toValues: (datum: T) => { x: number; y: number };
  tooltipContent: (datum: T) => React.ReactNode;
  className?: string;
}

type ChartData<T> = { originalData: T; x: number; y: number };

const AXIS_MARGIN_LEFT = 28;

/**
 * Component displaying a chart of generic daily data using D3.js.
 *
 * @param data - the data to display
 * @param toValues - a function to get the x and y values from the data
 * @param tooltipContent - a function to render the tooltip content
 * @returns
 */
export default function AreaGraph<T>({
  data,
  toValues,
  tooltipContent,
  className,
}: BarGraphProps<T>) {
  const { ref: graphBodyRef, dimensions: graphBodyDimensions } =
    useResizeObserver();

  const xAxisContainerRef = useRef<SVGSVGElement>(null);
  const yAxisContainerRef = useRef<SVGSVGElement>(null);
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    datum: T;
  } | null>(null);

  // Calculate clamped tooltip position to keep it within bounds
  const tooltipStyle = useMemo(() => {
    if (!tooltip || !graphBodyDimensions) return {};

    const tooltipWidth = tooltipRef.current?.offsetWidth ?? 0;
    const tooltipHeight = tooltipRef.current?.offsetHeight ?? 0;
    const halfWidth = tooltipWidth / 2;

    // Clamp x so tooltip stays within container bounds
    const clampedX = Math.max(
      halfWidth,
      Math.min(tooltip.x, graphBodyDimensions.width - halfWidth)
    );

    // Clamp y so tooltip stays above the point but within bounds
    const clampedY = Math.max(tooltip.y - tooltipHeight - 8, 0);

    return {
      left: clampedX,
      top: clampedY,
      transform: "translateX(-50%)",
    };
  }, [tooltip, graphBodyDimensions]);

  const processedData = useMemo<
    { originalData: T; x: number; y: number }[]
  >(() => {
    return data.map((d) => ({ originalData: d, ...toValues(d) }));
  }, [data, toValues]);

  function renderXAxis(
    svg: SVGSVGElement,
    xScale: d3.ScaleLinear<number, number>
  ) {
    const axisContainer = d3.select(svg);
    const width = svg.clientWidth;
    const numTicks = Math.floor(
      width / DESIGN_CONSTANTS.DIMENSION.MIN_TICK_SEPARATOR_WIDTH_PX
    );
    let axisGroupSelection = axisContainer.select<SVGGElement>("g.x-axis");
    if (axisGroupSelection.empty()) {
      axisGroupSelection = axisContainer.append("g").attr("class", "x-axis");
    }
    axisGroupSelection
      .transition()
      .duration(DESIGN_CONSTANTS.DURATION.DEFAULT_TRANSITION)
      .call(d3.axisBottom(xScale).ticks(numTicks));

    axisGroupSelection
      .selectAll("text")
      .style("fill", "var(--color-text)")
      .style("font-size", "12px")
      .style("font-family", "var(--font-family)");
  }

  function renderYAxis(
    svg: SVGSVGElement,
    yScale: d3.ScaleLinear<number, number>
  ) {
    const axisContainer = d3.select(svg);
    const height = svg.clientHeight;
    const numTicks = Math.floor(
      height / DESIGN_CONSTANTS.DIMENSION.MIN_TICK_SEPARATOR_HEIGHT_PX
    );

    let axisGroupSelection = axisContainer.select<SVGGElement>("g.y-axis");
    if (axisGroupSelection.empty()) {
      axisGroupSelection = axisContainer.append("g").attr("class", "y-axis");
    }

    axisGroupSelection
      .attr("transform", `translate(${AXIS_MARGIN_LEFT},0)`)
      .transition()
      .duration(DESIGN_CONSTANTS.DURATION.DEFAULT_TRANSITION)
      .call(d3.axisLeft(yScale).ticks(numTicks));

    axisGroupSelection
      .selectAll("text")
      .style("fill", "var(--color-text)")
      .style("font-size", "12px")
      .style("font-family", "var(--font-family)");
  }

  function renderGraphBody(
    svg: SVGSVGElement,
    chartData: ChartData<T>[],
    xScale: d3.ScaleLinear<number, number>,
    yScale: d3.ScaleLinear<number, number>,
    barWidth: number
  ) {
    // Color scale from red (high) to green (low)
    const colorScale = d3.scaleLinear(
      [0, d3.max(chartData, (d: ChartData<T>) => d.y) || 0],
      ["green", "red"]
    ); // Green to red

    const visibleBarWidth = barWidth * 0.9;
    const height = yScale.range()[0];

    const bars = d3
      .select(svg)
      .selectAll<SVGGElement, ChartData<T>>(".bar-group")
      .data(chartData, (d: ChartData<T>) => d.x);

    // Remove bars that no longer have data
    bars.exit().remove();

    // Create new bars for new data
    const barsEnter = bars.enter().append("g").attr("class", "bar-group");

    // Update all bars (existing + new)
    const barsUpdate = bars.merge(barsEnter);

    barsUpdate.each(function (this: SVGGElement, d: ChartData<T>) {
      const group = d3.select(this);
      const barX = xScale(d.x);

      // Handle hover area
      const hoverArea = group
        .selectAll<SVGRectElement, ChartData<T>>(".hover-area")
        .data([d]);
      hoverArea.exit().remove();
      const hoverAreaEnter = hoverArea
        .enter()
        .append("rect")
        .attr("class", "hover-area");
      const hoverAreaUpdate = hoverArea.merge(hoverAreaEnter);

      hoverAreaUpdate
        .attr("x", barX - barWidth / 2)
        .attr("y", 0)
        .attr("width", barWidth)
        .attr("height", height)
        .attr("fill", "transparent")
        .style(
          "transition",
          `fill ${DESIGN_CONSTANTS.DURATION.DEFAULT_TRANSITION}ms`
        )
        .on("mouseover", function () {
          // Highlight the bar
          group.select(".hover-area").attr("fill", "var(--color-hint)");
          group.select(".bar").attr("fill", "var(--color-text)");

          // Update tooltip content and position using bar's x position
          setTooltip({
            x: barX,
            y: yScale(d.y),
            datum: d.originalData,
          });
        })
        .on("mouseout", function () {
          // Restore bar color
          group.select(".hover-area").attr("fill", "transparent");
          group.select(".bar").attr("fill", colorScale(d.y));

          // Hide tooltip
          setTooltip(null);
        });

      // Handle bar
      const bar = group
        .selectAll<SVGRectElement, ChartData<T>>(".bar")
        .data([d]);
      bar.exit().remove();
      const barEnter = bar.enter().append("rect").attr("class", "bar");
      const barUpdate = bar.merge(barEnter);

      // Add transitions for smooth updates
      barEnter
        .attr("x", xScale(d.x) - visibleBarWidth / 2)
        .attr("width", visibleBarWidth)
        .attr("y", height)
        .attr("stroke", "var(--color-bg)")
        .attr("stroke-width", 1)
        .style("pointer-events", "none")
        .style(
          "transition",
          `fill ${DESIGN_CONSTANTS.DURATION.DEFAULT_TRANSITION}ms`
        )
        .transition()
        .duration(DESIGN_CONSTANTS.DURATION.DEFAULT_TRANSITION)
        .attr("y", yScale(d.y))
        .attr("height", height - yScale(d.y))
        .attr("fill", colorScale(d.y));

      barUpdate
        .transition()
        .duration(DESIGN_CONSTANTS.DURATION.DEFAULT_TRANSITION)
        .attr("x", xScale(d.x) - visibleBarWidth / 2)
        .attr("width", visibleBarWidth)
        .attr("y", yScale(d.y))
        .attr("height", height - yScale(d.y))
        .attr("fill", colorScale(d.y));
    });
  }

  const renderGraph = useCallback(() => {
    if (
      !xAxisContainerRef.current ||
      !yAxisContainerRef.current ||
      !graphBodyRef.current
    )
      return;

    const width = xAxisContainerRef.current.clientWidth;
    const height = yAxisContainerRef.current.clientHeight;

    const barWidth = width / processedData.length;

    const xScale = d3
      .scaleLinear()
      .domain(
        d3.extent(processedData, (d: ChartData<T>) => d.x) as [number, number]
      )
      .range([barWidth / 2, width - barWidth / 2]);

    const maxValue =
      processedData.length > 0
        ? Math.max(...processedData.map((d: ChartData<T>) => d.y))
        : 0;
    const yScale = d3.scaleLinear().domain([0, maxValue]).range([height, 0]);
    renderXAxis(xAxisContainerRef.current, xScale);
    renderYAxis(yAxisContainerRef.current, yScale);
    renderGraphBody(
      graphBodyRef.current,
      processedData,
      xScale,
      yScale,
      barWidth
    );
  }, [processedData]);

  useEffect(() => {
    renderGraph();
  }, [graphBodyDimensions, renderGraph]);

  return (
    <div
      ref={graphContainerRef}
      className={clsx("relative h-full w-full", className)}
    >
      <div className="absolute top-0 right-0 bottom-5 left-7">
        <svg ref={graphBodyRef} width="100%" height="100%"></svg>
        {/* React tooltip */}
        {tooltip && graphBodyDimensions && (
          <div
            ref={tooltipRef}
            className="border-text bg-bg pointer-events-none absolute z-50 rounded border p-1 text-xs whitespace-nowrap transition-[left,top] duration-(--duration-default-transition)"
            style={tooltipStyle}
          >
            {tooltipContent(tooltip.datum)}
          </div>
        )}
      </div>
      <div className="absolute right-0 bottom-0 left-7 h-5">
        <svg
          ref={xAxisContainerRef}
          className="overflow-visible"
          width="100%"
          height="100%"
        ></svg>
      </div>
      <div className="absolute top-0 bottom-5 left-0 w-7">
        <svg
          ref={yAxisContainerRef}
          className="overflow-visible"
          width="100%"
          height="100%"
        ></svg>
      </div>
    </div>
  );
}
