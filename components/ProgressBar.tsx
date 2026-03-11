import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

interface ProgressBarProps {
  progress: number;
  total: number;
  color?: string;
  showPercentage?: boolean;
}

export function ProgressBar({
  progress,
  total,
  color = Colors.primary,
  showPercentage = true,
}: ProgressBarProps) {
  const percentage = Math.min((progress / total) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
      {showPercentage && (
        <Text style={styles.text}>{Math.round(percentage)}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
    minWidth: 40,
    textAlign: "right",
    fontFamily: "Poppins",
  },
});
