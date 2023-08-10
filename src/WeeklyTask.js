import Task from "./Task";

class WeeklyTask extends Task {
    constructor(name, description, isDone, projectID, startDate) {
        super(name, description, null, isDone, startDate); // We pass null as estimatedDays since it's not used for WeeklyTask
        this.projectID = projectID;
        this.dailyTasks = {};
    }
}

export default WeeklyTask
