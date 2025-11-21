using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GerenciamentoZoo.Api.Data;
using GerenciamentoZoo.Api.Models;

[Route("api/[controller]")]
[ApiController]
public class AnimaisController : ControllerBase
{
    private readonly ZooContext _context;

    public AnimaisController(ZooContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Animal>>> GetAnimais()
    {
        return await _context.Animais.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Animal>> GetAnimal(int id)
    {
        var animal = await _context.Animais.FindAsync(id);

        if (animal == null)
        {
            return NotFound();
        }

        return animal;
    }

   [HttpPost]
    public async Task<ActionResult<List<Animal>>> PostAnimais(List<Animal> animais)
    {
        if (animais == null || animais.Count == 0)
        {
            return BadRequest("A lista de animais não pode ser vazia.");
        }

        foreach (var animal in animais)
        {
            if (string.IsNullOrWhiteSpace(animal.Nome) || string.IsNullOrWhiteSpace(animal.Especie))
            {
                return BadRequest($"Nome e Espécie são obrigatórios para todos os animais na lista.");
            }
          
            if (animal.DataEntradaNoZoo == null)
            {
                animal.DataEntradaNoZoo = DateTime.Now;
            }
        }
        
        _context.Animais.AddRange(animais); 
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAnimais), animais);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutAnimal(int id, Animal animal)
    {
        if (id != animal.Id)
        {
            return BadRequest("O ID na URL e o ID do objeto não correspondem.");
        }
        
        if (string.IsNullOrWhiteSpace(animal.Nome) || string.IsNullOrWhiteSpace(animal.Especie))
        {
            return BadRequest("Nome e Espécie são obrigatórios.");
        }

        _context.Entry(animal).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Animais.Any(e => e.Id == id))
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
    public async Task<IActionResult> DeleteAnimal(int id)
    {
        var animal = await _context.Animais.FindAsync(id);
        
        if (animal == null)
        {
            return NotFound(); 
        }

        _context.Animais.Remove(animal);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}