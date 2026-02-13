interface GlassAvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

const colors = [
  "from-indigo-500 to-purple-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-cyan-500 to-blue-500",
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function GlassAvatar({ name, src, size = "md", className = "" }: GlassAvatarProps) {
  if (src) {
    return (
      <img src={src} alt={name} className={`${sizeClasses[size]} rounded-full object-cover border border-white/20 ${className}`} />
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${getColor(name)} flex items-center justify-center font-semibold text-white border border-white/20 ${className}`}>
      {getInitials(name)}
    </div>
  );
}
