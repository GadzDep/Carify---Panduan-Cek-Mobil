import { RISK_COLORS, RiskLevel } from "@/types/inspection";
import { StyleSheet, Text, View } from "react-native";

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "small" | "medium";
}

export function RiskBadge({ level, size = "small" }: RiskBadgeProps) {
  const labels: Record<RiskLevel, string> = {
    low: "Rendah",
    medium: "Sedang",
    high: "Tinggi",
    critical: "Kritis",
  };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: RISK_COLORS[level] + "20" },
        size === "medium" && styles.badgeMedium,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: RISK_COLORS[level] }]} />
      <Text style={[styles.text, { color: RISK_COLORS[level] }]}>
        {labels[level]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeMedium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "PoppinsBold",
  },
});
