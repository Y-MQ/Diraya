import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="relative overflow-hidden">
    {/* Gradient top border */}
    <div className="h-px bg-gradient-to-l from-transparent via-teal/30 to-transparent" />
    
    <div className="bg-gradient-to-b from-[hsl(193_38%_36%)] to-[hsl(193_40%_30%)] py-14 px-6">
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-teal/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="text-center md:text-right">
            <h3 className="text-white font-extrabold text-xl mb-2 tracking-tight">دراية</h3>
            <p className="text-white/60 text-sm font-medium leading-relaxed max-w-xs">
              لأن الفهم حق راسخ، لا امتياز مكتسب
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            <Link to="/simplify" className="text-white/50 text-sm font-medium hover:text-white/90 transition-colors duration-300">
              تبسيط المصطلحات
            </Link>
            <Link to="/missions" className="text-white/50 text-sm font-medium hover:text-white/90 transition-colors duration-300">
              وضع المهمات
            </Link>
          </div>

          {/* Badge */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-full px-4 py-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/70 text-[11px] font-bold">مدعوم بنماذج علم</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-white/30 text-xs font-medium">
            © {new Date().getFullYear()} دراية — منصة التعلم الذكي
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
