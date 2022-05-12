const device = {
  desktop: "@media screen and (min-width: 1241px)",
  tablet: "@media screen and (max-width: 1240px)",
  mobile: "@media screen and (max-width: 500px)",
};

const colors = {
  white: "#FFFFFF",
  black: "#222222",
  headerBgColor: "#F9F9F9",
  lightestGrey: "#F9F9F9",

  // 4 main colors
  green: "#92A094",
  blue: "#567FE8",
  darkBlue: "#798996",
  warmGrey: "#A8A9AB",
  pink: "#dc7487",
  errorMsg: "red",
  yellow: "#F0F354",

  //btn
  lightGrey: "#F4F6F9",
  mediumGrey: "#888888",

  // add btn
  darkGrey: "#505050",
  placeHolder: "#666666",
};

const fontWeight = {
  extraBold: 800,
  semiExtraBold: 700,
  semiBold: 600,
  regular: 400,
};

const calRem = (size) => `${size / 16}rem`;

const fontSize = {
  12: calRem(12),
  14: calRem(14),
  18: calRem(18),
  20: calRem(20),
  30: calRem(30),
  40: calRem(40),

  //모바일 폰트
  11: calRem(11),
  16: calRem(16),
  22: calRem(22),
  28: calRem(28),
};

const theme = {
  device,
  colors,
  fontSize,
  fontWeight,
  calRem,
};

export default theme;
