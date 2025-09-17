using Microsoft.EntityFrameworkCore;
using TarjetasAPI.Data; // ⚠️ Asegurate que AppDbContext esté acá

var builder = WebApplication.CreateBuilder(args);

// ----------------- Configurar DbContext -----------------
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ----------------- Habilitar CORS para Angular -----------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy
            .AllowAnyOrigin()   // ⚠️ Cambiar por tu URL de Angular en producción
            .AllowAnyHeader()
            .AllowAnyMethod());
});

// ----------------- Swagger -----------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ----------------- Controladores -----------------
builder.Services.AddControllers();

var app = builder.Build();

// ----------------- Pipeline -----------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAngular");

app.MapControllers();

// ----------------- Endpoint de prueba (opcional) -----------------
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();

// ----------------- Record auxiliar -----------------
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
