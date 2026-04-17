"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

export function InvestorDoughnutChart({
  myContribution,
  companyContribution,
  otherInvestors
}: {
  myContribution: number;
  companyContribution: number;
  otherInvestors: number;
}) {
  const data = [
    { name: "My Contribution", value: myContribution },
    { name: "Company", value: companyContribution },
    { name: "Other Investors", value: otherInvestors }
  ];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={65} outerRadius={95}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={["#D4A843", "#38BDF8", "#A78BFA"][index % 3]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PropertyValueLineChart({
  points
}: {
  points: Array<{ date: string; value: number }>;
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={points}>
          <CartesianGrid stroke="#1E293B" strokeDasharray="4 4" />
          <XAxis dataKey="date" stroke="#94A3B8" />
          <YAxis stroke="#94A3B8" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#D4A843" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
