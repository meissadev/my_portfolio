const projectList = document.getElementById("project-list");
const projectForm = document.getElementById("project-form");
const projectIdInput = document.getElementById("project-id");
const formTitle = document.getElementById("form-title");
const submitButton = document.getElementById("submit-button");
const cancelEditButton = document.getElementById("cancel-edit");
const refreshProjectsButton = document.getElementById("refresh-projects");
const formFeedback = document.getElementById("form-feedback");
const projectsFeedback = document.getElementById("projects-feedback");
const imageDropzone = document.getElementById("image-dropzone");
const imageFileInput = document.getElementById("imageFile");
const imagePreviewWrapper = document.getElementById("image-preview-wrapper");
const imagePreview = document.getElementById("image-preview");
const imageMeta = document.getElementById("image-meta");
const selectImageButton = document.getElementById("select-image");
const removeImageButton = document.getElementById("remove-image");

const fields = {
  title: document.getElementById("title"),
  description: document.getElementById("description"),
  technologies: document.getElementById("technologies"),
  githubUrl: document.getElementById("githubUrl"),
  demoUrl: document.getElementById("demoUrl"),
  status: document.getElementById("status")
};

const apiBaseUrl = window.location.protocol === "file:" ? "http://localhost:5000" : window.location.origin;
const projectEndpoint = `${apiBaseUrl}/api/projects`;
const maxImageSize = 5 * 1024 * 1024;
let currentImageValue = "";

const parseApiResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const bodyText = await response.text();

  if (!contentType.includes("application/json")) {
    throw new Error(
      "L API ne repond pas en JSON. Ouvre l application via http://localhost:5000 et verifie que le serveur Express est demarre."
    );
  }

  try {
    return JSON.parse(bodyText);
  } catch (error) {
    throw new Error("La reponse de l API est invalide.");
  }
};

const setFormMessage = (message, isError = false) => {
  formFeedback.textContent = message;
  formFeedback.classList.toggle("is-error", isError);
  formFeedback.classList.toggle("is-success", !isError && Boolean(message));
};

const setProjectsMessage = (message, isError = false) => {
  projectsFeedback.textContent = message;
  projectsFeedback.classList.toggle("is-error", isError);
};

const resetForm = () => {
  projectForm.reset();
  projectIdInput.value = "";
  fields.status.value = "planifie";
  formTitle.textContent = "Ajouter un projet";
  submitButton.textContent = "Ajouter le projet";
  cancelEditButton.classList.add("hidden");
  resetImageState();
};

const getPayload = () => ({
  title: fields.title.value.trim(),
  description: fields.description.value.trim(),
  technologies: fields.technologies.value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),
  imageUrl: currentImageValue,
  githubUrl: fields.githubUrl.value.trim(),
  demoUrl: fields.demoUrl.value.trim(),
  status: fields.status.value
});

const setImagePreview = (imageValue, metaText) => {
  currentImageValue = imageValue || "";

  if (currentImageValue) {
    imagePreview.src = currentImageValue;
    imagePreviewWrapper.classList.remove("hidden");
    removeImageButton.classList.remove("hidden");
    imageMeta.textContent = metaText || "Image prete.";
    imageDropzone.classList.add("has-image");
    return;
  }

  imagePreview.removeAttribute("src");
  imagePreviewWrapper.classList.add("hidden");
  removeImageButton.classList.add("hidden");
  imageMeta.textContent = "Aucune image selectionnee.";
  imageDropzone.classList.remove("has-image");
};

const resetImageState = () => {
  imageFileInput.value = "";
  setImagePreview("", "Aucune image selectionnee.");
};

const readImageFile = (file) =>
  new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      reject(new Error("Le fichier selectionne doit etre une image."));
      return;
    }

    if (file.size > maxImageSize) {
      reject(new Error("L image doit faire moins de 5 Mo."));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Lecture de l image impossible."));
    reader.readAsDataURL(file);
  });

const applyImageFile = async (file) => {
  try {
    const imageValue = await readImageFile(file);
    setImagePreview(imageValue, `${file.name} (${Math.round(file.size / 1024)} Ko)`);
    setFormMessage("");
  } catch (error) {
    setFormMessage(error.message, true);
  }
};

const fillForm = (project) => {
  projectIdInput.value = project._id;
  fields.title.value = project.title || "";
  fields.description.value = project.description || "";
  fields.technologies.value = Array.isArray(project.technologies)
    ? project.technologies.join(", ")
    : "";
  fields.githubUrl.value = project.githubUrl || "";
  fields.demoUrl.value = project.demoUrl || "";
  fields.status.value = project.status || "planifie";
  formTitle.textContent = "Modifier un projet";
  submitButton.textContent = "Enregistrer les modifications";
  cancelEditButton.classList.remove("hidden");
  setImagePreview(project.imageUrl || "", project.imageUrl ? "Image actuelle du projet." : "Aucune image selectionnee.");
  setFormMessage("Mode modification active.");
  projectForm.scrollIntoView({ behavior: "smooth", block: "start" });
};

