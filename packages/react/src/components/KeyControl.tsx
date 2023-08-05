import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState, useEffect } from "react";
import {
  CheckIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  EyeSlashIcon,
  Spinner,
  TrashIcon,
} from "../icons";
import { ApiKey } from "../interfaces";
import { useQueryEngineContext } from "../useQueryEngineContext";

interface KeyControlProps {
  consumerName: string;
  apiKey: ApiKey;
  onMutationComplete: (error: unknown) => void;
}

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

function mask(value: string, mask: boolean) {
  if (!mask || value.length <= 8) {
    return value;
  }

  const maskedPart = "*".repeat(value.length - 8);
  const lastEightChars = value.slice(-8);

  return maskedPart + lastEightChars;
}

const KeyControl = ({
  apiKey,
  consumerName,
  onMutationComplete,
}: KeyControlProps) => {
  const [masked, setMasked] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const { useDeleteKeyMutation } = useQueryEngineContext();
  const deleteKeyMutation = useDeleteKeyMutation();

  function copy(value: string) {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  useEffect(() => {
    onMutationComplete(deleteKeyMutation.error);
    // We use the isLoading flag here to reset the error state whenever the
    // mutation is triggered
  }, [deleteKeyMutation.isLoading]);

  function handleDeleteKey() {
    deleteKeyMutation.mutate({
      consumerName: consumerName,
      keyId: apiKey.id,
    });
  }

  const keyMutating = deleteKeyMutation.isLoading;

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <span className="font-mono text-ellipsis overflow-hidden py-2 mr-2 text-zinc-800">
          {mask(apiKey.key, masked)}
        </span>
        <div className="flex gap-x-1 justify-end text-zinc-500">
          <button
            title="Copy Key"
            className="rounded p-1 hover:bg-slate-200"
            onClick={() => copy(apiKey.key)}
          >
            {copied ? (
              <CheckIcon className="text-green-500 h-5 w-5" />
            ) : (
              <DocumentDuplicateIcon className="h-5 w-5" />
            )}
          </button>
          <button
            className="rounded p-1 hover:bg-slate-200"
            title={masked ? "Show Key" : "Hide Key"}
            onClick={() => {
              setMasked(!masked);
            }}
          >
            {masked ? (
              <EyeIcon className="h-5 w-5" />
            ) : (
              <EyeSlashIcon className="h-5 w-5" />
            )}
          </button>
          {apiKey.expiresOn ? (
            keyMutating ? (
              <div className="p-1">
                <Spinner className="h-5 w-5 animate-spin" />
              </div>
            ) : (
              <button
                title="Delete Key"
                onClick={handleDeleteKey}
                className="rounded p-1 hover:bg-slate-200"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )
          ) : null}
        </div>
      </div>
      <div className="text-xs flex flex-row items-center gap-x-1 -mt-2 mb-2">
        <div className="text-zinc-400">
          created {dayjs(apiKey.createdOn).fromNow()}
          {apiKey.expiresOn && ","}
        </div>
        <div className="text-red-500">
          {apiKey.expiresOn && `expires ${dayjs(apiKey.expiresOn).fromNow()}`}
        </div>
      </div>
    </div>
  );
};

export default KeyControl;
