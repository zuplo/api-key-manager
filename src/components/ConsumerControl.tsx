import { useState } from "react";
import { useQueryEngineContext } from "../hooks/useQueryEngineContext";
import { Consumer, MenuItem } from "../interfaces/main";
import { SimpleMenu } from "./SimpleMenu";
import {
  EllipsisHorizontalIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import KeyControl from "./KeyControl";

interface ConsumerControlProps {
  consumer: Consumer;
  menuItems?: MenuItem[];
}

const ConsumerControl = ({ consumer, menuItems }: ConsumerControlProps) => {
  const [edit, setEdit] = useState(false);
  const [description, setDescription] = useState(consumer.description);
  const { useConsumerDescriptionMutation } = useQueryEngineContext();
  const consumerDescriptionMutation = useConsumerDescriptionMutation();

  const saveFn = async () => {
    // We're in edit mode, so change description
    await consumerDescriptionMutation.mutate({
      consumerName: consumer.name,
      description,
    });

    setEdit(false);
  };

  // const mode: "edit" | "view" | "saving" = edit
  //   ? consumerDescriptionMutation.isLoading
  //     ? "saving"
  //     : "edit"
  //   : "view";

  const editItem = {
    label: "Edit Label",
    action: () => {
      setEdit(true);
    },
  };

  const fancyDropDownMenuItems = [
    editItem,
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
    <div className="rounded-lg bg-gray-200 border-gray-200 border mb-5">
      <div className="flex flex-row justify-between items-center h-10">
        {edit ? (
          <div className="flex flex-row w-full">
            <input
              autoFocus={true}
              onFocus={(event) => event.target.select()}
              type="text"
              className="flex-1 rounded border border-gray-400 m-1 px-2 bg-gray-100 w-full py-1"
              onChange={(e) => setDescription(e.target.value)}
              defaultValue={consumer.description}
            />
            <button
              className="hover:bg-gray-300 px-2 flex-0 rounded flex flex-row items-center text-sm m-1 h-8"
              disabled={consumerDescriptionMutation.isLoading}
              onClick={() => saveFn()}
            >
              {consumerDescriptionMutation.isLoading ? (
                <div className="mr-2">TODO: Spinner</div>
              ) : (
                <img src="/save.svg" className="h-4 w-auto mr-2" alt="Save" />
              )}
              <span>Save</span>
            </button>
          </div>
        ) : (
          <div className="p-2">{consumer.description ?? consumer.name}</div>
        )}
        <div className="m-1">
          <SimpleMenu items={fancyDropDownMenuItems ?? []}>
            <div className="hover:bg-gray-300 p-2 rounded">
              <EllipsisHorizontalIcon className="h-4 w-4" />
            </div>
          </SimpleMenu>
        </div>
      </div>
      {Boolean(consumerDescriptionMutation.error) && (
        <div className="p-2 text-red-600 bg-red-50 text-sm">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center">
              <XCircleIcon className="h-4 w-4 mr-1" />
              <span className="font-bold">Error</span>
            </div>
          </div>
          <div className="pl-5 text-red-500">
            &quot;{consumerDescriptionMutation.error?.toString()}&quot;
          </div>
        </div>
      )}
      <div className="bg-white rounded-b-lg p-2">
        {consumer.apiKeys.map((k) => (
          <KeyControl key={k.id} apiKey={k} consumerName={consumer.name} />
        ))}
      </div>
    </div>
  );
};

export default ConsumerControl;
