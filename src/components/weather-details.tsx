import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Sunrise, Sunset, Compass, Gauge, Droplet, Eye, ThermometerSun, Sun } from "lucide-react";
import { format } from "date-fns";
import type { WeatherData } from "@/api/types";

interface WeatherDetailsProps {
  data: WeatherData;
}

export function WeatherDetails({ data }: WeatherDetailsProps) {
  if (!data || !data.wind || !data.main || !data.sys) {
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

  const { wind, main, sys, visibility } = data;

  // Format time using date-fns
  const formatTime = (timestamp: number) =>
    timestamp ? format(new Date(timestamp * 1000), "h:mm a") : "N/A";

  // Convert wind degree to direction
  const getWindDirection = (degree: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(((degree % 360) + 360) % 360 / 45) % 8;
    return directions[index];
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
      value: `${getWindDirection(wind.deg)} (${wind.deg}°)`,
      icon: <Compass className="h-5 w-5 text-green-500" />,
    },
    {
      title: "Pressure",
      value: `${main.pressure} hPa`,
      icon: <Gauge className="h-5 w-5 text-purple-500" />,
    },
    {
      title: "Humidity",
      value: `${main.humidity}%`,
      icon: <Droplet className="h-5 w-5 text-blue-400" />,
    },
    {
      title: "Visibility",
      value: visibility ? `${(visibility / 1000).toFixed(1)} km` : "N/A",
      icon: <Eye className="h-5 w-5 text-gray-500" />,
    },
    {
      title: "Feels Like",
      value: `${Math.round(main.feels_like)}°C`,
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
