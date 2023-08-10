import Project from "./Project";

class ProjectManager {
    constructor() {
        this.projects = {};
    }

    createProject(name, description, estimatedDays, isDone, startDate) {
        const project = new Project(name, description, estimatedDays, isDone, startDate);
        this.projects[project.id] = project;
        return project;
    }

    updateProject(project, updates) {
        for (const property in updates) {
            if (project.hasOwnProperty(property)) {
                project[property] = updates[property];
            }
        }
    }

    deleteProjectById(id) {
        delete this.projects[id];
    }

    getProjectById(id) {
        return this.projects[id]
    }

    getAllProjects() {
        // return this.projects;
        return Object.values(this.projects);
    }
}

export default ProjectManager