using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GerenciamentoZoo.Api.Data;
using GerenciamentoZoo.Api.Models;

[Route("api/[controller]")]
[ApiController]
public class CuidadosController : ControllerBase
{
    private readonly ZooContext _context;

    public CuidadosController(ZooContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Cuidado>>> GetCuidados()
    {
        return await _context.Cuidados.Include(c => c.Animal).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Cuidado>> GetCuidado(int id)
    {
        var cuidado = await _context.Cuidados.Include(c => c.Animal).FirstOrDefaultAsync(c => c.Id == id);

        if (cuidado == null)
        {
            return NotFound();
        }

        return cuidado;
    }

    [HttpPost]
    public async Task<ActionResult<Cuidado>> PostCuidado(Cuidado cuidado)
    {
        if (string.IsNullOrWhiteSpace(cuidado.Nome) || string.IsNullOrWhiteSpace(cuidado.Frequencia))
        {
            return BadRequest("Nome e Frequência do cuidado são obrigatórios.");
        }
        
        _context.Cuidados.Add(cuidado);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCuidado), new { id = cuidado.Id }, cuidado);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutCuidado(int id, Cuidado cuidado)
    {
        if (id != cuidado.Id)
        {
            return BadRequest("O ID na URL e o ID do objeto não correspondem.");
        }
        
        _context.Entry(cuidado).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Cuidados.Any(e => e.Id == id))
            {
                return NotFound(); 
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCuidado(int id)
    {
        var cuidado = await _context.Cuidados.FindAsync(id);
        
        if (cuidado == null)
        {
            return NotFound(); 
        }

        _context.Cuidados.Remove(cuidado);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}