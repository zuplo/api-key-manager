import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

const ConsumerLoading = () => {
  return (
    <div className="rounded-lg bg-gray-200 border-gray-200 border mb-5">
      <div className="flex flex-row justify-between items-center h-10">
        <div className="h-4 w-40 animate-pulse rounded-lg bg-gray-400 p-2 ml-2" />
        <div className="p-2 opacity-50">
          <EllipsisVerticalIcon className="h-4 w-4" />
        </div>
      </div>
      <div className="bg-white flex flex-col rounded-b-lg p-2">
        <KeyLoading />
      </div>
    </div>
  );
};

const KeyLoading = () => {
  return (
    <div className="flex w-full justify-between">
      <div className="h-4 my-1 w-96 animate-pulse rounded-lg bg-gray-400" />
    </div>
  );
};

export default ConsumerLoading;

// Ellipsis has roll active keys
// When key has an expiry, you should expose delete option
// Show shimmer for initial load, spinners for operations
