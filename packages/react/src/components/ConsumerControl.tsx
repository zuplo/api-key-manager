import { createContext, useState } from "react";
import { Consumer, MenuItem } from "../interfaces";
import KeyControl from "./KeyControl";
import { SimpleMenu } from "./SimpleMenu";
import {
  EllipsisVerticalIcon,
  Save,
  Spinner,
  XCircleIcon,
  XIcon,
} from "./icons";

import styles from "./ConsumerControl.module.css";
import { useDataContext, useProviderContext } from "./context";

interface ConsumerControlProps {
  consumer: Consumer;
  menuItems?: MenuItem[];
}

export const ErrorContext = createContext<
  [string | undefined, (error: string) => void]
>([undefined, () => {}]);

// 7 days
const EXPIRY_PERIOD = 1000 * 60 * 60 * 24 * 7;

const ConsumerControl = ({ consumer, menuItems }: ConsumerControlProps) => {
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState<string>();
  const [description, setDescription] = useState(consumer.description);
  const [dataModel, setDataModel] = useDataContext();
  const [descriptionUpdating, setDescriptionUpdating] = useState(false);
  const [keyRolling, setKeyRolling] = useState(false);
  const provider = useProviderContext();

  const handleDescriptionSave = async () => {
    try {
      setDescriptionUpdating(true);
      await provider.updateConsumerDescription(consumer.name, description);
      const result = await provider.getConsumers();
      setDataModel({
        isFetching: dataModel?.isFetching,
        consumers: result.data,
      });

      setEdit(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDescriptionUpdating(false);
    }
  };

  const handleRollKey = async () => {
    try {
      setKeyRolling(true);
      await provider.rollKey(
        consumer.name,
        new Date(Date.now() + EXPIRY_PERIOD),
      );
      const result = await provider.getConsumers();
      setDataModel({
        isFetching: dataModel?.isFetching,
        consumers: result.data,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setKeyRolling(false);
    }
  };

  const editLabelMenuItem = {
    label: "Edit Label",
    action: () => {
      setEdit(true);
    },
  };

  const rollKeysMenuItem = {
    label:
      consumer.apiKeys.filter((k) => !k.expiresOn).length > 1
        ? "Roll keys"
        : "Roll key",
    action: handleRollKey,
  };

  const fancyDropDownMenuItems = [
    editLabelMenuItem,
    rollKeysMenuItem,
    ...(menuItems?.map((item) => {
      return {
        label: item.label,
        action: () => {
          item.action(consumer);
        },
      };
    }) ?? []),
  ];

  return (
    <ErrorContext.Provider value={[error, setError]}>
      <div className={styles["consumer-control-container"]}>
        <div className={styles["consumer-control-header"]}>
          {edit ? (
            <div className={styles["consumer-control-input-container"]}>
              <input
                autoFocus={true}
                onFocus={(event) => event.target.select()}
                onKeyUp={(event) => {
                  event.key === "Enter" && handleDescriptionSave();
                }}
                disabled={descriptionUpdating}
                type="text"
                className={styles["consumer-control-input"]}
                onChange={(e) => setDescription(e.target.value)}
                defaultValue={consumer.description}
              />
              <button
                className={styles["consumer-control-button"]}
                disabled={descriptionUpdating}
                onClick={handleDescriptionSave}
              >
                {descriptionUpdating ? (
                  <div className={styles["consumer-control-spinner-container"]}>
                    <Spinner className={styles["consumer-control-spinner"]} />
                  </div>
                ) : (
                  <Save className={styles["consumer-control-save-icon"]} />
                )}
                <span>Save</span>
              </button>
              <button
                className={styles["consumer-control-button"]}
                disabled={descriptionUpdating}
                onClick={() => setEdit(false)}
              >
                <XIcon className={styles["consumer-control-cancel-icon"]} />
                <span>Cancel</span>
              </button>
            </div>
          ) : (
            <div className={styles["consumer-control-description"]}>
              {consumer.description ?? consumer.name}
            </div>
          )}
          <div className={styles["consumer-menu-button-wrapper"]}>
            {dataModel.isFetching || keyRolling ? (
              <div
                className={styles["consumer-control-menu-spinner-container"]}
              >
                <Spinner className={styles["consumer-control-menu-spinner"]} />
              </div>
            ) : (
              <SimpleMenu items={fancyDropDownMenuItems ?? []}>
                <div className={styles["consumer-control-menu-button"]}>
                  <EllipsisVerticalIcon
                    className={styles["consumer-control-menu-icon"]}
                  />
                </div>
              </SimpleMenu>
            )}
          </div>
        </div>
        {Boolean(error) && (
          <div className={styles["consumer-control-error-container"]}>
            <div className={styles["consumer-control-error-header-wrapper"]}>
              <div className={styles["consumer-control-error-header"]}>
                <XCircleIcon
                  className={styles["consumer-control-error-icon"]}
                />
                <span className={styles["consumer-control-error-leading-text"]}>
                  Error
                </span>
              </div>
              <button
                title="Dismiss error"
                className={styles["consumer-control-error-dismiss"]}
                onClick={() => setError(undefined)}
              >
                <XIcon
                  className={styles["consumer-control-error-dismiss-icon"]}
                />
              </button>
            </div>
            <div className={styles["consumer-control-error-text"]}>
              &quot;{error}&quot;
            </div>
          </div>
        )}
        <div className={styles["consumer-control-content"]}>
          {consumer.apiKeys.map((k) => (
            <KeyControl key={k.id} apiKey={k} consumerName={consumer.name} />
          ))}
        </div>
      </div>
    </ErrorContext.Provider>
  );
};

export default ConsumerControl;
