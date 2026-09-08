export const colors = {
  background: "#F4F7F6",
  card: "#FFFFFF",
  primary: "#0F766E",
  primaryLight: "#E5F3F1",
  primaryMuted: "#BFE3DE",
  textPrimary: "#18302F",
  textSecondary: "#58706E",
  textMuted: "#91A4A1",
  border: "#D8E4E1",
  success: "#10B981",
  successLight: "#D1FAE5",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  error: "#EF4444",
  errorLight: "#FEE2E2",
  shadow: "#18302F",

  subjectMath: "#DBEAFE",
  subjectScience: "#D1FAE5",
  subjectEnglish: "#FCE7F3",
  subjectHistory: "#FEF3C7",
  subjectGeography: "#CCFBF1",
  subjectDefault: "#E0E7FF",

  class1: "#DBEAFE",
  class2: "#D1FAE5",
  class3: "#FCE7F3",
  class4: "#FEF3C7",
  class5: "#CCFBF1",
  class6: "#E0E7FF",
  class7: "#FED7AA",
  class8: "#CFFAFE",
  class9: "#F3E8FF",
  class10: "#FECACA",
  class11: "#E0F2FE",
  class12: "#DCFCE7",
  classDefault: "#E0E7FF",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 20,
  pill: 999,
};

export const typography = {
  h1: {
    fontSize: 36,
    fontWeight: "800" as const,
    lineHeight: 44,
  },
  h2: {
    fontSize: 30,
    fontWeight: "700" as const,
    lineHeight: 38,
  },
  h3: {
    fontSize: 24,
    fontWeight: "700" as const,
    lineHeight: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "700" as const,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
  },
  bodySm: {
    fontSize: 15,
    fontWeight: "400" as const,
    lineHeight: 22,
  },
  caption: {
    fontSize: 14,
    fontWeight: "500" as const,
    lineHeight: 20,
  },
  captionSm: {
    fontSize: 13,
    fontWeight: "500" as const,
    lineHeight: 18,
  },
  overline: {
    fontSize: 12,
    fontWeight: "600" as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
};

export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  xl: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
};

export const getSubjectColor = (subjectName: string): string => {
  const name = subjectName.toLowerCase();
  if (name.includes("math")) return colors.subjectMath;
  if (
    name.includes("science") ||
    name.includes("physics") ||
    name.includes("chemistry") ||
    name.includes("biology")
  )
    return colors.subjectScience;
  if (
    name.includes("english") ||
    name.includes("hindi") ||
    name.includes("language")
  )
    return colors.subjectEnglish;
  if (name.includes("history") || name.includes("social"))
    return colors.subjectHistory;
  if (name.includes("geo")) return colors.subjectGeography;
  return colors.subjectDefault;
};

export const getClassColor = (classNumber: number): string => {
  const colorMap: Record<number, string> = {
    1: colors.class1,
    2: colors.class2,
    3: colors.class3,
    4: colors.class4,
    5: colors.class5,
    6: colors.class6,
    7: colors.class7,
    8: colors.class8,
    9: colors.class9,
    10: colors.class10,
    11: colors.class11,
    12: colors.class12,
  };
  return colorMap[classNumber] || colors.classDefault;
};

export const screenPadding = {
  paddingHorizontal: spacing.xl,
};
