// src/config/features.js
const bool = (v, def = "false") => (String(v ?? def).toLowerCase() === "true");

export const features = {
  summary:  bool(process.env.REACT_APP_FEATURE_SUMMARY,  "true"),
  jeu:      bool(process.env.REACT_APP_FEATURE_JEU,      "true"),
  dossiers: bool(process.env.REACT_APP_FEATURE_DOSSIERS, "true"),
  carte:    bool(process.env.REACT_APP_FEATURE_CARTE,    "false"),
  sources:  bool(process.env.REACT_APP_FEATURE_SOURCES,  "false"),
};
