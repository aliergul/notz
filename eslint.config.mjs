import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "app/generated/", // Prisma'nın oluşturduğu klasörü hariç tut
      // İhtiyaca göre diğer ignore'lar:
      // "node_modules/",
      // ".next/",
      // "build/",
      // "dist/",
    ],
  },
];

export default eslintConfig;
