interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-medium tracking-wide uppercase text-[#4B5563]"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#121212] placeholder:text-[#9CA3AF] transition-colors focus:border-[#B8860B] focus:outline-none focus:ring-1 focus:ring-[#B8860B] ${error ? "border-red-400" : ""} ${className ?? ""}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
