import Task from "./Task";
import { v4 as uuidv4 } from 'uuid';

class WeeklyTask extends Task {
    constructor(name, description, isDone, projectID, startDate, week) {
        super(name, description, null, isDone, startDate); // We pass null as estimatedDays since it's not used for WeeklyTask
        this.projectID = projectID;
        this.dailyTasks = [];
        this.id = uuidv4();
        this.week = week;
    }
}

export default WeeklyTask
