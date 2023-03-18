import { useTheme } from "@mui/material/styles";
import { FC } from "react";
import { BarChart, XAxis, YAxis, Label, ResponsiveContainer, CartesianGrid, Tooltip, Bar } from "recharts";
import { ChartData } from "../../types";

interface Props {
  ylabel: string;
  dataset: ChartData[];
  tickInterval?: number;
}

const ChartBar: FC<Props> = ({ ylabel, dataset, tickInterval = undefined }) => {
  const theme = useTheme();

  return (
    <>
      <ResponsiveContainer>
        <BarChart data={dataset} margin={{ top: 16, right: 16, bottom: 0, left: ylabel ? 18 : 0 }}>
          <XAxis
            dataKey="date"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
            minTickGap={28}
            interval={tickInterval}
          />
          <YAxis stroke={theme.palette.text.secondary} style={theme.typography.body2}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: "middle", fill: theme.palette.text.primary, ...theme.typography.body1 }}
            >
              {ylabel}
            </Label>
          </YAxis>
          <Bar isAnimationActive={false} type="monotone" dataKey="value" fill={theme.palette.primary.main} opacity={0.5} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default ChartBar;
