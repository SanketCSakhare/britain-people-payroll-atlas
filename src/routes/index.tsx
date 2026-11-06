import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import { calcPayslip, genderPayGap, headline, labourMarket, regionalPay, sectorPay, SOURCES } from "@/lib/uk-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UK Payroll & HR Analytics Dashboard" },
      { name: "description", content: "Payroll and HR analytics on UK open data: ONS earnings, gender pay gap, labour market and a 2025/26 PAYE calculator." },
      { property: "og:title", content: "UK Payroll & HR Analytics Dashboard" },
      { property: "og:description", content: "ONS earnings, pay gap, labour market trends and a PAYE payslip calculator." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const gbp = (n: number) => "£" + n.toLocaleString("en-GB", { maximumFractionDigits: 0 });
const axis = { fontSize: 11, fill: "var(--muted-foreground)" };
const tip = { contentStyle: { background: "var(--card)", border: "1px solid var(--border)", fontSize: 12 } };

function Kpi({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-md border bg-card p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="num mt-2 text-2xl font-semibold text-primary">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{note}</div>
    </div>
  );
}

function Panel({ title, sub, children, className = "" }: { title: string; sub: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-md border bg-card p-5 ${className}`}>
      <h2 className="font-semibold">{title}</h2>
      <p className="mb-4 text-xs text-muted-foreground">{sub}</p>
      {children}
    </section>
  );
}

function Index() {
  const [salary, setSalary] = useState(37430);
  const [pension, setPension] = useState(5);
  const p = calcPayslip(salary, pension);
  const rows: [string, number][] = [
    ["Gross salary", p.gross],
    ["Pension (employee)", -p.pension],
    ["Income tax", -p.incomeTax],
    ["Employee NI", -p.employeeNI],
    ["Take-home pay", p.takeHome],
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="text-xs uppercase tracking-[0.2em] opacity-80">Portfolio project · UK open data</div>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">Payroll &amp; HR Analytics Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm opacity-85">
            Earnings, pay equity and workforce trends from ONS releases, plus a 2025/26 PAYE engine for payroll modelling.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <Kpi label="Median FT salary" value={gbp(headline.medianFullTime)} note="ONS ASHE 2024" />
          <Kpi label="Median weekly pay" value={gbp(headline.medianWeekly)} note="Full-time, gross" />
          <Kpi label="Gender pay gap" value={`${headline.genderGapFT}%`} note="Full-time median, 2024" />
          <Kpi label="Unemployment" value={`${headline.unemployment}%`} note="LFS, 2025" />
          <Kpi label="National Living Wage" value={`£${headline.nlw}`} note="Per hour, Apr 2025" />
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <Panel title="PAYE payslip calculator" sub="Payroll · England/Wales/NI rates 2025/26" className="lg:col-span-2">
            <label className="text-xs text-muted-foreground">Annual gross salary</label>
            <input type="number" value={salary} onChange={(e) => setSalary(Number(e.target.value) || 0)}
              className="num mt-1 w-full rounded-md border bg-background px-3 py-2" />
            <label className="mt-3 block text-xs text-muted-foreground">Employee pension: {pension}%</label>
            <input type="range" min={0} max={15} value={pension} onChange={(e) => setPension(Number(e.target.value))}
              className="w-full accent-primary" />
            <table className="num mt-4 w-full text-sm">
              <tbody>
                {rows.map(([k, v], i) => (
                  <tr key={k} className={i === rows.length - 1 ? "border-t font-semibold text-primary" : ""}>
                    <td className="py-1.5 font-sans">{k}</td>
                    <td className="text-right">{gbp(v)}</td>
                    <td className="w-24 text-right text-muted-foreground">{gbp(v / 12)}/m</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 rounded-md bg-muted p-3 text-xs">
              <div className="flex justify-between"><span>Employer NI (15%)</span><span className="num">{gbp(p.employerNI)}</span></div>
              <div className="flex justify-between"><span>Total employer cost (incl. 3% pension)</span><span className="num font-semibold">{gbp(p.employerCost)}</span></div>
            </div>
          </Panel>

          <Panel title="Median full-time pay by region" sub="ONS ASHE 2024 · annual gross" className="lg:col-span-3">
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={regionalPay} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" tick={axis} tickFormatter={(v) => `£${v / 1000}k`} />
                <YAxis type="category" dataKey="region" tick={axis} width={90} />
                <Tooltip {...tip} formatter={(v) => gbp(Number(v))} />
                <Bar dataKey="median" fill="var(--chart-1)" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Gender pay gap trend" sub="HR · ONS median hourly pay excl. overtime">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={genderPayGap}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="year" tick={axis} />
                <YAxis tick={axis} unit="%" />
                <Tooltip {...tip} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line dataKey="all" name="All employees" stroke="var(--chart-2)" strokeWidth={2} />
                <Line dataKey="fullTime" name="Full-time" stroke="var(--chart-1)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>
          <Panel title="Labour market: unemployment vs pay growth" sub="HR · ONS LFS & AWE regular pay, annual %">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={labourMarket}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="year" tick={axis} />
                <YAxis tick={axis} unit="%" />
                <Tooltip {...tip} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line dataKey="unemployment" name="Unemployment" stroke="var(--chart-4)" strokeWidth={2} />
                <Line dataKey="payGrowth" name="Regular pay growth" stroke="var(--chart-3)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>
        </div>

        <Panel title="Sector benchmark: pay and gender gap" sub="Payroll + HR · ONS ASHE 2024 by industry (approx.)">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="py-2">Sector</th><th className="text-right">Median FT pay</th><th className="text-right">vs UK median</th><th className="text-right">Gender gap</th><th className="w-1/3 pl-6">Gap</th></tr>
              </thead>
              <tbody className="num">
                {sectorPay.map((s) => {
                  const diff = ((s.median - headline.medianFullTime) / headline.medianFullTime) * 100;
                  return (
                    <tr key={s.sector} className="border-t">
                      <td className="py-2 font-sans">{s.sector}</td>
                      <td className="text-right">{gbp(s.median)}</td>
                      <td className={`text-right ${diff >= 0 ? "text-primary" : "text-destructive"}`}>{diff >= 0 ? "+" : ""}{diff.toFixed(1)}%</td>
                      <td className="text-right">{s.gap}%</td>
                      <td className="pl-6"><div className="h-2 rounded bg-muted"><div className="h-2 rounded bg-accent" style={{ width: `${(s.gap / 25) * 100}%` }} /></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Data sources" sub="All UK open government data (Open Government Licence v3.0)">
          <ul className="grid gap-2 text-sm md:grid-cols-2">
            {SOURCES.map((s) => (
              <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-2">{s.name}</a></li>
            ))}
          </ul>
        </Panel>
      </main>
    </div>
  );
}
