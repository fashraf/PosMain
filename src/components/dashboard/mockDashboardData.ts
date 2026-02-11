// Dashboard mock data — swap these with real Supabase queries later

export interface KPIData {
  label: string;
  value: string;
  numericValue: number;
  target: number;
  percentage: number;
  trend: string;
  trendDirection: "up" | "down";
  targetLabel: string;
  color: string;
}

export interface QuickStat {
  label: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down";
}

export interface HourlyRevenue {
  hour: string;
  revenue: number;
  yesterday: number;
}

export interface BranchContribution {
  name: string;
  percentage: number;
  revenue: number;
}

export interface StaffMetrics {
  scheduled: number;
  clocked: number;
  overtime: number;
  attendance: number;
  absenteeism: number;
  salesPerHour: number;
  avgTip: number;
  topBranch: string;
  topBranchSalesPerHour: number;
}

export interface KeyMetric {
  label: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down" | "neutral";
  icon: string;
}

export interface DashboardAlert {
  type: "warning" | "success" | "action";
  message: string;
}

export const kpiData: KPIData[] = [
  {
    label: "Total Revenue",
    value: "SAR 23,650",
    numericValue: 23650,
    target: 25400,
    percentage: 93,
    trend: "+15% vs yesterday",
    trendDirection: "up",
    targetLabel: "93% of daily target",
    color: "#32c080",
  },
  {
    label: "Avg Check",
    value: "SAR 95.2",
    numericValue: 95.2,
    target: 90,
    percentage: 100,
    trend: "+4% WoW",
    trendDirection: "up",
    targetLabel: "Strong upsell",
    color: "#32c080",
  },
  {
    label: "Order Prep Time",
    value: "6.9 min",
    numericValue: 6.9,
    target: 7.5,
    percentage: 92,
    trend: "Target <7.5",
    trendDirection: "up",
    targetLabel: "Excellent",
    color: "#64b4e0",
  },
  {
    label: "Customer Sat Score",
    value: "4.65 / 5",
    numericValue: 4.65,
    target: 5,
    percentage: 93,
    trend: "Target >4.6",
    trendDirection: "up",
    targetLabel: "Very Good",
    color: "#32c080",
  },
];

export const quickStats: QuickStat[] = [
  { label: "Orders", value: "1,580" },
  { label: "Guests", value: "2,790" },
  { label: "Online+Delivery Share", value: "25%", trend: "↑10% WoW", trendDirection: "up" },
];

export const hourlyRevenue: HourlyRevenue[] = [
  { hour: "08", revenue: 1200, yesterday: 1400 },
  { hour: "09", revenue: 2800, yesterday: 2600 },
  { hour: "10", revenue: 4100, yesterday: 3800 },
  { hour: "11", revenue: 6500, yesterday: 5500 },
  { hour: "12", revenue: 11200, yesterday: 9000 },
  { hour: "13", revenue: 15800, yesterday: 13000 },
  { hour: "14", revenue: 19200, yesterday: 16500 },
  { hour: "15", revenue: 20100, yesterday: 18000 },
  { hour: "16", revenue: 21400, yesterday: 20000 },
  { hour: "17", revenue: 22000, yesterday: 21500 },
  { hour: "18", revenue: 22800, yesterday: 22500 },
  { hour: "19", revenue: 23200, yesterday: 23500 },
  { hour: "20", revenue: 23500, yesterday: 24500 },
  { hour: "21", revenue: 23600, yesterday: 25000 },
  { hour: "22", revenue: 23650, yesterday: 25400 },
];

export const branchContribution: BranchContribution[] = [
  { name: "Riyadh Mall", percentage: 40, revenue: 9460 },
  { name: "Downtown", percentage: 24, revenue: 5676 },
  { name: "Jeddah", percentage: 18, revenue: 4257 },
  { name: "Dammam", percentage: 10, revenue: 2365 },
  { name: "Khobar", percentage: 8, revenue: 1892 },
];

export const staffMetrics: StaffMetrics = {
  scheduled: 290,
  clocked: 295,
  overtime: 14,
  attendance: 94,
  absenteeism: 3.0,
  salesPerHour: 152,
  avgTip: 14.5,
  topBranch: "Riyadh Mall",
  topBranchSalesPerHour: 168,
};

export const keyMetrics: KeyMetric[] = [
  { label: "Order Accuracy", value: "98.2%", trend: "+0.5%", trendDirection: "up", icon: "target" },
  { label: "Complaint Resolution", value: "<15 min: 92%", trend: "+3%", trendDirection: "up", icon: "clock" },
  { label: "Repeat Guest Rate", value: "~21%", trend: "+2%", trendDirection: "up", icon: "users" },
  { label: "App Orders Growth", value: "+24% WoW", trend: "Strong", trendDirection: "up", icon: "smartphone" },
  { label: "Peak Hour Contribution", value: "29%", trend: "of daily total", trendDirection: "neutral", icon: "zap" },
  { label: "Top Category", value: "Mains 44%", trend: "Leading", trendDirection: "neutral", icon: "utensils" },
];

export const alerts: DashboardAlert[] = [
  { type: "warning", message: "Khobar service speed lagging (prep time 8.1 min) – check kitchen staffing" },
  { type: "warning", message: "Jeddah online share low – push delivery promotions" },
  { type: "success", message: "Riyadh Mall dominating in avg check & server productivity" },
  { type: "action", message: "Prep for dinner surge – monitor app order influx from 17:00" },
];
