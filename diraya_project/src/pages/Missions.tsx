import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles, RotateCcw, Target } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const EXAMPLE_TEXT =
  "الخلية هي الوحدة البنائية والوظيفية الأساسية لجميع الكائنات الحية. تتكون الخلية من غشاء بلازمي وسيتوبلازم ونواة. تحتوي النواة على المادة الوراثية DNA التي تتحكم في جميع أنشطة الخلية.";

interface Mission {
  goal: string;
  body: string;
}

function parseMissions(text: string): Mission[] {
  const missions: Mission[] = [];
  const blocks = text.split(/\n(?=[١٢٣٤٥٦٧٨٩\d])/);
  
  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length === 0) continue;
    
    const firstLine = lines[0].replace(/^[١٢٣٤٥٦٧٨٩\d]+[-–.)]\s*/, '').trim();
    const goalMatch = firstLine.match(/^(ستتعلم الآن:[^،.]*[،.]?)/);
    
    if (goalMatch) {
      const goal = goalMatch[1].trim();
      const body = lines.slice(1).join(' ').trim();
      missions.push({ goal, body });
    } else {
      const body = lines.slice(1).join(' ').trim();
      missions.push({ goal: firstLine, body });
    }
  }
  
  return missions.length > 0 ? missions : [{ goal: "", body: text }];
}


const Missions = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode: "missions" }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "حدث خطأ في الاتصال");
      }
      const data = await response.json();
      setMissions(parseMissions(data.result));
      setCurrent(0);
      setCompleted(false);
      setShowResults(true);
    } catch (error) {
      alert("حدث خطأ: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setMissions([]);
    setText("");
    setCurrent(0);
    setCompleted(false);
  };

  const total = missions.length;
  const progress = total > 0 ? ((current + 1) / total) * 100 : 0;

  const handleNext = () => {
    if (current < total - 1) setCurrent((p) => p + 1);
    else setCompleted(true);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent((p) => p - 1);
  };

  return (
    <div className="bg-background min-h-screen py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
            >
              {/* Page header */}
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 bg-amber/[0.08] text-amber text-[11px] font-bold px-4 py-1.5 rounded-full mb-4 border border-amber/10">
                  <Target className="w-3 h-3" />
                  أداة المهمات
                </div>
                <h1 className="text-navy font-extrabold text-[32px] mb-2 tracking-tight">
                  وضع المهمات
                </h1>
                <p className="text-teal/70 text-[15px]">
                  للطلاب الذين يحتاجون تقسيم المحتوى إلى خطوات واضحة
                </p>
              </div>

              {/* Input card */}
              <div className="card-premium rounded-2xl p-8">
                <label className="text-teal-dark font-bold text-[13px] block mb-3">
                  النص الأكاديمي
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="ألصق هنا المحتوى الذي تريد تحويله إلى مهمات..."
                  rows={7}
                  dir="rtl"
                  className="w-full bg-background border border-border rounded-xl p-4 font-tajawal text-[15px] text-navy placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-teal/15 focus:border-teal/30 resize-none transition-all duration-300"
                  style={{ lineHeight: 2.0, minHeight: "180px" }}
                />

                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setText(EXAMPLE_TEXT)}
                      className="border border-teal/20 text-teal-dark rounded-lg px-4 py-2 text-sm font-bold hover:bg-teal-light/50 hover:border-teal/30 transition-all duration-300"
                    >
                      مثال
                    </button>
                    <button
                      onClick={() => setText("")}
                      className="border border-border text-muted-foreground rounded-lg px-4 py-2 text-sm font-bold hover:bg-muted/50 transition-all duration-300"
                    >
                      مسح
                    </button>
                  </div>
                  <span className="text-muted-foreground/50 text-xs font-medium">{text.length} حرف</span>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !text.trim()}
                  className="w-full mt-5 btn-primary text-white font-bold rounded-xl py-4 text-[15px] disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none shine"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      جاري المعالجة...
                    </span>
                  ) : (
                    "◈ ابدأ وضع المهمات"
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
              className="max-w-[680px] mx-auto"
            >
              {completed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="card-premium rounded-2xl p-14 text-center"
                >
                  <div className="w-20 h-20 bg-success/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-success" />
                  </div>
                  <p className="text-success font-extrabold text-2xl mb-2">
                    أحسنت! أكملت جميع المهمات ✓
                  </p>
                  <p className="text-teal/60 mb-8 text-[15px]">لقد أتممت قراءة النص بنجاح</p>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 border border-teal/20 text-teal-dark rounded-xl px-7 py-3.5 font-bold hover:bg-teal-light/50 transition-all duration-300"
                  >
                    <RotateCcw className="w-4 h-4" />
                    نص جديد
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* Progress Header */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1.5 text-teal-dark font-bold text-sm">
                        <Target className="w-4 h-4" />
                        المهمة {current + 1} من {total}
                      </span>
                      <span className="text-muted-foreground/40 text-xs font-medium">
                        {Math.round(progress)}% مكتمل
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-teal-light overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-l from-teal-dark to-teal"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      />
                    </div>
                  </div>

                  {/* Mission Card */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
                      className="card-premium rounded-2xl p-9"
                      style={{ minHeight: "280px" }}
                    >
                      <span className="inline-flex items-center gap-1.5 bg-teal-dark text-teal-light text-[11px] font-bold px-3.5 py-1.5 rounded-full mb-5">
                        <Sparkles className="w-3 h-3" />
                        مهمة تعلم
                      </span>

                      <p className="text-amber font-bold text-[18px] mb-5" style={{ lineHeight: 1.7 }}>
                        {missions[current].goal}
                      </p>

                      <div className="h-px bg-gradient-to-l from-transparent via-border to-transparent mb-5" />

                      {missions[current].body && (
                        <p
                          className="text-navy font-tajawal"
                          style={{ fontSize: "16px", lineHeight: 2.2 }}
                        >
                          {missions[current].body}
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex justify-between items-center mt-6">
                    <button
                      onClick={handleNext}
                      className={`px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                        current === total - 1
                          ? "bg-success text-white shadow-lg shadow-success/20"
                          : "btn-primary text-white"
                      }`}
                    >
                      {current === total - 1 ? "أكملت النص ✓" : "التالي ←"}
                    </button>
                    <button
                      onClick={handlePrev}
                      disabled={current === 0}
                      className="px-8 py-3.5 rounded-xl font-bold text-sm border border-teal/20 text-teal-dark transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-teal-light/50"
                    >
                      → السابق
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Missions;
