using System;

namespace GerenciamentoZoo.Api.Models
{
    public class Cuidado
    {
        public int Id { get; set; }
        public string? Nome { get; set; }
        public string? Descricao { get; set; }
        public string? Frequencia { get; set; }
        public int AnimalId { get; set; }
        public Animal? Animal { get; set; }
    }
}