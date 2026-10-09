import { CATEGORIES } from "./data";

interface Props {
  active: string;
  onChange: (key: string) => void;
}

export default function CategoryTabs({ active, onChange }: Props) {
  return (
    <div className="flex lg:flex-wrap items-center gap-1.5 font-mono text-[11px] overflow-x-auto lg:overflow-visible pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat.key;
        return (
          <button
            key={cat.key}
            onClick={() => onChange(cat.key)}
            className={`px-3 py-1.5 transition-colors duration-200 border cursor-pointer ${
              isActive
                ? "bg-ink text-cream border-ink"
                : "bg-transparent text-ink/70 border-ink/15 hover:border-ink/50 hover:text-ink"
            }`}
          >
            {isActive ? `[ ${cat.label} ]` : cat.label}
          </button>
        );
      })}
    </div>
  );
}