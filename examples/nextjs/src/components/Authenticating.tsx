import Spinner from "./Spinner";

export default function Authenticating() {
  return (
    <div className="flex justify-center flex-row items-center dark:text-white">
      <div className="h-5 w-5 mr-2 dark:text-white">
        <Spinner />
      </div>{" "}
      Authenticating...
    </div>
  );
}
