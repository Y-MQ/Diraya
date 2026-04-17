import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navLinks = [
  { label: "الرئيسية", path: "/" },
  { label: "تبسيط المصطلحات", path: "/simplify" },
  { label: "وضع المهمات", path: "/missions" },
];

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 h-16 glass-dark border-b border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
        {/* Right: Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/Diraya_-_logo.png"
            alt="دراية"
            className="h-10 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="text-white font-extrabold text-xl leading-tight tracking-tight">
              دراية
            </span>
            <span className="text-teal-light/70 text-[11px] leading-tight font-medium">
              منصة التعلم الذكي
            </span>
          </div>
        </Link>

        {/* Center: Nav links */}
        <div className="flex items-center gap-0.5 bg-white/[0.06] rounded-xl p-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "text-white"
                    : "text-white/60 hover:text-white/90"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/[0.12] rounded-lg"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Left: Badge */}
        <div className="border border-white/20 rounded-full px-4 py-1.5 bg-white/[0.04]">
          <span className="text-white/80 text-[11px] font-bold tracking-wide">
            مدعوم بنماذج علم
          </span>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
