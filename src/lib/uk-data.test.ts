import { describe, expect, it } from "vitest";
import { calcPayslip } from "./uk-data";

describe("UK payroll 2025/26", () => {
  it("£30k with no pension: tax £3,486, NI £1,394.40", () => {
    const p = calcPayslip(30000, 0);
    expect(p.incomeTax).toBe(3486);
    expect(p.employeeNI).toBe(1394.4);
  });
  it("tapers personal allowance to zero at £125,140", () => {
    expect(calcPayslip(125140, 0).personalAllowance).toBe(0);
  });
  it("employer NI is 15% above £5,000", () => {
    expect(calcPayslip(30000, 0).employerNI).toBe(3750);
  });
});
