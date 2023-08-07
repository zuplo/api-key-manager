"use client";
import CreateKey from "@/components/create-key";
import TestConsole from "@/components/test-console";
import YourKeys from "@/components/your-keys";
import { useEffect, useState } from "react";

const JWT_STORAGE_KEY = "jwt";

export default function Root() {
  const [jwt, setJwt] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const asyncFn = async () => {
      const token = localStorage.getItem(JWT_STORAGE_KEY);
      if (token !== null) {
        setJwt(token);
        return;
      }

      const response = await fetch(
        "https://api-key-live-sample-main-21ced70.d2.zuplo.dev/get-jwt",
        {
          method: "POST",
        }
      );
      // TODO error handling
      try {
        const data = await response.json();
        const newJwt = data.token;
        localStorage.setItem(JWT_STORAGE_KEY, newJwt);
        setJwt(newJwt);
      } catch (err) {
        setError((err as any).toString());
      }
    };
    asyncFn();
  }, []);

  if (!jwt) {
    return <div>Creating an anonymous login for you, please wait...</div>;
  }

  return (
    <>
      {error && <div>${error}</div>}

      <div className="flex flex-col gap-y-10">
        <YourKeys token={jwt} />
        <CreateKey token={jwt} />
        <TestConsole />
      </div>
    </>
  );
}
