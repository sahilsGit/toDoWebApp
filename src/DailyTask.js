import Task from "./Task";
import { v4 as uuidv4 } from 'uuid';

class DailyTask extends Task {
    constructor(name, description, isDone, projectID, startDate, day) {
        super(name, description, null, isDone, startDate); // We pass null as estimatedDays since it's not used for DailyTask
        this.projectID = projectID;
        this.id = uuidv4(); // Generate UUID for daily task
        this.day = day;
    }
}

export default DailyTask