import { EllipsisVerticalIcon } from "../../icons";
import styles from "./ConsumerLoading.module.css"; // Import the CSS module

const ConsumerLoading = () => {
  return (
    <div className={styles["consumer-loading-container"]}>
      <div className={styles["consumer-loading-header"]}>
        <div className={styles["consumer-loading-pulse"]} />
        <div className={styles["consumer-loading-ellipsis"]}>
          <EllipsisVerticalIcon
            className={styles["consumer-loading-ellipsis-icon"]}
          />
        </div>
      </div>
      <div className={styles["consumer-loading-content"]}>
        <KeyLoading />
      </div>
    </div>
  );
};

const KeyLoading = () => {
  return (
    <div className={styles["key-loading-container"]}>
      <div className={styles["key-loading-pulse"]} />
    </div>
  );
};

export default ConsumerLoading;
