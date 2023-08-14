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
        this.weeklyTasks[newWeeklyTask.week] = newWeeklyTask;

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
        this.dailyTasks[newDailyTask.day] = newDailyTask;

        this.nextDailyTaskDate = this.calNextDailyTaskDate();


        // Check if the new daily task belongs to a weekly task and add its reference (UUID) to the weekly task's dailyTasks list

        for (const weeklyTaskNo in this.weeklyTasks) {

            const weeklyTask = this.weeklyTasks[weeklyTaskNo];

            const endOfWeek = new Date(weeklyTask.startDate);
            endOfWeek.setDate(endOfWeek.getDate() + 7);

            if (
                newDailyTask.startDate >= weeklyTask.startDate &&
                newDailyTask.startDate < endOfWeek
            ) {
                weeklyTask.dailyTasks.push(newDailyTask.day); // Push the day pointer to corresponding weekTask 
                break; // Assuming that a daily task cannot belong to multiple weekly tasks within the same project
            }
        }
    
    }

    removeFromWeeklyTasks(week) {

        if (this.weeklyTasks[week]) {
            const removedWeek = this.weeklyTasks[week];
            delete this.weeklyTasks[week];
            const currentDate = new Date();

            for (let dayToRemove of removedWeek.dailyTasks) {
                this.removeFromDailyTasks(dayToRemove)
            }
 
            // Check if the removed week is ongoing
            if (removedWeek.startDate <= currentDate && this.weeklyTasks[week + 1]) {
                let nextDate = removedWeek.startDate
                for (let i = week + 1; i < Object.keys(this.weeklyTasks).length; i++) {

                    let comingWeekDate = this.weeklyTasks[i].startDate;
                    this.weeklyTasks[i].startDate = nextDate;
                    nextDate = comingWeekDate;
                }

            }

            else if (removedWeek.startDate <= currentDate && !this.weeklyTasks[week + 1]) {
                this.nextWeeklyTaskDate = removedWeek.startDate
            }

        }
            
    }
        
    removeFromDailyTasks(day) {
        if (this.dailyTasks[day]) {
            // Remove the daily task
            delete this.dailyTasks[day];
    
            // Update nextDailyTaskDate
            this.updateNextDailyTaskDate();
    
            // Remove the reference from associated weekly tasks
            for (const weeklyTaskNo in this.weeklyTasks) {
                const weeklyTask = this.weeklyTasks[weeklyTaskNo];
                const index = weeklyTask.dailyTasks.indexOf(day);
                if (index !== -1) {
                    weeklyTask.dailyTasks.splice(index, 1);
                    break;
                }
            }
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
