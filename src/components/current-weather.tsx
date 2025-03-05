import { Card, CardContent } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind, Clock, Sun, Moon, Gauge, Eye, Navigation, Cloud } from "lucide-react";
import type { WeatherData, GeocodingResponse } from "@/api/types";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CurrentWeatherProps {
  data: WeatherData;
  locationName?: GeocodingResponse;
}

export function CurrentWeather({ data, locationName }: CurrentWeatherProps) {
  const {
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, humidity, pressure },
    wind: { speed, deg: windDeg },
    clouds: { all: cloudiness },
    visibility,
    sys: { sunrise, sunset },
    dt,
    timezone
  } = data;

  const [time, setTime] = useState(new Date());
  const [isCelsius, setIsCelsius] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateLastUpdated = () => {
      const diff = Math.floor((Date.now() - dt * 1000) / 60000);
      setLastUpdated(`${diff} minute${diff !== 1 ? "s" : ""} ago`);
    };
    updateLastUpdated();
    const interval = setInterval(updateLastUpdated, 60000);
    return () => clearInterval(interval);
  }, [dt]);

  const toFahrenheit = (celsius: number) => (celsius * 9) / 5 + 32;
  const formatTemp = (temp: number) => Math.round(isCelsius ? temp : toFahrenheit(temp));
  
  // Properly formats local time
  const formatLocalTime = (timestamp: number) =>
    new Date((timestamp + timezone - new Date().getTimezoneOffset() * 60) * 1000)
      .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const getBackgroundColor = () => {
    const currentTime = Math.floor(time.getTime() / 1000);
    if (currentTime >= sunrise && currentTime < sunrise + 3 * 3600) return "bg-yellow-400";
    if (currentTime >= sunrise + 3 * 3600 && currentTime < sunset - 3 * 3600) return "bg-blue-400";
    if (currentTime >= sunset - 3 * 3600 && currentTime < sunset) return "bg-orange-500";
    return "bg-gray-800";
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card className={`overflow-hidden shadow-lg ${getBackgroundColor()} relative`}>
        <div className="absolute top-3 right-3 text-white">
          {time.getTime() / 1000 >= sunset || time.getTime() / 1000 < sunrise ? (
            <Moon className="h-6 w-6 text-yellow-300" />
          ) : (
            <Sun className="h-6 w-6 text-yellow-500" />
          )}
        </div>

        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    {locationName?.name}{locationName?.state && `, ${locationName.state}`}
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
