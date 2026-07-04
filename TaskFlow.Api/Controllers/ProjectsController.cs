using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Api.Data;
using TaskFlow.Api.Models;

namespace TaskFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly TaskFlowDbContext _context;

    public ProjectsController(TaskFlowDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Project>>> GetProjects()
    {
        return await _context.Projects
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Project>> CreateProject(Project project)
    {
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProjects), new { id = project.Id }, project);
    }
}