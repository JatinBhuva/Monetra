import React, { useMemo } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  segments: DonutSegment[];
  size?: number;
  innerRadius?: number;
  outerRadius?: number;
  centerFill?: string;
};

const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
};

const describeDonutArc = (
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startAngle: number,
  endAngle: number,
) => {
  const startOuter = polarToCartesian(cx, cy, rOuter, endAngle);
  const endOuter = polarToCartesian(cx, cy, rOuter, startAngle);
  const startInner = polarToCartesian(cx, cy, rInner, startAngle);
  const endInner = polarToCartesian(cx, cy, rInner, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${rInner} ${rInner} 0 ${largeArcFlag} 1 ${endInner.x} ${endInner.y}`,
    'Z',
  ].join(' ');
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const DonutChart = ({
  segments,
  size = 180,
  innerRadius = 46,
  outerRadius = 72,
  centerFill = '#FFFFFF',
}: DonutChartProps) => {
  const viewBoxSize = 200;
  const center = viewBoxSize / 2;

  const paths = useMemo(() => {
    if (segments.length === 0) {
      return [];
    }
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);
    let startAngle = 0;

    return segments.map(segment => {
      const sweep = clamp((segment.value / total) * 360, 4, 360);
      const endAngle = startAngle + sweep;
      const path = describeDonutArc(
        center,
        center,
        outerRadius,
        innerRadius,
        startAngle,
        endAngle,
      );
      const item = { ...segment, path };
      startAngle = endAngle;
      return item;
    });
  }, [center, segments, innerRadius, outerRadius]);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
      {paths.map(segment => (
        <Path key={segment.label} d={segment.path} fill={segment.color} />
      ))}
      <Circle cx={center} cy={center} r={innerRadius - 2} fill={centerFill} />
    </Svg>
  );
};

export default DonutChart;
