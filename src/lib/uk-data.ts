// UK open data snapshots (ONS ASHE, ONS Labour Market, ONS Gender Pay Gap, HMRC rates).
// Figures rounded from published ONS releases; see SOURCES for links.

export const SOURCES = [
  { name: "ONS – Annual Survey of Hours and Earnings (ASHE) 2024", url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/bulletins/annualsurveyofhoursandearnings/2024" },
  { name: "ONS – Gender pay gap in the UK 2024", url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/bulletins/genderpaygapintheuk/2024" },
  { name: "ONS – Labour market overview (LFS unemployment)", url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/employmentandemployeetypes/bulletins/uklabourmarket/latest" },
  { name: "HMRC – Income Tax & NI rates 2025/26", url: "https://www.gov.uk/government/publications/rates-and-allowances-income-tax/income-tax-rates-and-allowances-current-and-past" },
];

export const regionalPay = [
  { region: "London", median: 47455 },
  { region: "South East", median: 38900 },
  { region: "East", median: 37000 },
  { region: "Scotland", median: 36500 },
  { region: "South West", median: 35100 },
  { region: "West Midlands", median: 35000 },
  { region: "North West", median: 34900 },
  { region: "East Midlands", median: 34000 },
  { region: "Yorkshire", median: 33800 },
  { region: "Wales", median: 33600 },
  { region: "North East", median: 33100 },
  { region: "N. Ireland", median: 33000 },
];

export const genderPayGap = [
  { year: 2015, fullTime: 9.6, all: 19.2 },
  { year: 2016, fullTime: 9.3, all: 18.4 },
  { year: 2017, fullTime: 9.1, all: 18.4 },
  { year: 2018, fullTime: 8.6, all: 17.8 },
  { year: 2019, fullTime: 9.0, all: 17.4 },
  { year: 2020, fullTime: 7.0, all: 14.9 },
  { year: 2021, fullTime: 7.7, all: 15.1 },
  { year: 2022, fullTime: 8.3, all: 14.4 },
  { year: 2023, fullTime: 7.5, all: 14.2 },
  { year: 2024, fullTime: 7.0, all: 13.1 },
];

export const labourMarket = [
  { year: 2015, unemployment: 5.4, payGrowth: 2.5 },
  { year: 2016, unemployment: 4.9, payGrowth: 2.3 },
  { year: 2017, unemployment: 4.4, payGrowth: 2.4 },
  { year: 2018, unemployment: 4.1, payGrowth: 3.0 },
  { year: 2019, unemployment: 3.8, payGrowth: 3.5 },
  { year: 2020, unemployment: 4.6, payGrowth: 1.6 },
  { year: 2021, unemployment: 4.5, payGrowth: 4.9 },
  { year: 2022, unemployment: 3.7, payGrowth: 5.5 },
  { year: 2023, unemployment: 4.0, payGrowth: 7.3 },
  { year: 2024, unemployment: 4.3, payGrowth: 5.6 },
  { year: 2025, unemployment: 4.8, payGrowth: 4.8 },
];

export const sectorPay = [
  { sector: "Finance & insurance", median: 50200, gap: 22.0 },
  { sector: "Information & comms", median: 49100, gap: 12.9 },
  { sector: "Energy supply", median: 47800, gap: 9.4 },
  { sector: "Public admin", median: 38900, gap: 5.6 },
  { sector: "Education", median: 36200, gap: 17.3 },
  { sector: "Manufacturing", median: 36000, gap: 8.2 },
  { sector: "Construction", median: 37500, gap: 13.6 },
  { sector: "Health & social care", median: 32500, gap: 13.0 },
  { sector: "Retail & wholesale", median: 28900, gap: 8.5 },
  { sector: "Hospitality", median: 23300, gap: 4.1 },
];

export const headline = {
  medianFullTime: 37430,
  medianWeekly: 728,
  genderGapFT: 7.0,
  unemployment: 4.8,
  nlw: 12.21,
};

// ---- Payroll engine: England/Wales/NI rUK rates, 2025/26 ----
export type Payslip = {
  gross: number;
  personalAllowance: number;
  incomeTax: number;
  employeeNI: number;
  employerNI: number;
  pension: number;
  takeHome: number;
  employerCost: number;
};

export function calcPayslip(gross: number, pensionPct = 5): Payslip {
  const pension = Math.max(0, gross * (pensionPct / 100));
  const taxable = Math.max(0, gross - pension); // net-pay arrangement
  let pa = 12570;
  if (taxable > 100000) pa = Math.max(0, pa - (taxable - 100000) / 2);
  const basicTop = 50270, addStart = 125140;
  const basicBand = basicTop - 12570;
  const afterPA = Math.max(0, taxable - pa);
  const basic = Math.min(afterPA, basicBand);
  const higher = Math.min(Math.max(0, afterPA - basicBand), Math.max(0, addStart - pa - basicBand));
  const additional = Math.max(0, taxable - addStart);
  const incomeTax = basic * 0.2 + higher * 0.4 + additional * 0.45;
  const employeeNI = Math.max(0, Math.min(gross, basicTop) - 12570) * 0.08 + Math.max(0, gross - basicTop) * 0.02;
  const employerNI = Math.max(0, gross - 5000) * 0.15;
  const r = (n: number) => Math.round(n * 100) / 100;
  return {
    gross,
    personalAllowance: r(pa),
    incomeTax: r(incomeTax),
    employeeNI: r(employeeNI),
    employerNI: r(employerNI),
    pension: r(pension),
    takeHome: r(gross - incomeTax - employeeNI - pension),
    employerCost: r(gross + employerNI + gross * 0.03),
  };
}
