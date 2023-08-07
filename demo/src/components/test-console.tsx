import { useState } from "react";

interface Result {
  status: number;
  data?: any;
}

export default function TestConsole() {
  const [key, setKey] = useState<string | undefined>(undefined);
  const [result, setResult] = useState<Result | undefined>(undefined);

  const test = async () => {
    const response = await fetch(
      "https://api-key-live-sample-main-21ced70.d2.zuplo.dev/who-am-i",
      {
        headers: {
          authorization: `Bearer ${key}`,
        },
      }
    );
    // TODO error handling

    const data = await response.json();
    const result = {
      status: response.status,
      data,
    };
    setResult(result);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="text-3xl font-bold">Test an API key</h1>
      <p>
        You can test one of your API keys here. If successful, the API will
        return the metadata associated with the key.
      </p>
      <div className="flex flex-row items-center gap-x-2">
        <input
          type="text"
          className="rounded border border-gray-300 p-1 flex-1"
          placeholder="Enter an API key here"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <button
          onClick={() => test()}
          className="rounded bg-blue-500 text-white hover:bg-blue-700 p-1 px-6"
        >
          Submit
        </button>
      </div>
      {result && (
        <div className="p-4 rounded bg-gray-200">
          <div className="font-bold text-lg mb-4">Status: {result.status}</div>
          <pre>{JSON.stringify(result.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
