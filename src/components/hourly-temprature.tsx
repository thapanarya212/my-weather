import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import type { ForecastData } from "@/api/types";
import { Sun, CloudRain, Cloud, Wind } from "lucide-react";

interface HourlyTemperatureProps {
  data: ForecastData;
}

interface ChartData {
  time: string;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  weather: string;
}

// Function to get weather icons
const getWeatherIcon = (weather: string) => {
  switch (weather.toLowerCase()) {
    case "clear":
      return <Sun className="text-yellow-500" size={16} />;
    case "rain":
      return <CloudRain className="text-blue-500" size={16} />;
    case "clouds":
      return <Cloud className="text-gray-400" size={16} />;
    default:
      return <Wind className="text-gray-500" size={16} />;
  }
};

export function HourlyTemperature({ data }: HourlyTemperatureProps) {
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  if (!data?.list || data.list.length === 0) {
    return (
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Today's Temperature</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No data available.</p>
        </CardContent>
      </Card>
    );
  }

  // Get next 12 hours (3-hour intervals)
  const chartData: ChartData[] = data.list.slice(0, 12).map((item) => ({
    time: format(new Date(item.dt * 1000), "ha"),
    temp: Math.round(item.main.temp),
    feels_like: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
    wind_speed: item.wind.speed,
    weather: item.weather[0].main,
  }));

  return (
    <Card className="flex-1">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>12-Hour Forecast</CardTitle>
        <button
          className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg"
          onClick={() => setChartType(chartType === "line" ? "bar" : "line")}
        >
          {chartType === "line" ? "Switch to Bar Chart" : "Switch to Line Chart"}
        </button>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={chartData}>
                <XAxis
                  dataKey="time"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}°`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0]?.payload;
                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-md">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Temp
                              </span>
                              <span className="font-bold">{data.temp}°</span>
                              {getWeatherIcon(data.weather)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Feels Like
                              </span>
                              <span className="font-bold">{data.feels_like}°</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Humidity
                              </span>
                              <span className="font-bold">{data.humidity}%</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Wind Speed
                              </span>
                              <span className="font-bold">{data.wind_speed} m/s</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ stroke: "#2563eb", strokeWidth: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="feels_like"
                  stroke="#64748b"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="5 5"
                />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <XAxis
                  dataKey="time"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}°`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0]?.payload;
                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-md">
                          <p className="font-bold">Temp: {data.temp}°</p>
                          <p className="text-sm">Feels Like: {data.feels_like}°</p>
                          <p className="text-sm">Humidity: {data.humidity}%</p>
                          <p className="text-sm">Wind Speed: {data.wind_speed} m/s</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="temp" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="feels_like" fill="#64748b" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
