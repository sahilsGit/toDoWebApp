const { expect } = require('chai');
const { v4: uuidv4 } = require('uuid');
const { ProjectManager, Project, WeeklyTask, DailyTask } = require('./src/main');

describe('ProjectManager', () => {
  let projectManager;

  beforeEach(() => {
    projectManager = new ProjectManager();
  });

  it('should create a new project', () => {
    const project = projectManager.createProject('Test Project', 'Test Description', 10, 3, false, new Date());
    expect(project).to.be.an.instanceOf(Project);
    expect(projectManager.getAllProjects()).to.have.lengthOf(1);
  });

  it('should update an existing project', () => {
    const project = projectManager.createProject('Test Project', 'Test Description', 10, 3, false, new Date());
    const updates = {
      name: 'Updated Project Name',
      description: 'Updated Description',
      estimatedDays: 15,
    };
    projectManager.updateProject(project, updates);
    expect(project.name).to.equal(updates.name);
    expect(project.description).to.equal(updates.description);
    expect(project.estimatedDays).to.equal(updates.estimatedDays);
  });

  it('should delete an existing project', () => {
    const project = projectManager.createProject('Test Project', 'Test Description', 10, 3, false, new Date());
    projectManager.deleteProject(project);
    expect(projectManager.getAllProjects()).to.have.lengthOf(0);
  });
});

describe('Project', () => {
  let project;

  beforeEach(() => {
    project = new Project('Test Project', 'Test Description', 10, 3, false, new Date());
  });

  it('should create weekly tasks with the correct start dates', () => {
    const task1 = 'Task 1';
    const task2 = 'Task 2';
    project.setEndDate(); // Make sure to set the endDate before adding tasks
    project.appendToWeeklyTasks(task1, 'Task 1 description'); // Provide a description for the weekly task
    project.appendToWeeklyTasks(task2, 'Task 2 description'); // Provide a description for the weekly task

    // Assert that the weekly tasks were added correctly
    expect(project.weeklyTasks).to.have.lengthOf(2);
    expect(project.weeklyTasks[0].startDate).to.eql(project.startDate);
    expect(project.weeklyTasks[1].startDate).to.eql(new Date(project.startDate.getTime() + 7 * 24 * 60 * 60 * 1000));
  });

  it('should create daily tasks with the correct start dates', () => {
    const task1 = 'Task 1';
    const task2 = 'Task 2';
    project.setEndDate(); // Make sure to set the endDate before adding tasks
    project.appendToDailyTasks(task1, 'Task 1 description'); // Provide a description for the daily task
    project.appendToDailyTasks(task2, 'Task 2 description'); // Provide a description for the daily task

    // Assert that the daily tasks were added correctly
    expect(project.dailyTasks).to.have.lengthOf(2);
    expect(project.dailyTasks[0].startDate).to.eql(project.startDate);
    expect(project.dailyTasks[1].startDate).to.eql(new Date(project.startDate.getTime() + 1 * 24 * 60 * 60 * 1000));
  });
});

describe('WeeklyTask', () => {
  let weeklyTask;

  beforeEach(() => {
    const projectID = uuidv4();
    const startDate = new Date();
    weeklyTask = new WeeklyTask('Weekly Task', 'Test Description', false, projectID, startDate);
  });

  it('should mark a weekly task as complete', () => {
    weeklyTask.markComplete();
    expect(weeklyTask.isDone).to.be.true;
  });

  it('should update the severity of a weekly task', () => {
    weeklyTask.updatePriority(5);
    expect(weeklyTask.severity).to.equal(5);
  });
});

describe('DailyTask', () => {
  let dailyTask;

  beforeEach(() => {
    const projectID = uuidv4();
    const startDate = new Date();
    dailyTask = new DailyTask('Daily Task', 'Test Description', 3, false, projectID, startDate);
  });

  it('should mark a daily task as complete', () => {
    dailyTask.markComplete();
    expect(dailyTask.isDone).to.be.true;
  });

  it('should update the severity of a daily task', () => {
    dailyTask.updatePriority(2);
    expect(dailyTask.severity).to.equal(2);
  });
});

describe('Project Form Submission', () => {
  it('should handle form data correctly', () => {
    const projectManager = new ProjectManager();
    const projectForm = document.createElement("form");
    const projectNameInput = document.createElement("input");
    const descriptionInput = document.createElement("input");
    const estimatedDaysInput = document.createElement("input");
    const projectSeverityInput = document.createElement("input");
    const isDoneCheckbox = document.createElement("input");
    const submitButton = document.createElement("button");

    projectNameInput.name = "projectName";
    descriptionInput.name = "description";
    estimatedDaysInput.name = "estimatedDays";
    projectSeverityInput.name = "projectSeverity";
    isDoneCheckbox.name = "isDone";
    submitButton.type = "submit";

    projectNameInput.value = "Test Project";
    descriptionInput.value = "Test Description";
    estimatedDaysInput.value = "10";
    projectSeverityInput.value = "3";
    isDoneCheckbox.checked = false;

    projectForm.appendChild(projectNameInput);
    projectForm.appendChild(descriptionInput);
    projectForm.appendChild(estimatedDaysInput);
    projectForm.appendChild(projectSeverityInput);
    projectForm.appendChild(isDoneCheckbox);
    projectForm.appendChild(submitButton);

    const event = { preventDefault: () => {} };
    projectForm.addEventListener("submit", handleFormData);
    projectForm.dispatchEvent(new Event("submit", event));

    const createdProject = projectManager.getAllProjects()[0];

    expect(createdProject.name).to.equal("Test Project");
    expect(createdProject.description).to.equal("Test Description");
    expect(createdProject.estimatedDays).to.equal(10);
    expect(createdProject.severity).to.equal(3);
    expect(createdProject.isDone).to.equal(false);
  });
});
