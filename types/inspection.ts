export type InspectionMode = "buy";

export type AnswerValue = "yes" | "doubt" | "no";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface ChecklistItem {
  id: string;
  question: string;
  tooltip: string;
  riskIndicator: RiskLevel;
  answer?: AnswerValue;
  note?: string;
  photoUri?: string;
}

export interface ChecklistCategory {
  id: string;
  name: string;
  weight: number;
  icon: string;
  items: ChecklistItem[];
}

export interface CarData {
  brand: string;
  type: string;
  year: string;
  color: string;
  transmission: "manual" | "automatic";
  mileage: string;
  plateNumber: string;
}

export interface SellerTransparency {
  hasAccident: boolean;
  hasFlood: boolean;
  regularService: boolean;
  taxActive: boolean;
  readyForWorkshopCheck: boolean;
}

export interface Inspection {
  id: string;
  mode: InspectionMode;
  carData: CarData;
  sellerTransparency?: SellerTransparency;
  categories: ChecklistCategory[];

  status: "draft" | "completed"; // ⭐ tambahan untuk fitur draft

  createdAt: string;
  completedAt?: string;
}

export interface CategoryScore {
  categoryId: string;
  categoryName: string;
  weight: number;
  score: number;
  maxScore: number;
  percentage: number;
  weightedScore: number;
}

export interface InspectionResult {
  inspectionId: string;
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  status: "recommended" | "consider" | "negotiate" | "not_recommended";
  hasCriticalIssue: boolean;
  categoryScores: CategoryScore[];
  criticalIssues: string[];
  sellerIssues?: string[];
}

export const SCORE_VALUES: Record<AnswerValue, number> = {
  yes: 2,
  doubt: 1,
  no: 0,
};

export const CATEGORY_WEIGHTS = {
  exterior: 0.2,
  interior: 0.2,
  engine: 0.3,
  legal: 0.3,
};

export const RISK_COLORS: Record<RiskLevel, string> = {
  low: "#22C55E",
  medium: "#EAB308",
  high: "#F97316",
  critical: "#EF4444",
};

export const STATUS_LABELS: Record<
  string,
  { label: string; color: string; emoji: string }
> = {
  recommended: {
    label: "Sangat Direkomendasikan",
    color: "#22C55E",
    emoji: "🟢",
  },
  consider: { label: "Layak Dipertimbangkan", color: "#EAB308", emoji: "🟡" },
  negotiate: { label: "Perlu Negosiasi", color: "#F97316", emoji: "🟠" },
  not_recommended: {
    label: "Tidak Direkomendasikan",
    color: "#EF4444",
    emoji: "🔴",
  },
};
