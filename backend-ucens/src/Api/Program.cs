using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Infrastructure.Persistence;
using Application.Features.Usuarios;
using Application.Features.Associados;
using Application.Common.Interfaces;
using Infrastructure.Persistence.Repositories;
using Domain;
using Application.Features.Eventos;
using Application.Features.Atividades;
using Application.Features.Turmas;
using Application.Features.Relatorios;
using Application.Features.Contato;

var builder = WebApplication.CreateBuilder(args);

// 1. Configuração do Banco de Dados (DbContext)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Data Source=Nippon.db"));

// 2. Injeção de Dependência (DI): Registrando Services e Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAssociadoRepository, AssociadoRepository>();
builder.Services.AddScoped<IMatriculaAssociadoRepository, MatriculaAssociadoRepository>();
builder.Services.AddScoped<IMatriculaDependenteRepository, MatriculaDependenteRepository>();
builder.Services.AddScoped<ITurmaRepository, TurmaRepository>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));

builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<AssociadoService>();
builder.Services.AddScoped<DependentesService>();
builder.Services.AddScoped<EventoService>();
builder.Services.AddScoped<AtividadeService>();
builder.Services.AddScoped<TurmaService>();
builder.Services.AddScoped<RelatorioService>();
builder.Services.AddScoped<EmailService>();


// 3. Controllers e Swagger
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 4. Configuração do JWT (Autenticação)
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

var app = builder.Build();

// Apply migrations and seed data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var dbContext = services.GetRequiredService<AppDbContext>();
    var userService = services.GetRequiredService<UserService>();

    // Aplica as migrations
    dbContext.Database.Migrate();

    // Cria o usuário admin se não existir
    if (!dbContext.Users.Any(u => u.Email == "admin@gmail.com"))
    {
        // --- CORREÇÃO AQUI ---
        // Agora criamos um UserCreateDTO para passar para o serviço
        var adminUserDto = new UserCreateDTO
        {
            UserName = "admin",
            Email = "admin@gmail.com",
            Senha = "admin123"
        };
        await userService.AddUser(adminUserDto);
    }
}


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();