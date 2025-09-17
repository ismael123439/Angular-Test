namespace TarjetasAPI.Models
{
    public class Tarjeta
    {
        public int Id { get; set; }
        public string Titular { get; set; } = string.Empty;
        public string Numero { get; set; } = string.Empty;
        public string FechaExpiracion { get; set; } = string.Empty;
        public string CVV { get; set; } = string.Empty;
    }
}
