"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StockChartProps {
    data: number[];
    color?: string;
}

export const StockChart = ({ data, color = "#3b82f6" }: StockChartProps) => {
    // Format data for Recharts
    const chartData = data.map((price, index) => ({
        time: index,
        price: price
    }));

    const isUp = data[data.length - 1] >= data[0];
    const finalColor = isUp ? "#10b981" : "#ef4444";

    return (
        <div className="w-full h-[320px] bg-black/20 rounded-2xl p-4 border border-white/5">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id={`gradient-${finalColor}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={finalColor} stopOpacity={0.2} />
                            <stop offset="95%" stopColor={finalColor} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="time" hide />
                    <YAxis
                        domain={['auto', 'auto']}
                        hide
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(12px)',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
                        }}
                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                        labelStyle={{ display: 'none' }}
                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                        formatter={(value: any = 0) => [`Rp ${value.toLocaleString()}`, 'Price']}
                    />
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke={finalColor}
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill={`url(#gradient-${finalColor})`}
                        animationDuration={1000}
                        activeDot={{ r: 4, strokeWidth: 0, fill: finalColor }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
