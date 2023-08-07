interface Props {
  token: string;
}

export default function CreateKey({ token }: Props) {
  const createKey = async () => {
    const description = window.prompt("Enter a description for your key");

    if (null) {
      return;
    }

    const req = {
      description,
      metadata: { test: 1 },
    };
    const response = await fetch(
      "https://api-key-live-sample-main-21ced70.d2.zuplo.dev/consumers/my",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(req),
      }
    );
    // TODO error handling
    const data = await response.json();
    console.log(data);
    document.location.reload();
  };

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="text-3xl font-bold">Create a new API key</h1>
      <button
        className="text-white bg-blue-500 hover:bg-blue-700 rounded p-1 px-6"
        onClick={() => createKey()}
      >
        Create Key
      </button>
    </div>
  );
}
