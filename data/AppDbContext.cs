using Microsoft.EntityFrameworkCore;
using TarjetasAPI.Models;

namespace TarjetasAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Tarjeta> Tarjetas { get; set; }
    }
}
