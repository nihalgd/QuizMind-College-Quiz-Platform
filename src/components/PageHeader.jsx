import Icon from "./Icon";

const PageHeader = ({ eyebrow, title, description, actionLabel, actionIcon = "plus", onAction }) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div className="min-w-0">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{eyebrow}</p>}
      <h3 className="mt-1 text-xl font-bold text-gray-900">{title}</h3>
      {description && <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p>}
    </div>
    {actionLabel && (
      <button
        type="button"
        onClick={onAction}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
      >
        <Icon name={actionIcon} className="h-4 w-4" />
        {actionLabel}
      </button>
    )}
  </div>
);

export default PageHeader;
