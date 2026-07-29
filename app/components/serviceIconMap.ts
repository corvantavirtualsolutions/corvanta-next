import {
  Inbox,
  CalendarDays,
  Plane,
  FileText,
  ClipboardList,
  Database,
  Receipt,
  CreditCard,
  RefreshCw,
  TrendingUp,
  ArrowLeftRight,
  DollarSign,
  Mail,
  Tag,
  Globe,
  Search,
  Send,
  MessageCircle,
  MessageSquare,
  Package,
  BookOpen,
  BarChart2,
  ListChecks,
  FileSpreadsheet,
  ShieldCheck,
  Clock,
  PenTool,
  Users,
  Palette,
  AlertCircle,
  Key,
  UserCheck,
  Bug,
  Layers,
  ShoppingCart,
  RefreshCcw,
  Truck,
  Briefcase,
  Handshake,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const serviceIconMap: Record<string, LucideIcon> = {
  // Admin Support
  "Inbox & Email Management": Inbox,
  "Calendar & Scheduling": CalendarDays,
  "Travel Coordination": Plane,
  "Document Preparation": FileText,
  "Meeting Notes & Follow-ups": ClipboardList,
  "CRM Data Entry": Database,

  // Bookkeeping & Accounting
  "Invoicing & Billing": Receipt,
  "Expense Tracking": CreditCard,
  "Bank Reconciliation": RefreshCw,
  "Monthly P&L Reports": TrendingUp,
  "Accounts Payable & Receivable": ArrowLeftRight,
  "Payroll Preparation": DollarSign,

  // Content & Copywriting
  "Blog & Article Writing": FileText,
  "Email Campaigns": Mail,
  "Product Descriptions": Tag,
  "Website Copy": Globe,
  "SEO Optimisation": Search,
  "Newsletter Management": Send,

  // Customer Service
  "Email Support": Mail,
  "Live Chat Management": MessageCircle,
  "Social Media DMs": MessageSquare,
  "Order Issue Resolution": Package,
  "FAQ & Knowledge Base": BookOpen,
  "Customer Feedback Tracking": BarChart2,

  // Data Entry & Research
  "Lead List Building": ListChecks,
  "CRM Data Entry & Cleanup": Database,
  "Market Research": TrendingUp,
  "Spreadsheet Management": FileSpreadsheet,
  "Data Verification": ShieldCheck,
  "Report Generation": BarChart2,

  // Social Media Management
  "Content Calendar Creation": CalendarDays,
  "Post Scheduling": Clock,
  "Caption & Hashtag Writing": PenTool,
  "Community Management": Users,
  "Graphic Coordination": Palette,
  "Performance Reporting": BarChart2,

  // Executive Assistance
  "Complex Calendar Management": CalendarDays,
  "Meeting Prep & Agendas": ClipboardList,
  "Board & Investor Materials": Briefcase,
  "Internal Communications": MessageSquare,
  "Vendor & Partner Coordination": Handshake,
  "Expense Reports": Receipt,

  // E-commerce Support
  "Order Processing & Tracking": Package,
  "Product Listing Creation": Tag,
  "Inventory Management": Layers,
  "Marketplace Account Management": ShoppingCart,
  "Returns & Refund Handling": RefreshCcw,
  "Supplier Coordination": Truck,

  // Technical Support
  "Ticket Triage & Routing": AlertCircle,
  "Password & Account Support": Key,
  "Customer Onboarding": UserCheck,
  "Knowledge Base Updates": BookOpen,
  "Bug Reporting & Logging": Bug,
  "Live Chat Support": MessageCircle,
};
