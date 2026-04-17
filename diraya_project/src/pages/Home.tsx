import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ListChecks, Users, ArrowLeft, Sparkles } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    gradient: "from-teal/10 to-teal-light",
    iconBg: "bg-teal/10",
    iconColor: "text-teal-dark",
    title: "تبسيط المصطلحات",
    description: "نستبدل المصطلحات الأكاديمية الصعبة بكلمات مألوفة دون حذف أي معلومة",
  },
  {
    icon: ListChecks,
    gradient: "from-amber/10 to-orange-50",
    iconBg: "bg-amber/10",
    iconColor: "text-amber",
    title: "وضع المهمات",
    description: "نحوّل المحتوى الطويل إلى مهمات تعلم واضحة لكل منها هدف محدد",
  },
  {
    icon: Users,
    gradient: "from-success/10 to-emerald-50",
    iconBg: "bg-success/10",
    iconColor: "text-success",
    title: "مصمم للجميع",
    description: "مبني خصيصاً لطلاب عسر القراءة وADHD مع مراعاة أحدث أبحاث إمكانية الوصول",
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const Home = () => {
  return (
    <div className="relative">
      {/* Falling sheer circles — full page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden="true">
        <div className="absolute top-[-16rem] right-[6%] h-[28rem] w-[28rem] rounded-full bg-teal/30 blur-[140px] mix-blend-multiply fall-slow" />
        <div className="absolute top-[-14rem] left-[10%] h-[22rem] w-[22rem] rounded-full bg-amber/30 blur-[130px] mix-blend-multiply fall-medium" style={{ animationDelay: '-6s' }} />
        <div className="absolute top-[-18rem] left-[42%] h-[24rem] w-[24rem] rounded-full bg-teal/24 blur-[140px] mix-blend-multiply fall-slow" style={{ animationDelay: '-11s' }} />
        <div className="absolute top-[-10rem] right-[35%] h-[18rem] w-[18rem] rounded-full bg-amber/28 blur-[110px] mix-blend-multiply fall-fast" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-[-20rem] left-[68%] h-[23rem] w-[23rem] rounded-full bg-teal/26 blur-[135px] mix-blend-multiply fall-medium" style={{ animationDelay: '-8s' }} />
      </div>

      {/* Hero */}
      <section className="relative bg-transparent pt-28 pb-24 px-6 z-10">
        
        <motion.div
          className="max-w-[720px] mx-auto text-center relative"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 bg-teal/[0.07] text-teal-dark text-[11px] font-bold tracking-[0.15em] px-5 py-2 rounded-full mb-8 border border-teal/10">
              <Sparkles className="w-3.5 h-3.5" />
              مصممة لطلاب عسر القراءة (Dyslexia) واضطراب ADHD   
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-navy font-extrabold leading-[1.15] mb-7 text-balance"
            style={{ fontSize: "clamp(36px, 5vw, 52px)" }}
          >
            صُمِّمت  
            <br />
            <span className="gradient-text">لعقلك أنت </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-teal/80 mx-auto mb-12 text-balance leading-[1.9]"
            style={{ fontSize: "17px", maxWidth: "500px" }}
          >
            دراية مصممة لطلاب عسر القراءة (Dyslexia) واضطراب تشتت الانتباه (ADHD).
نأخذ أي نص أكاديمي ونعيد بناءه بكلمات مألوفة ومهمات واضحة بطريقة يفهمها عقلك
          
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link
              to="/simplify"
              className="btn-primary text-white font-bold rounded-2xl px-9 py-4 text-[15px] inline-flex items-center gap-2 shine"
            >
              ✦ ابدأ تبسيط النص
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              to="/missions"
              className="border-2 border-teal/20 text-teal-dark font-bold rounded-2xl px-9 py-4 text-[15px] hover:bg-teal-light/50 hover:border-teal/30 transition-all duration-300 inline-flex items-center gap-2"
            >
              ◈ جرّب وضع المهمات
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={fadeUp}
            className="mt-16 flex items-center justify-center gap-8 text-muted-foreground/50 text-[12px] font-medium"
          >
            <span className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-success" />
              مجاني بالكامل
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-teal" />
              بدون تسجيل
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-amber" />
              خصوصية تامة
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative py-24 px-6">
        {/* Subtle top divider */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-l from-transparent via-border to-transparent" />
        
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-teal text-[12px] font-bold tracking-widest mb-3 block">المميزات</span>
            <h2 className="text-navy font-extrabold text-[32px] tracking-tight">لماذا دراية؟</h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-5"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="card-premium rounded-2xl p-8 group"
              >
                <div className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                  <f.icon className={`w-5.5 h-5.5 ${f.iconColor}`} />
                </div>
                <h3 className="text-navy font-bold text-lg mb-3 tracking-tight">{f.title}</h3>
                <p className="text-teal/70 text-[14px] leading-[1.8]">{f.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center bg-gradient-to-br from-teal-dark to-[hsl(193_40%_34%)] rounded-3xl p-14 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/[0.02] rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative">
            <h2 className="text-white font-extrabold text-[28px] mb-4 tracking-tight">
              ابدأ الآن مجاناً
            </h2>
            <p className="text-white/50 text-[15px] mb-8 leading-relaxed max-w-md mx-auto">
              أداتان ذكيتان لجعل أي نص أكاديمي أسهل في الفهم والقراءة
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                to="/simplify"
                className="bg-white text-teal-dark font-bold rounded-xl px-7 py-3.5 text-sm hover:bg-white/90 transition-all duration-300 inline-flex items-center gap-2"
              >
                ✦ تبسيط المصطلحات
              </Link>
              <Link
                to="/missions"
                className="border border-white/20 text-white font-bold rounded-xl px-7 py-3.5 text-sm hover:bg-white/10 transition-all duration-300"
              >
                ◈ وضع المهمات
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
