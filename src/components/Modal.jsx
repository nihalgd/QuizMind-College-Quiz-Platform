import Icon from "./Icon";

const Modal = ({ title, children, onClose, footer }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4" onMouseDown={onClose}>
    <div
      className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-6"
      onMouseDown={(event) => event.stopPropagation()}
      role="dialog"
      aria-modal="true"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close modal"
        >
          <Icon name="x" className="h-5 w-5" />
        </button>
      </div>
      {children}
      {footer && <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">{footer}</div>}
    </div>
  </div>
);

export default Modal;
