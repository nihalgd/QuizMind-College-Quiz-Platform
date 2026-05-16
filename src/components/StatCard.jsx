import Icon from "./Icon";

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        <Icon name={icon} className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default StatCard;
