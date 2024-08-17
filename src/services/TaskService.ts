import { uniqueId } from "lodash";
import indexDBService, { dbStores } from "../utils/indexedDB";
import { Task } from "../pages/dashboard/types";

const addTask = async (task: Task) => {
  const taskPayload = {
    id: uniqueId(),
    ...task,
    time: new Date().toISOString(),
  };
  await indexDBService.saveItem(taskPayload, dbStores.tasks);
};
const getAllTasks = async () => {
  const savedTasks = indexDBService.getAllItems(dbStores.tasks) || [];
  return savedTasks;
};
const taskService = {
  addTask,
  getAllTasks,
};
export default taskService;
