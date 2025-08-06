using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using CurrencyAPI.Application.Interfaces;
using CurrencyAPI.Application.Services;
using CurrencyAPI.Domain.Interfaces;
using CurrencyAPI.Infrastructure.Repositories;
using CurrencyAPI.Infrastructure.Data;
using CurrencyAPI.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient();
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Information);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ICurrencyRepository, CurrencyRepository>();
builder.Services.AddScoped<ICurrencyService, CurrencyService>();

builder.Services.AddScoped<IHistoryRepository, HistoryRepository>();
builder.Services.AddScoped<IHistoryService, HistoryService>();

builder.Services.AddHostedService<ExternalApiWorker>();

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Event API",
        Version = "v1",
        Description = "API para gerenciamento de eventos",
        Contact = new OpenApiContact
        {
            Name = "Jade Nogueira",
            Email = "jade.silva@fatec.sp.gov.br"
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Event API V1");
        options.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

app.MapControllers();
app.Run();