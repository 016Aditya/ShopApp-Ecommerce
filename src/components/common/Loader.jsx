import Spinner from "@/components/common/Spinner";

function Loader({
  text = "Loading...",
  fullScreen = false,
  className = "",
}) {
  return (
    <div
      className={[
        "flex items-center justify-center gap-3 p-6 text-slate-600",
        fullScreen ? "min-h-screen" : "min-h-[200px]",
        className,
      ].join(" ")}
      aria-busy="true"
      aria-live="polite"
    >
      <Spinner size="md" className="text-blue-600" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

export default Loader;