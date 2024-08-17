import { notification } from "antd";
import { parseError } from "./server";
import { NotificationPlacement } from "antd/es/notification/interface";

type NotificationType = "success" | "info" | "warning" | "error";

export const showServerError = (error: any) => {
  const errorMessage = parseError(error);
  showMessage("Request Failed", errorMessage, "error");
};

export const showError = (error: any) => {
  const errorMessage = parseError(error);
  showMessage("Error!", errorMessage, "error");
};

export const showMessage = (
  description: string,
  type: NotificationType = "success",
  title?: string,
  placement?: NotificationPlacement
) => {
  const notificationPlacement: NotificationPlacement = placement || "bottom";
  notification.open({
    type: type,
    message: title || description,
    description: title ? description : '',
    placement: notificationPlacement,
  });
};
