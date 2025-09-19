import type { TStep } from "@/shared/components/ui/stepper";
import { Shield, Building2, Phone, FileText, Users, Plane } from "lucide-react";

export const CONST_SIGNUP_STEP: TStep[] = [
  {
    id: "0",
    title: "Create Account",
    description: "Email, password, and profile details.",
    icon: Shield,
  },
  {
    id: "1",
    title: "Organization Setup",
    description: "Name and logo for your org.",
    icon: Building2,
  },
  {
    id: "3",
    title: "Invite Team (Optional)",
    description: "Add teammates or skip.",
    icon: Users,
  },
  {
    id: "4",
    title: "Takeoff",
    description: "All set for the journey.",
    icon: Plane,
  },
];

export const CONST_COUNTRIES: { value: string; label: string }[] = [
  { value: "VN", label: "Vietnam" },
  { value: "US", label: "United States" },
  { value: "CN", label: "China" },
  { value: "IN", label: "India" },
  { value: "JP", label: "Japan" },
  { value: "KR", label: "South Korea" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "BR", label: "Brazil" },
  { value: "RU", label: "Russia" },
  { value: "ID", label: "Indonesia" },
  { value: "MX", label: "Mexico" },
  { value: "IT", label: "Italy" },
  { value: "ES", label: "Spain" },
  { value: "TH", label: "Thailand" },
];

export const TIMEZONES: { value: string; label: string }[] = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "Pacific/Honolulu", label: "Hawaii (GMT-10)" },
  { value: "America/Los_Angeles", label: "Pacific Time (US & Canada)" },
  { value: "America/Denver", label: "Mountain Time (US & Canada)" },
  { value: "America/Chicago", label: "Central Time (US & Canada)" },
  { value: "America/New_York", label: "Eastern Time (US & Canada)" },
  { value: "America/Sao_Paulo", label: "Brazil (GMT-3)" },
  { value: "Europe/London", label: "London (GMT+0)" },
  { value: "Europe/Paris", label: "Central European Time (GMT+1)" },
  { value: "Europe/Moscow", label: "Moscow (GMT+3)" },
  { value: "Asia/Dubai", label: "Dubai (GMT+4)" },
  { value: "Asia/Karachi", label: "Pakistan (GMT+5)" },
  { value: "Asia/Bangkok", label: "Bangkok (GMT+7)" },
  { value: "Asia/Ho_Chi_Minh", label: "Vietnam (GMT+7)" },
  { value: "Asia/Shanghai", label: "China Standard Time (GMT+8)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (GMT+9)" },
  { value: "Australia/Sydney", label: "Sydney (GMT+10)" },
  { value: "Pacific/Auckland", label: "New Zealand (GMT+12)" },
];

export const ORGANIZATION_TYPES: { value: string; label: string }[] = [
  { label: "School", value: "School" },
  { label: "Private Center", value: "Private Center" },
  { label: "University", value: "University" },
  { label: "Company", value: "Company" },
];
