import React, { useMemo, useId } from 'react';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

type LineAreaChartProps = {
  values: number[];
  width: number;
  height?: number;
  strokeColor?: string;
  fillFromColor?: string;
  fillToColor?: string;
};

const LineAreaChart = ({
  values,
  width,
  height = 120,
  strokeColor = '#3D5AFE',
  fillFromColor = '#B8C6FF',
  fillToColor = '#FFFFFF',
}: LineAreaChartProps) => {
  const gradientId = useId().replace(/:/g, '');

  const chart = useMemo(() => {
    const padding = 12;
    const safeValues = values.length > 0 ? values : [0, 0];
    const minValue = Math.min(...safeValues, 0);
    const maxValue = Math.max(...safeValues, 1);
    const range = maxValue - minValue || 1;

    const points = safeValues.map((value, index) => {
      const x =
        padding +
        (index / (safeValues.length - 1)) * (width - padding * 2 || 1);
      const y =
        padding +
        (1 - (value - minValue) / range) * (height - padding * 2);
      return { x, y };
    });

    const path = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');

    const areaPath = [
      path,
      `L ${points[points.length - 1].x} ${height - padding}`,
      `L ${points[0].x} ${height - padding}`,
      'Z',
    ].join(' ');

    return { points, path, areaPath };
  }, [height, values, width]);

  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={fillFromColor} stopOpacity={0.6} />
          <Stop offset="100%" stopColor={fillToColor} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Path d={chart.areaPath} fill={`url(#${gradientId})`} />
      <Path d={chart.path} stroke={strokeColor} strokeWidth={3} fill="none" />
      {chart.points.map(point => (
        <Circle
          key={`pulse-${point.x}`}
          cx={point.x}
          cy={point.y}
          r={4}
          fill="#FFFFFF"
          stroke={strokeColor}
          strokeWidth={2}
        />
      ))}
    </Svg>
  );
};

export default LineAreaChart;
