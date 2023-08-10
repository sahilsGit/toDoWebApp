import ProjectManager from './ProjectManager'

window.myManager = new ProjectManager();

function handleFormData(event) {
    event.preventDefault();

    const projectForm = document.querySelector(".projectForm");

    const pName = projectForm.projectName.value;
    const pDesc = projectForm.description.value;
    const pEstimatedDays = projectForm.estimatedDays.value; 
    const pSeverity = projectForm.projectSeverity.value;
    const pIsDone = projectForm.isDone.checked;
    const pStartDate = projectForm.startDate.value;

    myManager.createProject(pName, pDesc, pEstimatedDays, pSeverity, pIsDone, pStartDate);

    // Reset the form data
    projectForm.reset();
}

const projectForm = document.querySelector(".projectForm");
projectForm.addEventListener("submit", handleFormData);

console.log(myManager);









