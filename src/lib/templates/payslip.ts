// src/lib/templates/payslip.ts
import { wrapDocument } from './document-wrapper';

export function generatePayslipHtml(employeeData: any): string {
  // 1. Build only the internal content specific to the payslip
  const payslipContent = `
    <div class="section-heading">Employee Information</div>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>Name:</strong> ${employeeData.name}</td>
        <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>Designation:</strong> ${employeeData.designation}</td>
      </tr>
      <tr>
        <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>Month:</strong> ${employeeData.month}</td>
        <td style="padding: 5px; border-bottom: 1px solid #eee;"><strong>Net Pay:</strong> $${employeeData.netPay}</td>
      </tr>
    </table>
    
    <div class="section-heading">Earnings and Deductions</div>
    <p>... additional payslip tables go here ...</p>
  `;

  // 2. Pass the content into the universal wrapper
  return wrapDocument({
    title: "Salary Payslip",
    content: payslipContent
  });
}
