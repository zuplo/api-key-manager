import { useState, useEffect } from "react";
import {
  EllipsisVerticalIcon,
  Save,
  Spinner,
  XCircleIcon,
  XIcon,
} from "../icons";
import { Consumer, MenuItem } from "../interfaces";
import { useQueryEngineContext } from "../useQueryEngineContext";
import KeyControl from "./KeyControl";
import { SimpleMenu } from "./SimpleMenu";

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

  const handleError = (error: unknown) => {
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
    <div className="rounded-lg bg-slate-50 border-zinc-200 border mb-5">
      <div className="flex flex-row justify-between border-b border-zinc-200 items-center">
        {edit ? (
          <div className="flex flex-row w-full">
            <input
              autoFocus={true}
              onFocus={(event) => event.target.select()}
              onKeyUp={(event) => {
                event.key === "Enter" && handleLabelSave();
              }}
              disabled={consumerDescriptionMutation.isLoading}
              type="text"
              className="flex-1 disabled:opacity-50 rounded border border-gray-400 m-1 ml-2 my-2 px-2 bg-white w-full py-1"
              onChange={(e) => setDescription(e.target.value)}
              defaultValue={consumer.description}
            />
            <button
              className="hover:bg-slate-300 text-zinc-700 px-2 flex-0 bg-slate-200 rounded flex flex-row items-center text-sm m-1 my-2 h-8"
              disabled={consumerDescriptionMutation.isLoading}
              onClick={handleLabelSave}
            >
              {consumerDescriptionMutation.isLoading ? (
                <div className="mr-2">
                  <Spinner className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                <Save className="h-4 w-auto mr-1" />
              )}
              <span>Save</span>
            </button>
            <button
              className="hover:bg-slate-300 disabled:opacity-50 text-zinc-700 px-2 flex-0 bg-slate-200 rounded flex flex-row items-center text-sm m-1 my-2 h-8"
              disabled={consumerDescriptionMutation.isLoading}
              onClick={() => setEdit(false)}
            >
              <XIcon className="h-4 w-auto mr-1" />
              <span>Cancel</span>
            </button>
          </div>
        ) : (
          <div className="ml-4 text-zinc-900">
            {consumer.description ?? consumer.name}
          </div>
        )}
        <div className="m-2 mt-4 mr-3">
          {isLoading || keyRollMutation.isLoading ? (
            <div className="p-1">
              <Spinner className="h-5 w-5 mb-1.5 animate-spin" />
            </div>
          ) : (
            <SimpleMenu items={fancyDropDownMenuItems ?? []}>
              <div className="hover:bg-slate-200 rounded p-1">
                <EllipsisVerticalIcon className="h-5 w-5 text-zinc-500" />
              </div>
            </SimpleMenu>
          )}
        </div>
      </div>
      {Boolean(queryError) && (
        <div className="p-4 text-red-600 bg-red-50 text-sm">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center">
              <XCircleIcon className="h-4 w-4 mr-1" />
              <span className="font-bold">Error</span>
            </div>
            <button
              title="Dismiss error"
              className="text-zinc-700 hover:bg-red-100 rounded p-2"
              onClick={() => setQueryError(undefined)}
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="pl-5 text-red-500">&quot;{queryError}&quot;</div>
        </div>
      )}
      <div className="bg-white rounded-b-lg p-4">
        {consumer.apiKeys.map((k) => (
          <KeyControl
            onError={handleError}
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
