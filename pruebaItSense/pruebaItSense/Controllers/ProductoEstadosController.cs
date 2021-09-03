using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pruebaItSense.Models;

namespace pruebaItSense.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductoEstadosController : ControllerBase
    {
        private readonly PruebaItSenseContext _context;

        public ProductoEstadosController(PruebaItSenseContext context)
        {
            _context = context;
        }

        // GET: api/ProductoEstados
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductoEstado>>> GetProductoEstados([FromQuery(Name = "estado")] string estado)
        {
            if (string.IsNullOrWhiteSpace(estado))
            {
                return await _context.ProductoEstados.ToListAsync();
            }
            return await _context.ProductoEstados.Where(x => x.IdEstado == int.Parse(estado)).ToListAsync();
        }

        // GET: api/ProductoEstados/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductoEstado>> GetProductoEstado(int id)
        {
            var productoEstado = await _context.ProductoEstados.FindAsync(id);

            if (productoEstado == null)
            {
                return NotFound();
            }

            return productoEstado;
        }

        // PUT: api/ProductoEstados/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductoEstado(int id, ProductoEstado productoEstado)
        {
            if (id != productoEstado.Id)
            {
                return BadRequest();
            }

            _context.Entry(productoEstado).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductoEstadoExists(id))
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

        // POST: api/ProductoEstados
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProductoEstado>> PostProductoEstado(ProductoEstado productoEstado)
        {
            _context.ProductoEstados.Add(productoEstado);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProductoEstado", new { id = productoEstado.Id }, productoEstado);
        }

        // DELETE: api/ProductoEstados/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductoEstado(int id)
        {
            var productoEstado = await _context.ProductoEstados.FindAsync(id);
            if (productoEstado == null)
            {
                return NotFound();
            }

            _context.ProductoEstados.Remove(productoEstado);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductoEstadoExists(int id)
        {
            return _context.ProductoEstados.Any(e => e.Id == id);
        }
    }
}
