import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw, Copy, Check } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const EXAMPLE_TEXT =
  "الأيض الخلوي هو مجموعة التفاعلات الكيميائية الحيوية التي تحدث داخل الخلية الحية للحفاظ على الحياة. تشمل هذه العمليات الهدم والبناء حيث يتم تحويل الجزيئات الكبيرة إلى جزيئات أصغر لإنتاج الطاقة.";

interface WordInfo {
  word: string;
  sentenceIndex: number;
}

function flattenToWords(text: string): WordInfo[] {
  const sentences = text.split(/(?<=[.،؟!])\s*/);
  const words: WordInfo[] = [];
  sentences.forEach((sentence, si) => {
    sentence.split(/\s+/).forEach((w) => {
      if (w.trim()) words.push({ word: w.trim(), sentenceIndex: si });
    });
  });
  return words;
}

const SIZE_STEPS = [
  { active: 16, rest: 13 },
  { active: 21, rest: 15 },
  { active: 26, rest: 15 },
];

const AMOUNT_STEPS = [1, 3, 6, -1, -2];
const AMOUNT_LABELS = ["كلمة", "كلمات", "عدة كلمات", "نصف جملة", "جملة كاملة"];

const Simplify = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [simplifiedText, setSimplifiedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [sizeLevel, setSizeLevel] = useState(1);
  const [amountLevel, setAmountLevel] = useState(1);
  const [copied, setCopied] = useState(false);

  const words = useMemo(() => flattenToWords(simplifiedText), [simplifiedText]);

  const getHighlightRange = useCallback(
    (startIdx: number): [number, number] => {
      const amount = AMOUNT_STEPS[amountLevel];
      if (amount > 0) {
        return [startIdx, Math.min(startIdx + amount - 1, words.length - 1)];
      }
      if (amount === -1) {
        const si = words[startIdx]?.sentenceIndex;
        const sentenceWords = words
          .map((w, i) => ({ ...w, i }))
          .filter((w) => w.sentenceIndex === si);
        const half = Math.ceil(sentenceWords.length / 2);
        const startInSentence = sentenceWords.findIndex((w) => w.i >= startIdx);
        const end = Math.min(startInSentence + half - 1, sentenceWords.length - 1);
        return [startIdx, sentenceWords[end]?.i ?? startIdx];
      }
      const si = words[startIdx]?.sentenceIndex;
      let lastIdx = startIdx;
      for (let i = startIdx; i < words.length; i++) {
        if (words[i].sentenceIndex === si) lastIdx = i;
        else break;
      }
      return [startIdx, lastIdx];
    },
    [amountLevel, words]
  );

  const [highlightStart, highlightEnd] = useMemo(
    () => getHighlightRange(currentWordIndex),
    [currentWordIndex, getHighlightRange]
  );

  const handleSubmit = async () => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode: "simplify" }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "حدث خطأ في الاتصال");
      }
      const data = await response.json();
      setSimplifiedText(data.result);
      setCurrentWordIndex(0);
      setShowResults(true);
    } catch (error) {
      alert("حدث خطأ: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (highlightEnd < words.length - 1) {
      setCurrentWordIndex(highlightEnd + 1);
    }
  };

  const handlePrev = () => {
    if (currentWordIndex > 0) {
      const amount = AMOUNT_STEPS[amountLevel];
      if (amount > 0) {
        setCurrentWordIndex(Math.max(0, currentWordIndex - amount));
      } else {
        const currentSi = words[currentWordIndex]?.sentenceIndex;
        let prevStart = 0;
        for (let i = currentWordIndex - 1; i >= 0; i--) {
          if (words[i].sentenceIndex < currentSi) {
            const si = words[i].sentenceIndex;
            prevStart = words.findIndex((w) => w.sentenceIndex === si);
            break;
          }
        }
        setCurrentWordIndex(prevStart);
      }
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setSimplifiedText("");
    setText("");
    setCurrentWordIndex(0);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(simplifiedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isComplete = highlightEnd >= words.length - 1 && words.length > 0;
  const progress = words.length > 0 ? ((highlightEnd + 1) / words.length) * 100 : 0;
  const sizes = SIZE_STEPS[sizeLevel];

  return (
    <div className="bg-background min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
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
                <div className="inline-flex items-center gap-2 bg-teal/[0.07] text-teal-dark text-[11px] font-bold px-4 py-1.5 rounded-full mb-4 border border-teal/10">
                  <Sparkles className="w-3 h-3" />
                  أداة التبسيط
                </div>
                <h1 className="text-navy font-extrabold text-[32px] mb-2 tracking-tight">
                  تبسيط المصطلحات
                </h1>
                <p className="text-teal/70 text-[15px]">
                  للطلاب الذين يجدون صعوبة في المصطلحات الأكاديمية
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
                  placeholder="ألصق هنا النص الأكاديمي..."
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
                    "✦ بسّط النص"
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
              className="flex gap-5"
            >
              {/* Controls Panel */}
              <div className="w-28 shrink-0">
                <div className="card-premium rounded-2xl p-4 sticky top-20 flex flex-col items-center gap-5">
                  <p className="text-teal-dark font-bold text-[11px] text-center leading-tight">
                    إعدادات<br/>القراءة
                  </p>

                  {/* Size Slider — Vertical */}
                  <div className="flex flex-col items-center gap-2 pb-5 border-b border-border/50 w-full">
                    <span className="text-teal/60 text-[10px] font-medium">حجم النص</span>
                    <span className="text-navy font-extrabold text-base">A</span>
                    <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <input
                        type="range"
                        min={0}
                        max={2}
                        step={1}
                        value={sizeLevel}
                        onChange={(e) => setSizeLevel(Number(e.target.value))}
                        className="accent-teal-dark cursor-pointer"
                        style={{
                          writingMode: "vertical-lr" as const,
                          direction: "rtl",
                          width: "28px",
                          height: "100px",
                          appearance: "slider-vertical" as any,
                          WebkitAppearance: "slider-vertical" as any,
                        }}
                      />
                    </div>
                    <span className="text-navy text-[10px] opacity-40">a</span>
                  </div>

                  {/* Amount Slider — Vertical */}
                  <div className="flex flex-col items-center gap-2 w-full">
                    <span className="text-teal/60 text-[10px] font-medium">التمييز</span>
                    <span className="text-navy font-extrabold text-base">—</span>
                    <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <input
                        type="range"
                        min={0}
                        max={4}
                        step={1}
                        value={amountLevel}
                        onChange={(e) => {
                          setAmountLevel(Number(e.target.value));
                          setCurrentWordIndex(0);
                        }}
                        className="accent-teal-dark cursor-pointer"
                        style={{
                          writingMode: "vertical-lr" as const,
                          direction: "rtl",
                          width: "28px",
                          height: "100px",
                          appearance: "slider-vertical" as any,
                          WebkitAppearance: "slider-vertical" as any,
                        }}
                      />
                    </div>
                    <span className="text-navy text-[10px] opacity-30">·</span>
                    <span className="text-teal-dark text-[10px] font-bold bg-teal/[0.06] px-2 py-1 rounded-full text-center">
                      {AMOUNT_LABELS[amountLevel]}
                    </span>
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-1 border border-teal/20 text-teal-dark rounded-xl py-2 text-[11px] font-bold hover:bg-teal-light/50 transition-all duration-300"
                  >
                    <RotateCcw className="w-3 h-3" />
                    جديد
                  </button>
                </div>
              </div>

              {/* Reading Card */}
              <div className="flex-1">
                {isComplete && currentWordIndex >= words.length - 1 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="card-premium rounded-2xl p-12 text-center"
                  >
                    <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                      <Check className="w-8 h-8 text-success" />
                    </div>
                    <p className="text-success font-extrabold text-xl mb-2">
                      أحسنت! أكملت قراءة النص كاملاً ✓
                    </p>
                    <p className="text-muted-foreground text-sm mb-6">يمكنك البدء بنص جديد</p>
                    <button
                      onClick={handleReset}
                      className="border border-teal/20 text-teal-dark rounded-xl px-7 py-3 font-bold hover:bg-teal-light/50 transition-all duration-300"
                    >
                      ✦ نص جديد
                    </button>
                  </motion.div>
                ) : (
                  <div className="card-premium rounded-2xl p-7">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1.5 bg-teal/[0.07] text-teal-dark text-[11px] font-bold px-3 py-1.5 rounded-full border border-teal/10">
                        <Sparkles className="w-3 h-3" />
                        تبسيط المصطلحات
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleCopy}
                          className="text-muted-foreground/50 hover:text-teal-dark transition-colors p-1.5 rounded-lg hover:bg-teal/[0.05]"
                        >
                          {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <span className="text-teal/60 text-sm font-bold">
                          الكلمة {currentWordIndex + 1} من {words.length}
                        </span>
                      </div>
                    </div>

                    <p className="text-muted-foreground/40 text-[11px] mb-4 font-medium">
                      انقر على أي كلمة للتركيز عليها
                    </p>

                    {/* Progress */}
                    <div className="w-full h-1.5 rounded-full bg-teal-light overflow-hidden mb-6">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-l from-teal-dark to-teal"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      />
                    </div>

                    {/* Text */}
                    <div
                      className="bg-teal-light/60 border-r-4 border-teal rounded-xl p-6"
                      style={{ lineHeight: 2.8 }}
                      dir="rtl"
                    >
                      {words.map((w, i) => {
                        const isHighlighted = i >= highlightStart && i <= highlightEnd;
                        const isRead = i < highlightStart;

                        return (
                          <span
                            key={i}
                            onClick={() => setCurrentWordIndex(i)}
                            className="cursor-pointer transition-all duration-300 inline-block mx-1"
                            style={{
                              fontWeight: isHighlighted ? 700 : isRead ? 500 : 400,
                              color: isHighlighted
                                ? "hsl(220, 50%, 16%)"
                                : isRead
                                ? "hsl(193, 38%, 39%)"
                                : "hsl(193, 30%, 72%)",
                              fontSize: isHighlighted ? `${sizes.active}px` : `${sizes.rest}px`,
                              background: isHighlighted ? "hsl(30, 100%, 97%)" : "transparent",
                              borderRadius: isHighlighted ? "6px" : "0",
                              padding: isHighlighted ? "2px 6px" : "0",
                              boxShadow: isHighlighted ? "0 1px 4px rgba(0,0,0,0.04)" : "none",
                            }}
                          >
                            {w.word}
                          </span>
                        );
                      })}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-6">
                      <button
                        onClick={handleNext}
                        className={`px-7 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                          isComplete
                            ? "bg-success text-white shadow-lg shadow-success/20"
                            : "btn-primary text-white"
                        }`}
                      >
                        {isComplete ? "أكملت النص ✓" : "التالي ←"}
                      </button>
                      <button
                        onClick={handlePrev}
                        disabled={currentWordIndex === 0}
                        className="px-7 py-3 rounded-xl font-bold text-sm border border-teal/20 text-teal-dark transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-teal-light/50"
                      >
                        → السابق
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Simplify;
