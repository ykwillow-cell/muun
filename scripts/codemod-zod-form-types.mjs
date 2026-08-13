import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [
  "client/src/pages/Astrology.tsx",
  "client/src/pages/CareerFortune.tsx",
  "client/src/pages/DailyFortune.tsx",
  "client/src/pages/HybridCompatibility.tsx",
  "client/src/pages/LifelongSaju.tsx",
  "client/src/pages/LuckyLunch.tsx",
  "client/src/pages/Manselyeok.tsx",
  "client/src/pages/MovingFortune.tsx",
  "client/src/pages/Naming.tsx",
  "client/src/pages/Tojeong.tsx",
  "client/src/pages/YearlyFortune.tsx",
];

for (const relativePath of files) {
  const fullPath = path.join(root, relativePath);
  const source = fs.readFileSync(fullPath, "utf8");
  let updated = source.replace(
    "type FormValues = z.infer<typeof formSchema>;",
    "type FormInput = z.input<typeof formSchema>;\ntype FormValues = z.output<typeof formSchema>;",
  );
  updated = updated.replace("useForm<FormValues>({", "useForm<FormInput, unknown, FormValues>({");

  if (updated === source) {
    throw new Error(`No expected form type pattern found in ${relativePath}`);
  }
  fs.writeFileSync(fullPath, updated);
}
