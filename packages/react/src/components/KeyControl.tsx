import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { useContext, useState } from "react";
import { ApiKey } from "../interfaces";

import {
  CheckIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  EyeSlashIcon,
  Spinner,
  TrashIcon,
} from "./icons";

import styles from "./KeyControl.module.css";
import { useDataContext, useProviderContext } from "./context";
import { ErrorContext } from "./ConsumerControl";

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

const KeyControl = ({ apiKey, consumerName }: KeyControlProps) => {
  const [masked, setMasked] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const [dataModel, setDataModel] = useDataContext();
  const [keyDeleting, setKeyDeleting] = useState<boolean>(false);
  const [, setError] = useContext(ErrorContext);
  const provider = useProviderContext();

  function copy(value: string) {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  async function handleDeleteKey() {
    try {
      setKeyDeleting(true);
      await provider.deleteKey(consumerName, apiKey.id);
      const result = await provider.getConsumers();
      setDataModel({
        isFetching: dataModel.isFetching,
        consumers: result.data,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError(err.message);
    } finally {
      setKeyDeleting(false);
    }
  }

  return (
    <div>
      <div className={styles["key-control-container"]}>
        <span
          data-test="key-control-key"
          title={masked ? undefined : apiKey.key}
          className={styles["key-control-key"]}
        >
          {mask(apiKey.key, masked)}
        </span>
        <div className={styles["key-control-buttons"]}>
          <button
            title="Copy Key"
            data-test="key-control-copy"
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
            data-test="key-control-mask"
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
            keyDeleting ? (
              <div className={styles["key-control-spinner"]}>
                <Spinner className={styles["key-control-spinner-icon"]} />
              </div>
            ) : (
              <button
                data-test="key-control-delete"
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
