import { Link } from "react-router-dom";

const calculateDaysLeft = (deadline) => {
  if (!deadline) return "N/A";
  const deadlineDate = new Date(deadline);
  const currentDate = new Date();

  const diffTime = deadlineDate - currentDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
};

const Cards = ({ job }) => {
  return (
    <div className="relative border w-full bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition-all duration-300 ease-in-out mx-auto overflow-hidden">
      {/* Days Left Badge */}
      <div className="absolute top-2 right-3 text-xs text-gray-600 px-3 py-1 bg-gray-100 rounded-full shadow-sm whitespace-nowrap">
        {calculateDaysLeft(job.deadline)} days left
      </div>

      {/* Header: Logo & Title */}
      <div className="flex items-center space-x-3 mb-3 overflow-hidden">
        <img
          src="https://randomuser.me/api/portraits/lego/2.jpg"
          alt="Company Logo"
          className="w-12 h-12 object-cover rounded-full border"
        />
        <div className="flex flex-col">
          <span className="text-base font-semibold text-gray-800 truncate max-w-[10rem]">
            {job.title}
          </span>
          <span className="text-sm text-gray-500 truncate max-w-[10rem]">
            {job.location}
          </span>
        </div>
      </div>

      {/* Domain */}
      <p className="text-xl font-bold text-red-600 mb-2 truncate">
        {job.domain}
      </p>

      {/* Description */}
      <div className="text-gray-600 text-sm mb-4 h-10 overflow-y-auto break-words pr-1 scrollbar-thin scrollbar-thumb-gray-300">
        {job.description}
      </div>

      {/* Tags */}
      <div className="flex flex-col text-center w-fit flex-wrap gap-2 text-xs font-semibold mb-4">
        <span className="bg-red-500 text-white px-2 py-1 rounded-full">
          {job.openings} openings
        </span>
        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
          {job.jobType}
        </span>
        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
          {job.salary?.toLocaleString() ?? "N/A"}/month
        </span>
      </div>

      {/* View Details Button */}
      <Link
        to={`/job-details/${job._id}`}
        className="w-full red-button"
      >
        View Details
      </Link>
    </div>
  );
};

export default Cards;
