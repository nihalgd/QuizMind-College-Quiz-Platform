import Icon from "./Icon";

const EmptyState = ({ icon = "info", title, description, actionLabel, onAction }) => (
  <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
      <Icon name={icon} className="h-6 w-6" />
    </div>
    <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
    {description && <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">{description}</p>}
    {actionLabel && (
      <button
        type="button"
        onClick={onAction}
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
