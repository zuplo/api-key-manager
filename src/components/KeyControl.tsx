import { useState } from "react";
import { ApiKey } from "../interfaces/main";
import { useQueryEngineContext } from "../hooks/useQueryEngineContext";
import {
  CheckIcon,
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { SimpleMenu } from "./SimpleMenu";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

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

const KeyControl = ({ consumerName, apiKey }: KeyControlProps) => {
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

  function rollKey() {
    keyRollMutation.mutate({
      consumerName: consumerName,
      // TODO - provide options, expire in 7 days for now
      expiresOn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
  }

  function deleteKey() {
    deleteKeyMutation.mutate({
      consumerName: consumerName,
      keyId: apiKey.id,
    });
  }

  // if there is an expiry, show the delete key operation
  const menuItems = apiKey.expiresOn
    ? [
        {
          label: "Delete Key",
          action: () => {
            deleteKey();
          },
        },
      ]
    : [
        {
          label: "Roll Key",
          action: () => {
            rollKey();
          },
        },
      ];

  const keyMutating = keyRollMutation.isLoading || deleteKeyMutation.isLoading;

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <div className="font-mono py-2 mr-2">{mask(apiKey.key, masked)}</div>

        <div className="flex justify-end space-x-1 text-gray-600">
          <button
            className="rounded-lg p-2 hover:bg-gray-200"
            onClick={() => copy(apiKey.key)}
          >
            {copied ? (
              <CheckIcon className="text-green-500 h-4 w-4" />
            ) : (
              <DocumentDuplicateIcon className="h-4 w-4" />
            )}
          </button>
          <button
            className="rounded-lg p-2 hover:bg-gray-200"
            onClick={() => {
              setMasked(!masked);
            }}
          >
            {masked ? (
              <EyeSlashIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>

          {keyMutating ? (
            <div className="p-2">
              <div>TODO: Spinner</div>
            </div>
          ) : (
            <SimpleMenu items={menuItems}>
              <div className="rounded-lg p-2 hover:bg-gray-200 -mb-2">
                <EllipsisHorizontalIcon className="h-4 w-4" />
                ...
              </div>
            </SimpleMenu>
          )}
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
