# Britain People Payroll Atlas

[Live dashboard](https://britain-people-payroll-atlas.lovable.app/) · [Lovable project](https://lovable.dev/projects/eda02308-f2ae-4c2b-92c7-595fab1c9c63)

A UK payroll and HR analytics portfolio dashboard. It combines an interactive 2025/26 PAYE payslip calculator with regional earnings, gender pay gap, labour market, and industry comparisons.

The dashboard uses static figures from ONS and HMRC releases. Regional and industry figures are approximate; check the linked source releases before quoting them. The calculator covers England, Wales, and Northern Ireland income tax rates, not Scotland's separate rates.

## Run locally

Install dependencies with `bun install` or `npm install`, then run `bun run dev` or `npm run dev`. Use `bun run build` or `npm run build` to build the app, and `bun run test` or `npm test` to run its tests.

## Sources

- [ONS Annual Survey of Hours and Earnings 2024](https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/bulletins/annualsurveyofhoursandearnings/2024)
- [ONS Gender pay gap in the UK 2024](https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/bulletins/genderpaygapintheuk/2024)
- [ONS UK labour market overview](https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/employmentandemployeetypes/bulletins/uklabourmarket/latest)
- [HMRC Income Tax rates and allowances](https://www.gov.uk/government/publications/rates-and-allowances-income-tax/income-tax-rates-and-allowances-current-and-past)

Built with TanStack Start, React, TypeScript, Tailwind CSS, and Recharts. Source exported from Lovable on 6 November 2026.
