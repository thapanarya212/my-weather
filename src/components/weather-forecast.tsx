import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind, ThermometerSun, Sun, Clock } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import type { ForecastData } from "@/api/types";

interface WeatherForecastProps {
  data: ForecastData;
}

interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  feels_like: number;
  humidity: number;
  wind: number;
  sunrise: number;
  sunset: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

export function WeatherForecast({ data }: WeatherForecastProps) {
  if (!data || !data.list || data.list.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No forecast data available.</p>
        </CardContent>
      </Card>
    );
  }

  // Group forecast by day and get daily min/max
  const dailyForecasts = data.list.reduce((acc, forecast) => {
    const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = {
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        feels_like: forecast.main.feels_like,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        sunrise: data.city.sunrise,
        sunset: data.city.sunset,
        weather: forecast.weather[0],
        date: forecast.dt,
      };
    } else {
      acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
      acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
      acc[date].feels_like = forecast.main.feels_like;
    }
    return acc;
  }, {} as Record<string, DailyForecast>);

  const nextDays = Object.values(dailyForecasts).slice(1, 6);

  const formatTemp = (temp: number) => `${Math.round(temp)}°C`;
  const formatTime = (timestamp: number) => format(new Date(timestamp * 1000), "hh:mm a");

  return (
    <Card>
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {nextDays.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="grid grid-cols-4 items-center gap-4 rounded-lg border p-4 shadow-lg transition"
            >
              {/* Date & Description */}
              <div className="flex flex-col items-start">
                <p className="font-medium">{format(new Date(day.date * 1000), "EEE, MMM d")}</p>
                <p className="text-sm text-muted-foreground capitalize">{day.weather.description}</p>
              </div>

              {/* Weather Icon */}
              <div className="flex justify-center">
                <motion.img
                  src={`https://openweathermap.org/img/wn/${day.weather.icon}.png`}
                  alt={day.weather.description}
                  className="h-10 w-10"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Temperature Details */}
              <div className="flex flex-col items-center">
                <div className="flex gap-4">
                  <span className="flex items-center text-blue-500">
                    <ArrowDown className="mr-1 h-4 w-4" />
                    {formatTemp(day.temp_min)}
                  </span>
                  <span className="flex items-center text-red-500">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    {formatTemp(day.temp_max)}
                  </span>
                </div>
                <span className="flex items-center text-yellow-500">
                  <ThermometerSun className="mr-1 h-4 w-4" />
                  Feels like: {formatTemp(day.feels_like)}
                </span>
              </div>

              {/* Humidity, Wind Speed, Sunrise & Sunset */}
              <div className="flex flex-col items-end">
                <span className="flex items-center gap-1">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{day.humidity}%</span>
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{day.wind} m/s</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-orange-400" />
                  <span className="text-sm">Sunset: {formatTime(day.sunset)}</span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
