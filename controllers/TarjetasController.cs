using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TarjetasAPI.Data;
using TarjetasAPI.Models;

namespace TarjetasAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TarjetasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TarjetasController(AppDbContext context)
        {
            _context = context;
        }

        // ----------------- GET: api/Tarjetas -----------------
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tarjeta>>> GetTarjetas()
        {
            return await _context.Tarjetas.ToListAsync();
        }

        // ----------------- GET: api/Tarjetas/5 -----------------
        [HttpGet("{id}")]
        public async Task<ActionResult<Tarjeta>> GetTarjeta(int id)
        {
            var tarjeta = await _context.Tarjetas.FindAsync(id);

            if (tarjeta == null)
                return NotFound(new { mensaje = "Tarjeta no encontrada" });

            return tarjeta;
        }

        // ----------------- POST: api/Tarjetas -----------------
        [HttpPost]
        public async Task<ActionResult<Tarjeta>> PostTarjeta([FromBody] Tarjeta tarjeta)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Tarjetas.Add(tarjeta);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTarjeta), new { id = tarjeta.Id }, tarjeta);
        }

        // ----------------- PUT: api/Tarjetas/5 -----------------
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTarjeta(int id, [FromBody] Tarjeta tarjeta)
        {
            if (id != tarjeta.Id)
                return BadRequest(new { mensaje = "El ID no coincide" });

            _context.Entry(tarjeta).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TarjetaExists(id))
                    return NotFound(new { mensaje = "Tarjeta no encontrada" });
                else
                    throw;
            }

            return NoContent();
        }

        // ----------------- DELETE: api/Tarjetas/5 -----------------
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTarjeta(int id)
        {
            var tarjeta = await _context.Tarjetas.FindAsync(id);
            if (tarjeta == null)
                return NotFound(new { mensaje = "Tarjeta no encontrada" });

            _context.Tarjetas.Remove(tarjeta);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ----------------- Método auxiliar -----------------
        private bool TarjetaExists(int id)
        {
            return _context.Tarjetas.Any(t => t.Id == id);
        }
    }
}
