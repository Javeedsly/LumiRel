import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript"
  ),

  {
    rules: {
      // Mövcud layihədə çoxlu any istifadə olunur.
      // Build-i dayandırmasın, warning kimi göstərilsin.
      "@typescript-eslint/no-explicit-any": "warn",

      // İstifadə olunmayan dəyişənlər build-i dayandırmasın.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // JSX daxilində apostrof build-i dayandırmasın.
      "react/no-unescaped-entities": "warn",

      // Dependency problemləri warning olaraq qalsın.
      "react-hooks/exhaustive-deps": "warn",

      // <img> istifadəsi warning olaraq qalsın.
      "@next/next/no-img-element": "warn",

      // Həqiqi hook qaydaları isə error olaraq qalsın.
      "react-hooks/rules-of-hooks": "error",
    },
  },
];

export default eslintConfig;