export type BatteryProp = {
    charging: boolean,
    level: number,
};
export type Task = {
    id?: string | null,
    title: string,
    description: string,
    status: TaskStatuses,
};
export type TaskStatuses = "todo" | "in-progress" | "done";