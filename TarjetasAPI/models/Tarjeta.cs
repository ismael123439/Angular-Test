namespace TarjetasAPI.Models
{
public class Tarjeta
{
    public int Id { get; set; }
    public string NumeroTarjeta { get; set; } = ""; // 👈 Nombre exacto del campo
    public string Titular { get; set; } = "";
    public DateTime FechaVencimiento { get; set; } // 👈 Nombre exacto del campo
    public string CodigoSeguridad { get; set; } = "";
}
}
