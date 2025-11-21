using Microsoft.EntityFrameworkCore;
using GerenciamentoZoo.Api.Models; 

namespace GerenciamentoZoo.Api.Data
{
    public class ZooContext : DbContext
    {
        public ZooContext(DbContextOptions<ZooContext> options) : base(options)
        {
        }
        public DbSet<Animal> Animais { get; set; } 
        public DbSet<Cuidado> Cuidados { get; set; }
    }
}