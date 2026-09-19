import { d as reactExports, j as jsxRuntimeExports, f as Check, n as Copy, e as cn } from "./index-DS595Jt3.js";
import { f as formatLicenseCode } from "./portalData-C1l0nslE.js";
function LicenseCode({
  code,
  className,
  size = "md"
}) {
  const [copied, setCopied] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 font-mono tracking-[0.12em] text-gray-900",
        size === "sm" ? "py-1 pl-2.5 pr-1 text-xs" : "py-1.5 pl-3 pr-1.5 text-sm",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatLicenseCode(code) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: copy,
            "aria-label": copied ? "Licence code copied" : "Copy licence code",
            title: "Copy licence code",
            className: cn(
              "grid place-content-center rounded-md transition-colors",
              size === "sm" ? "h-5 w-5" : "h-6 w-6",
              copied ? "text-emerald-600" : "text-gray-400 hover:bg-gray-200 hover:text-gray-700"
            ),
            children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" })
          }
        )
      ]
    }
  );
}
export {
  LicenseCode as L
};
