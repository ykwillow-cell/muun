import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ChevronLeft, Zap, User, Sun, Calendar } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getDailyFortune } from "@/lib/dailyFortune";
import { generatePrescriptionFortune, PrescriptionFortune } from "@/lib/prescriptionFortune";
import { convertToSolarDate } from "@/lib/lunar-converter";
import DatePickerInput from "@/components/DatePickerInput";
import { PrescriptionHeader } from "@/components/prescription/PrescriptionHeader";
import { PrescriptionActions } from "@/components/prescription/PrescriptionActions";
import { PrescriptionMissions } from "@/components/prescription/PrescriptionMissions";
import { PrescriptionAnalysis } from "@/components/prescription/PrescriptionAnalysis";
import { PrescriptionShare } from "@/components/prescription/PrescriptionShare";

const formSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  calendarType: z.enum(["solar", "lunar"]).default("solar"),
  isLeapMonth: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function DailyFortunePrescription() {
  const [prescription, setPrescription] = useState<PrescriptionFortune | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [userName, setUserName] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "female",
      birthDate: "2000-01-01",
      calendarType: "solar",
      isLeapMonth: false,
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("muun_user_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      form.reset({
        name: parsed.name || "",
        gender: parsed.gender || "female",
        birthDate: parsed.birthDate || "2000-01-01",
        calendarType: parsed.calendarType || "solar",
        isLeapMonth: parsed.isLeapMonth || false,
      });
    }
  }, [form]);

  const onSubmit = (data: FormValues) => {
    const existingData = localStorage.getItem("muun_user_data");
    const existing = existingData ? JSON.parse(existingData) : {};
    const mergedData = { ...existing, ...data };
    localStorage.setItem("muun_user_data", JSON.stringify(mergedData));

    setUserName(data.name);
    const date = convertToSolarDate(
      data.birthDate,
      "12:00",
      data.calendarType,
      data.isLeapMonth
    );
    const basicFortune = getDailyFortune(date, data.gender);
    const prescriptionFortune = generatePrescriptionFortune(
      basicFortune,
      data.gender
    );
    setPrescription(prescriptionFortune);
    setShowResult(true);
    window.scrollTo(0, 0);
  };

  // 입력 화면
  if (!showResult) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className="container mx-auto max-w-[1280px] px-4 h-14 flex items-center">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-base md:text-lg font-bold text-white">
              오늘의 운세 처방전
            </h1>
          </div>
        </header>

        <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-5 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-2xl mx-auto space-y-5"
          >
            {/* Hero Section */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-xl">
                <Sun className="w-3 h-3 text-yellow-400" />
                <span className="text-[10px] md:text-xs font-bold tracking-wider text-yellow-400 uppercase">
                  오늘 하루의 기운
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                오늘의 운세 처방전
              </h2>
              <p className="text-muted-foreground text-xs md:text-sm">
                당신만을 위한 맞춤형 처방전을 받아보세요
              </p>
            </div>

            {/* Input Form Card */}
            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-yellow-400" />
                  </div>
                  정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name & Gender Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="name"
                        className="text-white text-base md:text-sm font-medium flex items-center gap-1.5"
                      >
                        <User className="w-3.5 h-3.5 text-yellow-400" />
                        이름
                      </Label>
                      <Input
                        id="name"
                        placeholder="이름을 입력해주세요"
                        {...form.register("name")}
                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-yellow-500/50 focus:border-yellow-500 transition-all text-base md:text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-yellow-400" />
                        성별
                      </Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch("gender")}
                        onValueChange={(value) => {
                          if (value)
                            form.setValue("gender", value as "male" | "female");
                        }}
                        className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                      >
                        <ToggleGroupItem
                          value="male"
                          className="h-full rounded-lg data-[state=on]:bg-yellow-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm"
                        >
                          남성
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="female"
                          className="h-full rounded-lg data-[state=on]:bg-yellow-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm"
                        >
                          여성
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="birthDate"
                      className="text-white text-base md:text-sm font-medium flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5 text-yellow-400" />
                      생년월일
                    </Label>
                    <DatePickerInput
                      id="birthDate"
                      {...form.register("birthDate")}
                      accentColor="yellow"
                    />
                  </div>

                  {/* Calendar Type */}
                  <div className="space-y-1.5">
                    <Label className="text-white text-base md:text-sm font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-yellow-400" />
                      날짜 구분
                    </Label>
                    <ToggleGroup
                      type="single"
                      value={form.watch("calendarType")}
                      onValueChange={(value) => {
                        if (value)
                          form.setValue("calendarType", value as "solar" | "lunar");
                      }}
                      className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                    >
                      <ToggleGroupItem
                        value="solar"
                        className="h-full rounded-lg data-[state=on]:bg-yellow-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm"
                      >
                        양력
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="lunar"
                        className="h-full rounded-lg data-[state=on]:bg-yellow-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-base md:text-sm"
                      >
                        음력
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  {/* Leap Month */}
                  {form.watch("calendarType") === "lunar" && (
                    <div className="flex items-center gap-2 px-1">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          {...form.register("isLeapMonth")}
                          className="w-4 h-4 rounded border-white/20 bg-white/5 accent-yellow-500"
                        />
                        <span className="text-base md:text-sm text-white/80 group-hover:text-yellow-400 transition-colors">
                          윤달인 경우 체크
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold text-sm md:text-base rounded-xl shadow-lg shadow-yellow-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    오늘의 처방전 확인하기
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  // 결과 화면
  if (!prescription) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-8 md:py-12">
      <div className="max-w-2xl mx-auto px-4 md:px-6 space-y-8">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            오늘의 운세 처방전
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResult(false)}
            className="text-xs md:text-sm"
          >
            다시 입력
          </Button>
        </motion.div>

        {/* 처방전 컴포넌트들 */}
        <PrescriptionHeader fortune={prescription} userName={userName} />
        <PrescriptionActions fortune={prescription} />
        <PrescriptionMissions fortune={prescription} />
        <PrescriptionAnalysis fortune={prescription} />

        {/* 공유 버튼 */}
        <PrescriptionShare fortune={prescription} userName={userName} />
      </div>
    </div>
  );
}
