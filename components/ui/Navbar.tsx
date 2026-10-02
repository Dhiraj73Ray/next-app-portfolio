import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-cream/90 backdrop-blur-sm border-b border-ink">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        
        {/* Left: Logo / Name */}
        <Link href="/" className="font-serif text-xl font-bold tracking-tight text-ink">
          Aarav Sharma
        </Link>

        {/* Right: Links */}
        <nav className="hidden md:flex gap-8">
          {[
            { name: "ABOUT", href: "#about" },
            { name: "SKILLS", href: "#skills" },
            { name: "PROJECTS", href: "#projects" },
            { name: "EXPERIENCE", href: "#experience" },
            { name: "CONTACT", href: "#contact" },
          ].map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="font-mono text-xs tracking-widest text-ink hover:text-burnt transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle (We will make this functional later) */}
        <button className="md:hidden font-mono text-xs border border-ink px-3 py-1 text-ink">
          [ MENU ]
        </button>
      </div>
    </header>
  );
}