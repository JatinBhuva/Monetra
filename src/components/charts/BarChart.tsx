import React, { useMemo } from 'react';
import Svg, { Line, Rect } from 'react-native-svg';

type BarChartDatum = {
  label: string;
  income: number;
  expense: number;
};

type BarChartProps = {
  data: BarChartDatum[];
  width: number;
  height?: number;
  incomeColor?: string;
  expenseColor?: string;
};

const BarChart = ({
  data,
  width,
  height = 110,
  incomeColor = '#4CAF50',
  expenseColor = '#FF8A65',
}: BarChartProps) => {
  const bars = useMemo(() => {
    const padding = 10;
    const maxValue = Math.max(1, ...data.flatMap(item => [item.income, item.expense]));
    const groupWidth = (width - padding * 2) / data.length;
    const barWidth = Math.max(10, (groupWidth - 8) / 2);

    return data.map((item, index) => {
      const baseX = padding + index * groupWidth;
      const incomeHeight = (item.income / maxValue) * (height - padding * 2);
      const expenseHeight = (item.expense / maxValue) * (height - padding * 2);

      return {
        income: {
          x: baseX,
          y: height - padding - incomeHeight,
          width: barWidth,
          height: incomeHeight,
        },
        expense: {
          x: baseX + barWidth + 8,
          y: height - padding - expenseHeight,
          width: barWidth,
          height: expenseHeight,
        },
      };
    });
  }, [data, height, width]);

  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      <Line x1={0} y1={height - 22} x2={width} y2={height - 22} stroke="#E4E6EB" strokeWidth={1} />
      {bars.map((bar, index) => (
        <React.Fragment key={`bar-${index}`}>
          <Rect
            x={bar.income.x}
            y={bar.income.y}
            width={bar.income.width}
            height={bar.income.height}
            rx={8}
            fill={incomeColor}
          />
          <Rect
            x={bar.expense.x}
            y={bar.expense.y}
            width={bar.expense.width}
            height={bar.expense.height}
            rx={8}
            fill={expenseColor}
          />
        </React.Fragment>
      ))}
    </Svg>
  );
};

export default BarChart;
