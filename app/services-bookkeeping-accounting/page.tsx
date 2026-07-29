import type { Metadata } from "next";
import ServicePageLayout from "../components/ServicePageLayout";

export const metadata: Metadata = {
  title: "Bookkeeping & Accounting | Corvanta Virtual Solutions",
  description:
    "Your bookkeeping VA keeps your finances organised and up to date, so tax time and board meetings are never a scramble.",
};

export default function BookkeepingAccountingPage() {
  return (
    <ServicePageLayout
      title="Bookkeeping & Accounting"
      headline="Clean books. Clear numbers. Confident decisions."
      lead="Your bookkeeping VA keeps your finances organised and up to date, so tax time and board meetings are never a scramble."
      color="#EA580C"
      bg="rgba(234,88,12,0.10)"
      includes={[
        {
          title: "Invoicing & Billing",
          body: "Create and send invoices, chase overdue payments, and track what's outstanding.",
        },
        {
          title: "Expense Tracking",
          body: "Categorise and reconcile every expense so your books stay clean month to month.",
        },
        {
          title: "Bank Reconciliation",
          body: "Match your records to bank statements and flag any discrepancies early.",
        },
        {
          title: "Monthly P&L Reports",
          body: "Clear profit-and-loss summaries that show you exactly where your money goes.",
        },
        {
          title: "Accounts Payable & Receivable",
          body: "Manage what you owe and what you're owed - nothing falls through the cracks.",
        },
        {
          title: "Payroll Preparation",
          body: "Compile hours, calculate pay, and prepare payroll data ready for your accountant.",
        },
      ]}
      whoFor={[
        "Freelancers & Contractors",
        "Small Businesses",
        "Startups",
        "Professional Service Firms",
      ]}
      ctaEyebrow="GET YOUR FINANCES IN ORDER"
      ctaHeadline="Tidy books. Less stress. More clarity."
      ctaSubtext="Stop dreading month-end. A bookkeeping VA keeps your numbers clean and your mind clear."
    />
  );
}
