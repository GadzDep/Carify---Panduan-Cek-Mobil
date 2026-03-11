import { Colors } from "@/constants/colors";
import { getScoreColor } from "@/utils/calculations";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export function ScoreRing({
  score,
  size = 120,
  strokeWidth = 10,
  showLabel = true,
}: ScoreRingProps) {
  const color = getScoreColor(score);

  // Rumus matematika untuk keliling lingkaran
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Menghitung area kosong yang tidak perlu diisi warna
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Cincin SVG */}
      <Svg width={size} height={size} style={styles.svgPosition}>
        {/* Lingkaran Background (Abu-abu) */}
        <Circle
          stroke={Colors.border}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Lingkaran Skor (Berwarna) */}
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" // Membuat ujung garis menjadi tumpul/membulat
          originX={size / 2}
          originY={size / 2}
          rotation="-90" // Memutar titik awal ke jam 12 atas
        />
      </Svg>

      {/* Teks di Tengah */}
      <View style={styles.content}>
        <Text style={[styles.score, { color, fontSize: size * 0.28 }]}>
          {Math.round(score)}
        </Text>
        {showLabel && (
          <Text style={[styles.label, { fontSize: size * 0.12 }]}>Skor</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  svgPosition: {
    position: "absolute",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  score: {
    fontWeight: "800",
    fontFamily: "PoppinsBold", // Pastikan font family sesuai dengan yang kamu pakai
  },
  label: {
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
    fontFamily: "PoppinsMedium", // Pastikan font family sesuai
  },
});
