import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Sunrise, Sunset, Compass, Gauge, Droplet, Eye, ThermometerSun, Sun } from "lucide-react";
import { format } from "date-fns";
import type { WeatherData } from "@/api/types";

interface WeatherDetailsProps {
  data?: WeatherData;
}

export function WeatherDetails({ data }: WeatherDetailsProps) {
  if (!data?.wind || !data?.main || !data?.sys) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No data available.</p>
        </CardContent>
      </Card>
    );
  }

  const wind = data.wind ?? { deg: undefined };
  const main = data.main ?? { pressure: undefined, humidity: undefined, feels_like: undefined };
  const sys = data.sys ?? { sunrise: undefined, sunset: undefined };
  const visibility = data.visibility ?? undefined;

  // Format time using date-fns
  const formatTime = (timestamp?: number) =>
    timestamp ? format(new Date(timestamp * 1000), "h:mm a") : "N/A";

  // Convert wind degree to direction
  const getWindDirection = (degree?: number) => {
    if (degree === undefined) return "N/A";
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.round(degree / 45) % 8];
  };

  const details = [
    {
      title: "Sunrise",
      value: formatTime(sys.sunrise),
      icon: <Sunrise className="h-5 w-5 text-orange-500" />,
    },
    {
      title: "Sunset",
      value: formatTime(sys.sunset),
      icon: <Sunset className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Wind Direction",
      value: wind.deg !== undefined ? `${getWindDirection(wind.deg)} (${wind.deg}°)` : "N/A",
      icon: <Compass className="h-5 w-5 text-green-500" />,
    },
    {
      title: "Pressure",
      value: main.pressure !== undefined ? `${main.pressure} hPa` : "N/A",
      icon: <Gauge className="h-5 w-5 text-purple-500" />,
    },
    {
      title: "Humidity",
      value: main.humidity !== undefined ? `${main.humidity}%` : "N/A",
      icon: <Droplet className="h-5 w-5 text-blue-400" />,
    },
    {
      title: "Visibility",
      value: visibility !== undefined ? `${(visibility / 1000).toFixed(1)} km` : "N/A",
      icon: <Eye className="h-5 w-5 text-gray-500" />,
    },
    {
      title: "Feels Like",
      value: main.feels_like !== undefined ? `${Math.round(main.feels_like)}°C` : "N/A",
      icon: <ThermometerSun className="h-5 w-5 text-yellow-500" />,
    },
    {
      title: "UV Index",
      value: "Coming Soon", // Placeholder for UV Index (future API integration)
      icon: <Sun className="h-5 w-5 text-yellow-400" />,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {details.map((detail) => (
            <div key={detail.title} className="flex items-center gap-3 rounded-lg border p-4">
              {detail.icon}
              <div>
                <p className="text-sm font-medium leading-none">{detail.title}</p>
                <p className="text-sm text-muted-foreground">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
