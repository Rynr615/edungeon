import { StyleSheet } from "react-native";
export const colors = {
  ink: "#1b1410",
  panel: "#dde1e6",
  muted: "#626a73",
  yellow: "#f1c21b",
  option: "#a2a9b0",
  green: "#22a853",
  red: "#e53557",
};
export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 24, gap: 18, paddingBottom: 36 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  panel: {
    backgroundColor: colors.panel,
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  title: { fontSize: 23, fontWeight: "800", color: colors.ink },
  text: {
    fontFamily: "monospace",
    fontSize: 14,
    color: colors.ink,
    lineHeight: 21,
  },
  muted: { color: colors.muted, fontSize: 13, lineHeight: 20 },
  label: { fontFamily: "monospace", fontSize: 12, color: colors.muted },
  button: {
    backgroundColor: colors.ink,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    minHeight: 50,
    justifyContent: "center",
  },
  buttonText: { color: "white", fontWeight: "700", fontSize: 15 },
  error: { color: "#b91c1c", fontSize: 14, lineHeight: 21 },
  pill: {
    backgroundColor: colors.ink,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
});
