export interface Task {
  id: string;
  userId: string;
  title: string;
  dueDate: string;
  summary: string;
};

export interface NewTaskData {
  title: string;
  summary: string;
  date: string;
}