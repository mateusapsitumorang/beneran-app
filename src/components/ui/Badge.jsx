const styles = {
  bahaya: "bg-red-100 text-red-700 border border-red-200",
  waspada: "bg-amber-100 text-amber-700 border border-amber-200",
  aman: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  info: "bg-blue-100 text-blue-700 border border-blue-200",
};

export default function Badge({ tipe = "info", children }) {
  return (
    <span
      className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${styles[tipe]}`}
    >
      {children}
    </span>
  );
}
