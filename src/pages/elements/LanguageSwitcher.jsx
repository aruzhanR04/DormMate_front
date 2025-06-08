// src/components/LanguageSwitcher.jsx
import React from "react";
import { useI18n } from "../../i18n/I18nContext";

export const LanguageSwitcher = () => {
  const { lang, setLang } = useI18n();

  const containerStyle = {
    display: "inline-block",
    position: "relative",
    fontFamily: "sans-serif",
  };

  const selectStyle = {
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    padding: "6px 30px 6px 12px",
    fontSize: "14px",
    lineHeight: 1.2,
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#fff",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l5 6 5-6H0z' fill='%23666'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
    cursor: "pointer",
    transition: "border-color 0.2s ease"
  };

  const hoverFocusStyle = {
    borderColor: "#888",
    outline: "none"
  };

  // merge base and hover/focus styles on interaction
  const [isHovered, setHovered] = React.useState(false);
  const [isFocused, setFocused] = React.useState(false);
  const combinedStyle = {
    ...selectStyle,
    ...(isHovered || isFocused ? hoverFocusStyle : {})
  };

  return (
    <div style={containerStyle}>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        aria-label="Select language"
        style={combinedStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <option value="ru">Русский</option>
        <option value="kk">Қазақша</option>
        <option value="en">English</option>
      </select>
    </div>
  );
};
