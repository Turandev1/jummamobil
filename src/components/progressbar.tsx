// ProgressBar.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, I18nManager } from "react-native";

type Props = {
  value: number; // dolu kısım (ör: 400)
  max: number; // toplam (ör: 1000)
  height?: number; // çubuğun kalınlığı
  color?: string; // dolu rengin
  backgroundColor?: string; // arkaplan rengi
  rounded?: boolean; // köşeleri yuvarla
  showLabel?: boolean; // yüzde/metin göster
  animate?: boolean; // animasyon açılsın mı
  duration?: number; // animasyon süresi (ms)
  formatLabel?: (pct: number, value: number, max: number) => string; // özel etiket
};

const ProgressBar: React.FC<Props> = ({
  value,
  max,
  height =14,
  color = "#3b82f6",
  backgroundColor = "rgba(0,0,0,0.08)",
  rounded = true,
  showLabel = true,
  animate = true,
  duration = 600,
  formatLabel,
}) => {
  const pct = Math.max(0, Math.min(100, (value / Math.max(max, 1)) * 100));
  const anim = useRef(new Animated.Value(pct)).current;

  useEffect(() => {
    if (animate) {
      Animated.timing(anim, {
        toValue: pct,
        duration,
        useNativeDriver: false,
      }).start();
    } else {
      anim.setValue(pct);
    }
  }, [pct, animate, duration, anim]);

  const borderRadius = rounded ? height / 2 : 6;

  return (
    <View style={{ gap: 6 }}>
      <View
        style={[
          styles.track,
          { height, backgroundColor, borderRadius, overflow: "hidden" },
        ]}
        accessible
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max, now: value }}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: color,
              width: anim.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
              borderRadius,
              // RTL desteği (istersen kaldır)
              transform: I18nManager.isRTL ? [{ scaleX: -1 }] : undefined,
            },
          ]}
        />
      </View>

      {showLabel && (
        <Text style={styles.label}>
          {formatLabel
            ? formatLabel(pct, value, max)
            : `${Math.round(pct)}% (${value}/${max})`}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  track: { width: "100%", justifyContent: "center" },
  fill: { height: "100%" },
  label: { fontSize: 12, opacity: 0.8 },
});

export default ProgressBar;
