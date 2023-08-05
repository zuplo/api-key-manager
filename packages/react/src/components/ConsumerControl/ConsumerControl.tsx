import { useState, useEffect } from "react";
import {
  EllipsisVerticalIcon,
  Save,
  Spinner,
  XCircleIcon,
  XIcon,
} from "../../icons";
import { Consumer, MenuItem } from "../../interfaces";
import { useQueryEngineContext } from "../../useQueryEngineContext";
import { SimpleMenu } from "../SimpleMenu/SimpleMenu";
import styles from "./ConsumerControl.module.css";
import KeyControl from "../KeyControl/KeyControl";

interface ConsumerControlProps {
  consumer: Consumer;
  menuItems?: MenuItem[];
  isLoading: boolean;
}

const ConsumerControl = ({
  consumer,
  menuItems,
  isLoading,
}: ConsumerControlProps) => {
  const [edit, setEdit] = useState(false);
  const [queryError, setQueryError] = useState<string>();
  const [description, setDescription] = useState(consumer.description);
  const { useConsumerDescriptionMutation, useRollKeyMutation } =
    useQueryEngineContext();
  const consumerDescriptionMutation = useConsumerDescriptionMutation();
  const keyRollMutation = useRollKeyMutation();

  useEffect(() => {
    if (consumerDescriptionMutation.error) {
      setQueryError(consumerDescriptionMutation.error.toString());
      return;
    }
    setQueryError(undefined);
  }, [consumerDescriptionMutation.isLoading]);

  useEffect(() => {
    if (keyRollMutation.error) {
      setQueryError(keyRollMutation.error.toString());
      return;
    }
    setQueryError(undefined);
  }, [keyRollMutation.isLoading]);

  const handleMutationComplete = (error: unknown) => {
    if (!error) {
      setQueryError(undefined);
      return;
    }
    if (error instanceof Error) {
      setQueryError(error.message);
      return;
    }
    console.error("unhandled error", error);
  };

  const handleLabelSave = async () => {
    // We're in edit mode, so change description
    await consumerDescriptionMutation.mutate({
      consumerName: consumer.name,
      description,
    });

    setEdit(false);
  };

  const handleRollKey = () => {
    keyRollMutation.mutate({
      consumerName: consumer.name,
      // TODO - provide options, expire in 7 days for now
      expiresOn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
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
    <div className={styles["consumer-control-container"]}>
      <div className={styles["consumer-control-header"]}>
        {edit ? (
          <div className={styles["consumer-control-input-container"]}>
            <input
              autoFocus={true}
              onFocus={(event) => event.target.select()}
              onKeyUp={(event) => {
                event.key === "Enter" && handleLabelSave();
              }}
              disabled={consumerDescriptionMutation.isLoading}
              type="text"
              className={styles["consumer-control-input"]}
              onChange={(e) => setDescription(e.target.value)}
              defaultValue={consumer.description}
            />
            <button
              className={styles["consumer-control-button"]}
              disabled={consumerDescriptionMutation.isLoading}
              onClick={handleLabelSave}
            >
              {consumerDescriptionMutation.isLoading ? (
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
              disabled={consumerDescriptionMutation.isLoading}
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
          {isLoading || keyRollMutation.isLoading ? (
            <div className={styles["consumer-control-spinner-container"]}>
              <Spinner className={styles["consumer-control-spinner"]} />
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
      {Boolean(queryError) && (
        <div className={styles["consumer-control-error-container"]}>
          <div className={styles["consumer-control-error-header-wrapper"]}>
            <div className={styles["consumer-control-error-header"]}>
              <XCircleIcon className={styles["consumer-control-error-icon"]} />
              <span className={styles["consumer-control-error-leading-text"]}>
                Error
              </span>
            </div>
            <button
              title="Dismiss error"
              className={styles["consumer-control-error-dismiss"]}
              onClick={() => setQueryError(undefined)}
            >
              <XIcon
                className={styles["consumer-control-error-dismiss-icon"]}
              />
            </button>
          </div>
          <div className={styles["consumer-control-error-text"]}>
            &quot;{queryError}&quot;
          </div>
        </div>
      )}
      <div className={styles["consumer-control-content"]}>
        {consumer.apiKeys.map((k) => (
          <KeyControl
            onMutationComplete={handleMutationComplete}
            key={k.id}
            apiKey={k}
            consumerName={consumer.name}
          />
        ))}
      </div>
    </div>
  );
};

export default ConsumerControl;
