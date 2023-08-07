import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { ApiKey } from "../interfaces";
import { useQueryEngineContext } from "../useQueryEngineContext";
import {
  CheckIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  EyeSlashIcon,
  Spinner,
  TrashIcon,
} from "./icons";

import styles from "./KeyControl.module.css";

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
  }, [
    deleteKeyMutation.error,
    deleteKeyMutation.isLoading,
    onMutationComplete,
  ]);

  function handleDeleteKey() {
    deleteKeyMutation.mutate({
      consumerName: consumerName,
      keyId: apiKey.id,
    });
  }

  const keyMutating = deleteKeyMutation.isLoading;

  return (
    <div>
      <div className={styles["key-control-container"]}>
        <span
          title={masked ? undefined : apiKey.key}
          className={styles["key-control-key"]}
        >
          {mask(apiKey.key, masked)}
        </span>
        <div className={styles["key-control-buttons"]}>
          <button
            title="Copy Key"
            className={styles["key-control-button"]}
            onClick={() => copy(apiKey.key)}
          >
            {copied ? (
              <CheckIcon className={styles["key-control-button-active"]} />
            ) : (
              <DocumentDuplicateIcon
                className={styles["key-control-button-duplicate"]}
              />
            )}
          </button>
          <button
            className={styles["key-control-button"]}
            title={masked ? "Show Key" : "Hide Key"}
            onClick={() => {
              setMasked(!masked);
            }}
          >
            {masked ? (
              <EyeIcon className={styles["key-control-button-eye"]} />
            ) : (
              <EyeSlashIcon className={styles["key-control-button-slash"]} />
            )}
          </button>
          {apiKey.expiresOn ? (
            keyMutating ? (
              <div className={styles["key-control-spinner"]}>
                <Spinner className={styles["key-control-spinner-icon"]} />
              </div>
            ) : (
              <button
                title="Delete Key"
                onClick={handleDeleteKey}
                className={styles["key-control-button"]}
              >
                <TrashIcon className={styles["key-control-button-duplicate"]} />
              </button>
            )
          ) : null}
        </div>
      </div>
      <div className={styles["key-control-created"]}>
        <div className={styles["key-control-created-text"]}>
          created {dayjs(apiKey.createdOn).fromNow()}
          {apiKey.expiresOn && ","}
        </div>
        <div className={styles["key-control-expires"]}>
          {apiKey.expiresOn && `expires ${dayjs(apiKey.expiresOn).fromNow()}`}
        </div>
      </div>
    </div>
  );
};

export default KeyControl;