const createProjectCard = (project) => {
  const article = document.createElement("article");
  article.className = "project-card";

  const technologies = Array.isArray(project.technologies) && project.technologies.length
    ? `<div class="project-tech-list">${project.technologies
        .map((tech) => `<span>${tech}</span>`)
        .join("")}</div>`
    : "";

  const imageMarkup = project.imageUrl
    ? `<img class="project-image" src="${project.imageUrl}" alt="Image du projet ${project.title}">`
    : `<div class="project-image project-image-placeholder">Aucune image</div>`;

  const links = [
    project.githubUrl
      ? `<a href="${project.githubUrl}" target="_blank" rel="noreferrer">GitHub</a>`
      : "",
    project.demoUrl
      ? `<a href="${project.demoUrl}" target="_blank" rel="noreferrer">Demo</a>`
      : ""
  ]
    .filter(Boolean)
    .join("");

  article.innerHTML = `
    ${imageMarkup}
    <p class="project-tag">${project.status || "planifie"}</p>
    <h3>${project.title}</h3>
    <p>${project.description}</p>
    ${technologies}
    <div class="project-links">${links}</div>
    <div class="project-actions">
      <button class="button button-secondary button-small" type="button" data-action="edit">Modifier</button>
      <button class="button button-danger button-small" type="button" data-action="delete">Supprimer</button>
    </div>
  `;

  article.querySelector('[data-action="edit"]').addEventListener("click", () => fillForm(project));
  article.querySelector('[data-action="delete"]').addEventListener("click", () => deleteProject(project._id));

  return article;
};

const fetchProjects = async () => {
  setProjectsMessage("Chargement des projets...");

  try {
    const response = await fetch(projectEndpoint);
    const result = await parseApiResponse(response);

    if (!response.ok) {
      throw new Error(result.message || "Impossible de charger les projets.");
    }

    projectList.innerHTML = "";

    if (!result.data.length) {
      projectList.innerHTML = '<div class="empty-state">Aucun projet enregistre pour le moment.</div>';
      setProjectsMessage("");
      return;
    }

    result.data.forEach((project) => {
      projectList.appendChild(createProjectCard(project));
    });

    setProjectsMessage(`${result.count} projet(s) charge(s).`);
  } catch (error) {
    projectList.innerHTML =
      '<div class="empty-state">Connexion impossible a l API ou a MongoDB.</div>';
    setProjectsMessage(error.message, true);
  }
};

const deleteProject = async (projectId) => {
  const confirmed = window.confirm("Supprimer ce projet ?");

  if (!confirmed) {
    return;
  }

  setProjectsMessage("Suppression en cours...");

  try {
    const response = await fetch(`${projectEndpoint}/${projectId}`, {
      method: "DELETE"
    });
    const result = await parseApiResponse(response);

    if (!response.ok) {
      throw new Error(result.message || "Suppression impossible.");
    }

    if (projectIdInput.value === projectId) {
      resetForm();
    }

    setProjectsMessage(result.message);
    await fetchProjects();
  } catch (error) {
    setProjectsMessage(error.message, true);
  }
};

projectForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = getPayload();
  const projectId = projectIdInput.value;
  const isEditing = Boolean(projectId);

  setFormMessage(isEditing ? "Modification en cours..." : "Ajout en cours...");

  try {
    const response = await fetch(isEditing ? `${projectEndpoint}/${projectId}` : projectEndpoint, {
      method: isEditing ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await parseApiResponse(response);

    if (!response.ok) {
      throw new Error(result.message || "Operation impossible.");
    }

    resetForm();
    setFormMessage(result.message);
    await fetchProjects();
  } catch (error) {
    setFormMessage(error.message, true);
  }
});

cancelEditButton.addEventListener("click", () => {
  resetForm();
  setFormMessage("Modification annulee.");
});

refreshProjectsButton.addEventListener("click", fetchProjects);
selectImageButton.addEventListener("click", () => imageFileInput.click());
removeImageButton.addEventListener("click", () => {
  resetImageState();
  setFormMessage("Image retiree.");
});
imageFileInput.addEventListener("change", (event) => {
  const [file] = event.target.files;
  applyImageFile(file);
});

imageDropzone.addEventListener("click", () => imageFileInput.click());
imageDropzone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    imageFileInput.click();
  }
});
["dragenter", "dragover"].forEach((eventName) => {
  imageDropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    imageDropzone.classList.add("is-dragging");
  });
});
["dragleave", "dragend", "drop"].forEach((eventName) => {
  imageDropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    imageDropzone.classList.remove("is-dragging");
  });
});
imageDropzone.addEventListener("drop", (event) => {
  const [file] = event.dataTransfer.files;
  applyImageFile(file);
});

const revealables = document.querySelectorAll(
  ".info-card, .timeline-item, .contact-card, .project-form-card"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealables.forEach((element, index) => {
  element.classList.add("reveal");
  element.style.transitionDelay = `${index * 90}ms`;
  observer.observe(element);
});

resetForm();
fetchProjects();
