import { createContext, useState } from "react";
import { Consumer, MenuItem } from "../interfaces";
import KeyControl from "./KeyControl";
import { SimpleMenu } from "./SimpleMenu";
import {
  ArrowPathIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  Save,
  Spinner,
  TrashIcon,
  XCircleIcon,
  XIcon,
} from "./icons";

import styles from "./ConsumerControl.module.css";
import { useDataContext, useProviderContext } from "./context";

interface ConsumerControlProps {
  consumer: Consumer;
  menuItems?: MenuItem[];
  enableDeleteConsumer?: boolean;
}

export const ErrorContext = createContext<
  [string | undefined, (error: string | undefined) => void]
>([undefined, () => {}]);

// 7 days
const EXPIRY_PERIOD_MS = 1000 * 60 * 60 * 24 * 7;

const ConsumerControl = ({
  consumer,
  menuItems,
  enableDeleteConsumer,
}: ConsumerControlProps) => {
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState<string>();
  const [description, setDescription] = useState(consumer.description);
  const [dataModel, setDataModel] = useDataContext();
  const [descriptionUpdating, setDescriptionUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      setError(undefined);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDescriptionUpdating(false);
    }
  };

  const handleRollKey = async () => {
    try {
      setIsLoading(true);
      await provider.rollKey(
        consumer.name,
        new Date(Date.now() + EXPIRY_PERIOD_MS),
      );
      const result = await provider.getConsumers();
      setDataModel({
        isFetching: dataModel?.isFetching,
        consumers: result.data,
      });
      setError(undefined);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConsumer = async () => {
    try {
      if (!provider.deleteConsumer) {
        throw new Error(
          "Provider does not support deleteConsumer but enableDeleteConsumer is true",
        );
      }
      setIsLoading(true);
      await provider.deleteConsumer(consumer.name);
      const result = await provider.getConsumers();
      setDataModel({
        ...dataModel,
        consumers: result.data,
      });
      setError(undefined);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const editLabelMenuItem = {
    label: "Edit Label",
    action: () => {
      setEdit(true);
    },
    icon: PencilSquareIcon({}),
  };

  const rollKeysMenuItem: MenuItem = {
    label:
      consumer.apiKeys.filter((k) => !k.expiresOn).length > 1
        ? "Roll keys"
        : "Roll key",
    action: handleRollKey,
    icon: ArrowPathIcon({}),
  };

  const deleteConsumerMenuItem: MenuItem = {
    label: "Delete",
    action: handleDeleteConsumer,
    icon: TrashIcon({}),
  };

  const initialMenuItems = [editLabelMenuItem, rollKeysMenuItem];

  if (enableDeleteConsumer) {
    initialMenuItems.push(deleteConsumerMenuItem);
  }

  const withCustomMenuItems = [...initialMenuItems, ...(menuItems ?? [])];

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
            {dataModel.isFetching || isLoading ? (
              <div
                className={styles["consumer-control-menu-spinner-container"]}
              >
                <Spinner className={styles["consumer-control-menu-spinner"]} />
              </div>
            ) : (
              <SimpleMenu items={withCustomMenuItems ?? []}>
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
