import { j as jsxRuntimeExports } from "./index-DS595Jt3.js";
import { D as Dialog, c as Button } from "./SessionsDialog-CsVQMlkl.js";
function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  danger = false,
  loading = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onClose,
      title,
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: onClose, disabled: loading, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: danger ? "danger" : "primary", loading, onClick: onConfirm, children: confirmLabel })
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", children: message })
    }
  );
}
export {
  ConfirmDialog as C
};
