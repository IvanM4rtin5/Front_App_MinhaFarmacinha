import { Notify } from "quasar";

export function useNotify() {
  const success = (message: string) => {
    Notify.create({
      type: "positive",
      message,
      position: "top-right",
      classes: "my-notify",
      color: "positive",
      icon: "done",
      timeout: 3000,
      attrs: {
        "data-type": "positive",
      },
    });
  };

  const error = (message: string) => {
    Notify.create({
      type: "negative",
      message,
      position: "top-right",
      classes: "my-notify",
      color: "negative",
      icon: "warning",
      timeout: 3000,
      attrs: {
        "data-type": "negative",
      },
    });
  };

  const warning = (message: string) => {
    Notify.create({
      type: "warning",
      message,
      position: "top-right",
      classes: "my-notify",
      color: "warning",
      icon: "error_outline",
      timeout: 3000,
      attrs: {
        "data-type": "warning",
      },
    });
  };

  const info = (message: string) => {
    Notify.create({
      type: "info",
      message,
      position: "top-right",
      classes: "my-notify",
      color: "info",
      icon: "info",
      timeout: 3000,
      attrs: {
        "data-type": "info",
      },
    });
  };

  return { success, error, warning, info };
}
