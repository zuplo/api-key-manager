import Spinner from "./Spinner";

export default function Authenticating() {
  return (
    <div className="flex justify-center flex-row items-center">
      <div className="h-5 w-5 mr-2">
        <Spinner />
      </div>{" "}
      Authenticating...
    </div>
  );
}
