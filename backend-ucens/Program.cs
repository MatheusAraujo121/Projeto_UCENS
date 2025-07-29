using Microsoft.EntityFrameworkCore;
using userApi.Application.Services;
using userApi.Domain.Interfaces;
using userApi.Infrastructure.Data;
using userApi.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Configura EF Core com SQLite
builder.Services.AddDbContext<UserDbContext>(options =>
    options.UseSqlite("Data Source=user.db"));

// Injeta dependências
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<UserService>();

// Adiciona controllers e Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Ativa Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
