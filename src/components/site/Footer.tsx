import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-ink text-paper mt-24">
      <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-4">
            <img src={logo} alt="PICDECOS" className="h-16 w-16 object-contain bg-paper rounded-full p-1" />
            <div>
              <p className="font-serif text-3xl text-brand">PICDECOS</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] opacity-60">
                Pinyin Clan Development Cooperative Society Ltd.
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-md text-sm opacity-70 italic">
            "From the Soil We Grow — and from unity, we prosper."
          </p>
          <p className="mt-6 text-xs opacity-50">
            Reg. No. 24/025/CMR/NW/3B/203/CCA/002003/002003000
          </p>
        </div>
        <div>
          <h6 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-50">Explore</h6>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-brand">About</Link></li>
            <li><Link to="/work" className="hover:text-brand">Our Work</Link></li>
            <li><Link to="/projects" className="hover:text-brand">Projects</Link></li>
            <li><Link to="/products" className="hover:text-brand">Products</Link></li>
            <li><Link to="/updates" className="hover:text-brand">Updates</Link></li>
            <li><Link to="/documents" className="hover:text-brand">Documents</Link></li>
          </ul>
        </div>
        <div>
          <h6 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-50">Contact</h6>
          <ul className="space-y-2 text-sm opacity-80">
            <li>Pinyin, Santa Sub Division</li>
            <li>North West Region, Cameroon</li>
            <li>P.O. Box 714, Bamenda</li>
            <li className="pt-2">+237 670 769 326</li>
            <li>+237 676 250 729</li>
            <li className="pt-2">piedecos2024@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-wrap justify-between items-center text-[10px] uppercase tracking-[0.2em] opacity-50">
          <span>© {new Date().getFullYear()} PICDECOS — All rights reserved.</span>
          <Link to="/auth" className="hover:text-brand">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
