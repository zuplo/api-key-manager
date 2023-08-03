import {
  CheckIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { ApiKey } from "../interfaces";
import { useQueryEngineContext } from "../useQueryEngineContext";

interface KeyControlProps {
  consumerName: string;
  apiKey: ApiKey;
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

const KeyControl = ({ apiKey }: KeyControlProps) => {
  const [masked, setMasked] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const { useDeleteKeyMutation, useRollKeyMutation } = useQueryEngineContext();
  const keyRollMutation = useRollKeyMutation();
  const deleteKeyMutation = useDeleteKeyMutation();

  function copy(value: string) {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  // function rollKey() {
  //   keyRollMutation.mutate({
  //     consumerName: consumerName,
  //     // TODO - provide options, expire in 7 days for now
  //     expiresOn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  //   });
  // }

  // function deleteKey() {
  //   deleteKeyMutation.mutate({
  //     consumerName: consumerName,
  //     keyId: apiKey.id,
  //   });
  // }

  // if there is an expiry, show the delete key operation
  // const menuItems = apiKey.expiresOn
  //   ? [
  //       {
  //         label: "Delete Key",
  //         action: () => {
  //           deleteKey();
  //         },
  //       },
  //     ]
  //   : [
  //       {
  //         label: "Roll Key",
  //         action: () => {
  //           rollKey();
  //         },
  //       },
  //     ];

  const keyMutating = keyRollMutation.isLoading || deleteKeyMutation.isLoading;

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <div className="font-mono py-2 mr-2">{mask(apiKey.key, masked)}</div>

        <div className="flex gap-x-1 justify-end text-gray-700">
          <button
            className="rounded p-1 hover:bg-gray-200"
            onClick={() => copy(apiKey.key)}
          >
            {copied ? (
              <CheckIcon className="text-green-500 h-5 w-5" />
            ) : (
              <DocumentDuplicateIcon className="h-5 w-5" />
            )}
          </button>
          <button
            className="rounded p-1 hover:bg-gray-200"
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
              <div className="p-2">
                <div>TODO: Spinner</div>
              </div>
            ) : (
              <button
                title="Delete Key"
                className="rounded p-1 hover:bg-gray-200"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )
          ) : null}
        </div>
      </div>

      <div className="text-xs text-gray-600 flex flex-row items-center gap-x-1 -mt-2 mb-2">
        <div className="text-gray-400">
          created {dayjs(apiKey.createdOn).fromNow()}
          {apiKey.createdOn && ","}
        </div>
        <div className="text-red-700">
          {apiKey.expiresOn && `expires ${dayjs(apiKey.expiresOn).fromNow()}`}
        </div>
      </div>
    </div>
  );
};

export default KeyControl;
