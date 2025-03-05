import { Card, CardContent } from "./ui/card";
import { Droplets, Wind, Clock, Sun, Moon} from "lucide-react";
import type { WeatherData, GeocodingResponse } from "@/api/types";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CurrentWeatherProps {
  data?: WeatherData;
  locationName?: GeocodingResponse;
}

export function CurrentWeather({ data, locationName }: CurrentWeatherProps) {
  if (!data) {
    return (
      <Card>
        <CardContent>
          <p className="text-sm text-gray-500">No weather data available.</p>
        </CardContent>
      </Card>
    );
  }

  const {
    weather = [{ description: "N/A", icon: "01d" }],
    main = { temp: 0, feels_like: 0, humidity: 0 },
    wind = { speed: 0 },
    sys = { sunrise: 0, sunset: 0 },
    dt = 0,
    timezone = 0, // Ensure timezone is correctly extracted
  } = data;

  const currentWeather = weather[0] ?? { description: "N/A", icon: "01d" };
  const { temp, feels_like, humidity } = main;
  const { speed } = wind;
  const { sunrise, sunset } = sys;

  const [time, setTime] = useState(new Date());
  const [isCelsius, setIsCelsius] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (dt > 0) {
      const updateLastUpdated = () => {
        const diff = Math.floor((Date.now() / 1000 - dt) / 60);
        setLastUpdated(`${diff} minute${diff !== 1 ? "s" : ""} ago`);
      };
      updateLastUpdated();
      const interval = setInterval(updateLastUpdated, 60000);
      return () => clearInterval(interval);
    }
  }, [dt]);

  const toFahrenheit = (celsius: number) => (celsius * 9) / 5 + 32;
  const formatTemp = (temp: number) => Math.round(isCelsius ? temp : toFahrenheit(temp));

  const formatLocalTime = (timestamp: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000 + timezone * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fix night/day detection using proper timezone offset
  const localTime = new Date(dt * 1000 + timezone * 1000);
  const sunriseTime = new Date(sunrise * 1000 + timezone * 1000);
  const sunsetTime = new Date(sunset * 1000 + timezone * 1000);
  const isNightTime = localTime.getTime() >= sunsetTime.getTime() || localTime.getTime() < sunriseTime.getTime();

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card className="overflow-hidden shadow-lg bg-gray-800 relative">
        <div className="absolute top-3 right-3 text-white">
          {isNightTime ? <Moon className="h-6 w-6 text-yellow-300" /> : <Sun className="h-6 w-6 text-yellow-500" />}
        </div>

        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    {locationName?.name || "Unknown Location"}
                    {locationName?.state && `, ${locationName.state}`}
                  </h2>
                  <button
                    onClick={() => setIsCelsius(!isCelsius)}
                    className="text-sm font-medium text-white hover:text-blue-200 transition-colors"
                  >
                    °{isCelsius ? "C" : "F"}
                  </button>
                </div>
                <p className="text-sm text-white/80">{locationName?.country}</p>
                <div className="flex items-center gap-2 text-sm text-white">
                  <Clock className="h-4 w-4" />
                  <span>{time.toLocaleTimeString()}</span>
                  <span className="text-xs text-white/80">Updated {lastUpdated}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.p
                  animate={{ scale: [0.9, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-7xl font-bold text-white"
                >
                  {formatTemp(temp)}°
                </motion.p>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">Feels like {formatTemp(feels_like)}°</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-200" />
                  <p className="text-sm text-white">{humidity}%</p>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-blue-200" />
                  <p className="text-sm text-white">{speed} m/s</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-yellow-500" />
                  <p className="text-sm text-white">{formatLocalTime(sunrise)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-yellow-300" />
                  <p className="text-sm text-white">{formatLocalTime(sunset)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <motion.div
                animate={{ scale: [0.9, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="relative flex aspect-square w-full max-w-[200px] items-center justify-center"
              >
                <img
                  src={`https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`}
                  alt={currentWeather.description}
                  className="h-full w-full object-contain"
                />
                <p className="text-sm font-medium capitalize text-white">{currentWeather.description}</p>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
