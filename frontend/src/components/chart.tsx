import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useEffect, useState } from "react";

export function TrafficChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/traffic-data`
        );
        const mapped = response.data.map((item: any) => ({
          name: new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          vehicle_count: item.vehicle_count,
          avg_count: item.avg_count,
        }));
        setData(mapped);
      } catch (error) {
        console.error(error);
      }
    };

    getData();
    const intervalId = setInterval(getData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card className="w-80 h-56 shadow-xl bg-background">
      <CardContent className="w-full h-full">
        <span className="font-semibold block mb-1">Live Traffic</span>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={data}>
            <Tooltip />
            <Line
              type="monotone"
              dataKey="vehicle_count"
              stroke="#23DC84"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
