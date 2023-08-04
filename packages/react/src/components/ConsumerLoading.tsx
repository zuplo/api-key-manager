import { EllipsisVerticalIcon } from "../icons";

const ConsumerLoading = () => {
  return (
    <div className="rounded-lg bg-slate-50 border-zinc-200 border mb-5">
      <div className="flex flex-row border-b border-zinc-200 justify-between items-center">
        <div className="h-4 m-5 mb-[22px] ml-4 w-44 animate-pulse rounded-lg bg-gray-300" />
        <div className="m-3 mt-5 mb-[18px] mr-4 opacity-50">
          <EllipsisVerticalIcon className="h-5 w-5" />
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
      <div className="h-4 mt-6 mb-8 w-[440px] animate-pulse rounded-lg bg-gray-300" />
    </div>
  );
};

export default ConsumerLoading;
