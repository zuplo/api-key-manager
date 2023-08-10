// This component is designed to allow consumers to programmatically refresh the data model.

export const refreshEventName = "refresh";

export class RefreshProvider extends EventTarget {
  constructor() {
    super();
  }

  refresh() {
    const event = new CustomEvent(refreshEventName);
    this.dispatchEvent(event);
  }
}
