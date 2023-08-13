import { v4 as uuidv4 } from 'uuid';
import DailyTask from './DailyTask';
import WeeklyTask from './WeeklyTask';

class Project {
    constructor(name, description, estimatedDays, isDone, startDate=null) {
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
        this.setEndDate();
        this.weekCount = 0;
        this.dayCount = 0;

        console.log(`Project Instance created, here's your project id: ${this.id} `)
        console.log(typeof(this.estimatedDays))
    }

    markComplete() {
        this.isDone = true;
    }

    setEndDate() {
        this.endDate = new Date(this.startDate);
        this.endDate.setDate(this.startDate.getDate() + this.estimatedDays);
    }


    calNextWeeklyTaskDate() {

        let nextWeekly = new Date(this.nextWeeklyTaskDate);

        if (Object.keys(this.weeklyTasks).length > 0) {
            nextWeekly.setDate(nextWeekly.getDate() + 7);
        }

        return new Date(nextWeekly);
    }

    calNextDailyTaskDate() {

        let nextDaily = new Date(this.nextDailyTaskDate);

        if (Object.keys(this.dailyTasks).length > 0) {
            nextDaily.setDate(nextDaily.getDate() + 1);
        }

        return new Date(nextDaily);
    }

    appendToWeeklyTasks(assignedTask, description) {

        let newWeeklyTask = new WeeklyTask(
            assignedTask,
            description,
            false, // Weekly tasks start as not completed
            this.id, // Reference to the project the weekly task belongs to
            this.nextWeeklyTaskDate,
            this.weekCount + 1
        );
        
        this.weekCount ++
        this.weeklyTasks[newWeeklyTask.id] = newWeeklyTask;

        this.nextWeeklyTaskDate = this.calNextWeeklyTaskDate();
    }

    appendToDailyTasks(dailyTask, description) {

        let newDailyTask = new DailyTask(
            dailyTask,
            description,
            false,
            this.id,
            this.nextDailyTaskDate,
            this.dayCount + 1
        );
        
        this.dayCount ++
        this.dailyTasks[newDailyTask.id] = newDailyTask;

        this.nextDailyTaskDate = this.calNextDailyTaskDate();


        // Check if the new daily task belongs to a weekly task and add its reference (UUID) to the weekly task's dailyTasks list

        for (const weeklyTaskId in this.weeklyTasks) {

            const weeklyTask = this.weeklyTasks[weeklyTaskId];

            const endOfWeek = new Date(weeklyTask.startDate);
            endOfWeek.setDate(endOfWeek.getDate() + 7);

            if (
                newDailyTask.startDate >= weeklyTask.startDate &&
                newDailyTask.startDate < endOfWeek
            ) {
                weeklyTask.dailyTasks.push(newDailyTask.day); // Push the UUID of the daily task
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

export default Project
