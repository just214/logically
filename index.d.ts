type Access = {
  [id: string]: boolean;
}

type Checklist = {
  [id: string]: {
    title: string;
    isCompleted: boolean;
  }
}

interface Task {
  id: string;
  createdDate: string; 
  createdBy: string; // is the owner
  lastModifiedDate: string;
  lastModifiedBy: string;
  access: Access;
  title: string;
  notes: string;
  checklist: Checklist;
  dueDate: string;
  startTime: string;
  duration: number // milliseconds maybe?
}