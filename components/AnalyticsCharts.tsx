"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface AnalyticsChartsProps {
  matches: any[]
  messages: any[]
}

export default function AnalyticsCharts({ matches, messages }: AnalyticsChartsProps) {
  // Mock data for charts
  const matchingTrendData = [
    { month: "Jan", matches: 12, messages: 45 },
    { month: "Feb", matches: 19, messages: 62 },
    { month: "Mar", matches: 15, messages: 38 },
    { month: "Apr", matches: 25, messages: 78 },
    { month: "May", matches: 22, messages: 65 },
    { month: "Jun", matches: 30, messages: 95 },
  ]

  const matchStatusData = [
    { name: "Accepted", value: 45, color: "#10b981" },
    { name: "Pending", value: 30, color: "#f59e0b" },
    { name: "Declined", value: 25, color: "#ef4444" },
  ]

  const ageDistributionData = [
    { age: "18-24", count: 15 },
    { age: "25-29", count: 35 },
    { age: "30-34", count: 28 },
    { age: "35-39", count: 18 },
    { age: "40+", count: 12 },
  ]

  const activityData = [
    { day: "Mon", logins: 45, matches: 8 },
    { day: "Tue", logins: 52, matches: 12 },
    { day: "Wed", logins: 38, matches: 6 },
    { day: "Thu", logins: 61, matches: 15 },
    { day: "Fri", logins: 73, matches: 18 },
    { day: "Sat", logins: 89, matches: 22 },
    { day: "Sun", logins: 67, matches: 14 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matching Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Matching Trends</CardTitle>
            <CardDescription>Monthly matches and messages over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                matches: {
                  label: "Matches",
                  color: "hsl(var(--chart-1))",
                },
                messages: {
                  label: "Messages",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={matchingTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="matches"
                    stroke="var(--color-matches)"
                    strokeWidth={2}
                    name="Matches"
                  />
                  <Line
                    type="monotone"
                    dataKey="messages"
                    stroke="var(--color-messages)"
                    strokeWidth={2}
                    name="Messages"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Match Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Match Status</CardTitle>
            <CardDescription>Distribution of match outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                accepted: {
                  label: "Accepted",
                  color: "#10b981",
                },
                pending: {
                  label: "Pending",
                  color: "#f59e0b",
                },
                declined: {
                  label: "Declined",
                  color: "#ef4444",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={matchStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {matchStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
            <CardDescription>Age groups of matched users</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Count",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Daily logins and matches this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                logins: {
                  label: "Logins",
                  color: "hsl(var(--chart-4))",
                },
                matches: {
                  label: "Matches",
                  color: "hsl(var(--chart-5))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="logins" fill="var(--color-logins)" name="Logins" />
                  <Bar dataKey="matches" fill="var(--color-matches)" name="Matches" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Match Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">-0.3h from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
