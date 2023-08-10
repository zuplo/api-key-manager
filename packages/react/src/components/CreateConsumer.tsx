import { useContext, useState } from "react";
import { ErrorContext } from "./ConsumerControl";
import { useDataContext, useProviderContext } from "./context";
import { CheckIcon, Spinner } from "./icons";
import styles from "./CreateConsumer.module.css";

export default function CreateConsumer() {
  const provider = useProviderContext();
  const [, setError] = useContext(ErrorContext);
  const [dataModel, setDataModel] = useDataContext();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [label, setLabel] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  async function handleCreateConsumer() {
    try {
      if (label.trim().length === 0) {
        setIsInvalid(true);
        return;
      }
      setIsInvalid(false);

      if (!provider.createConsumer) {
        throw new Error(
          "Provider does not implement createConsumer but enableCreateConsumer is true",
        );
      }

      setIsCreating(true);
      await provider.createConsumer(label);
      const result = await provider.getConsumers();
      setDataModel({ ...dataModel, consumers: result.data });
      setEditMode(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  }

  function handleLabelChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.trim().length > 0) {
      setIsInvalid(false);
    }
    setLabel(e.target.value);
  }

  if (!editMode) {
    return (
      <button
        onClick={() => setEditMode(true)}
        className={styles["create-consumer-main-button"]}
      >
        Create new API Key
      </button>
    );
  }

  return (
    <div className={styles["create-consumer-container"]}>
      <input
        type="text"
        placeholder="Enter a label"
        value={label}
        onChange={handleLabelChange}
        autoFocus
        className={
          isInvalid
            ? styles["create-consumer-input-invalid"]
            : styles["create-consumer-input"]
        }
      />
      <button
        onClick={handleCreateConsumer}
        className={styles["create-consumer-button"]}
      >
        {isCreating ? (
          <Spinner className={styles["create-consumer-icon"]} />
        ) : (
          <CheckIcon className={styles["create-consumer-icon"]} />
        )}
      </button>
    </div>
  );
}
