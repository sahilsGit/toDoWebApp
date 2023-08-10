class Task {
    constructor(name, description, estimatedDays, severity, isDone, startDate) {
        this.name = name;
        this.description = description;
        this.estimatedDays = estimatedDays;
        this.isDone = isDone;
        this.startDate = startDate;
    }
    
    markComplete() {
        this.isDone = true;
    }

    updateTask(updates) {
        for (const property in updates) {
            if (this.hasOwnProperty(property)) {
                this[property] = updates[property];
            }
        }
    }
}

export default Task
