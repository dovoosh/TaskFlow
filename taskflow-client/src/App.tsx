import { FormEvent, useEffect, useState } from "react";
import {
  createProject,
  deleteProject,
  getProjects,
  type Project,
} from "./api/projectsApi";
import "./App.css";

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function loadProjects() {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch {
      setError("Could not load projects.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      const newProject = await createProject({ name, description });
      setProjects([newProject, ...projects]);
      setName("");
      setDescription("");
    } catch {
      setError("Could not create project.");
    }
  }

  async function handleDelete(id: number) {
  try {
    await deleteProject(id);
    setProjects(projects.filter((project) => project.id !== id));
  } catch {
    setError("Could not delete project.");
  }
}

  if (loading) return <p>Loading projects...</p>;

  return (
    <main>
      <h1>TaskFlow Projects</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Project name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <button type="submit">Create Project</button>
      </form>

      {error && <p>{error}</p>}

      {projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <strong>{project.name}</strong>
              <p>{project.description}</p>

              <button onClick={() => handleDelete(project.id)}>
                Delete
              </button>
            </li>
          ))}
</ul>
      )}
    </main>
  );
}

export default App;