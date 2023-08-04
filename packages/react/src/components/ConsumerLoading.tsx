import { EllipsisVerticalIcon } from "../icons";

const ConsumerLoading = () => {
  return (
    <div className="rounded-lg bg-gray-200 border-gray-500 border mb-5">
      <div className="flex flex-row justify-between items-center">
        <div className="h-4 m-5 ml-4 w-44 animate-pulse rounded-lg bg-gray-300" />
        <div className="p-4 opacity-50">
          <EllipsisVerticalIcon className="h-4 w-4" />
        </div>
      </div>
      <div className="bg-white flex flex-col rounded-b-lg p-4 py-2">
        <KeyLoading />
      </div>
    </div>
  );
};

const KeyLoading = () => {
  return (
    <div className="flex w-full justify-between">
      <div className="h-4 my-2 w-96 animate-pulse rounded-lg bg-gray-400" />
    </div>
  );
};

export default ConsumerLoading;

// Ellipsis has roll active keys
// When key has an expiry, you should expose delete option
// Show shimmer for initial load, spinners for operations
