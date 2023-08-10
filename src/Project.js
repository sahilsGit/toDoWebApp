class Project {
    constructor(name, description, estimatedDays, isDone, startDate = null) {
        this.name = name;
        this.description = description;
        this.estimatedDays = estimatedDays;
        this.isDone = isDone;

        if (startDate !== null) {
            this.startDate = new Date(startDate);
        } else {
            this.startDate = new Date();
        }

        this.id = uuidv4();
        this.weeklyTasks = {};
        this.dailyTasks = {};
        this.nextWeeklyTaskDate = this.startDate;
        this.nextDailyTaskDate = this.startDate;

        console.log(`Project Instance created, here's your project id: ${this.id} `)
    }

    markComplete() {
        this.isDone = true;
    }

    setEndDate() {
        let endDate;
    
        if (this.startDate === null) {
            endDate = new Date();
            
        } else {
            endDate = new Date(this.startDate);
        }

        endDate.setDate(endDate.getDate() + this.estimatedDays);
        this.endDate = endDate; // Set the endDate property on the object
    }


    static calNextWeeklyTaskDate(weeklyTasks, LatestWeeklyDate) {

        const startDate = LatestWeeklyDate;

        if (Object.keys(weeklyTasks).length > 0) {
            startDate.setDate(startDate.getDate() + 7);
        }

        return startDate;
    }


    static calNextDailyTaskDate(dailyTasks, latestDailyDate) {

        const startDate = latestDailyDate;

        if (Object.keys(dailyTasks).length > 0) {
            startDate.setDate(startDate.getDate() + 1);
        }

        return startDate;
    }

    appendToWeeklyTasks(assignedTask, description) {

        let weeklyTask = new WeeklyTask(
            assignedTask,
            description,
            false, // Weekly tasks start as not completed
            this.id, // Reference to the project the weekly task belongs to
            this.nextWeeklyTaskDate
        );

        this.weeklyTasks[weeklyTask.id] = weeklyTask;

        this.nextWeeklyTaskDate = Project.calNextWeeklyTaskDate(this.weeklyTasks, this.nextWeeklyTaskDate);

    }

    appendToDailyTasks(dailyTask, description) {

        let newDailyTask = new DailyTask(
            dailyTask,
            description,
            false,
            this.id,
            this.nextDailyTaskDate
        );

        this.dailyTasks[newDailyTask.id] = newDailyTask;

        this.nextDailyTaskDate = Project.calNextDailyTaskDate(this.dailyTasks, this.nextDailyTaskDate);


        // Check if the new daily task belongs to a weekly task and add its reference (UUID) to the weekly task's dailyTasks list

        for (const weeklyTaskId in this.weeklyTasks) {
            const weeklyTask = this.weeklyTasks[weeklyTaskId];

            if (
                newDailyTask.startDate >= weeklyTask.startDate &&
                newDailyTask.startDate < new Date(weeklyTask.startDate.getDate() + 7)
            ) {
                weeklyTask.dailyTasks.push(newDailyTask.id); // Push the UUID of the daily task
                break; // Assuming that a daily task cannot belong to multiple weekly tasks within the same project
            }
        }
    
    }


    removeFromWeeklyTasks(taskIdToRemove) {
        if (this.weeklyTasks[taskIdToRemove]) {
            const removedWeek = this.weeklyTasks[taskIdToRemove];

            // Remove the week
            delete this.weeklyTasks[taskIdToRemove];

            const currentDate = new Date();

            // Check if the removed week is ongoing
            if (removedWeek.startDate <= currentDate && currentDate < removedWeek.nextWeeklyTaskDate) {
                // Adjust the start dates of upcoming weeks
                for (const taskId in this.weeklyTasks) {
                    const week = this.weeklyTasks[taskId];
                    if (week.startDate >= removedWeek.nextWeeklyTaskDate) {
                        week.startDate = new Date();
                    }
                }
                // Update nextWeeklyTaskDate
                this.updateNextWeeklyTaskDate();
            }
        }
    }

    removeFromDailyTasks(taskIdToRemove) {
        if (this.dailyTasks[taskIdToRemove]) {
            // Remove the daily task
            delete this.dailyTasks[taskIdToRemove];

            // Update nextDailyTaskDate
            this.updateNextDailyTaskDate();
        }
    }

    updateNextWeeklyTaskDate() {
        const dates = Object.values(this.weeklyTasks).map(week => week.startDate);
        if (dates.length > 0) {
            this.nextWeeklyTaskDate = new Date(Math.min(...dates));
        } else {
            this.nextWeeklyTaskDate = null; // No more weekly tasks
        }
    }

    updateNextDailyTaskDate() {
        const dates = Object.values(this.dailyTasks).map(task => task.startDate);
        if (dates.length > 0) {
            this.nextDailyTaskDate = new Date(Math.min(...dates));
        } else {
            this.nextDailyTaskDate = null; // No more daily tasks
        }
    }

}
