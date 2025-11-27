using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Infrastructure.Persistence;
using Application.Features.Usuarios;
using Application.Features.Associados;
using Application.Common.Interfaces;
using Infrastructure.Persistence.Repositories;
using Infrastructure.Cnab;
using Infrastructure.Services;
using Domain;
using Application.Features.Eventos;
using Application.Features.Atividades;
using Application.Features.Turmas;
using Application.Features.Relatorios;
using Application.Features.Contato;
using Application.Features.Carousel;
using Application.Features.Financeiro;
using Application.Features.Fornecedores;  
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policyBuilder =>
        {
            policyBuilder.WithOrigins("http://localhost:4200", "https://projeto-ucens.vercel.app") 
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

string BuildConnectionString()
{
    var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
    if (!string.IsNullOrWhiteSpace(databaseUrl))
    {
        if (databaseUrl.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase))
        {
            var uri = new Uri(databaseUrl);
            var userInfo = uri.UserInfo.Split(':');
            var builder = new NpgsqlConnectionStringBuilder
            {
                Host = uri.Host,
                Port = uri.Port > 0 ? uri.Port : 5432,
                Username = userInfo[0],
                Password = userInfo.Length > 1 ? userInfo[1] : "",
                Database = uri.AbsolutePath.TrimStart('/'),
                SslMode = SslMode.Require
            };
            return builder.ToString();
        }
        else
        {
            return databaseUrl;
        }
    }

    return builder.Configuration.GetConnectionString("DefaultConnection") ?? "";
}
var connectionString = BuildConnectionString();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));


builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAssociadoRepository, AssociadoRepository>();
builder.Services.AddScoped<IBoletoRepository, BoletoRepository>();
builder.Services.AddScoped<IMatriculaAssociadoRepository, MatriculaAssociadoRepository>();
builder.Services.AddScoped<IMatriculaDependenteRepository, MatriculaDependenteRepository>();
builder.Services.AddScoped<ITurmaRepository, TurmaRepository>();
builder.Services.AddScoped<ICnab400SicrediParser, Cnab400SicrediParser>();
builder.Services.AddScoped<IFornecedorRepository, FornecedorRepository>();
builder.Services.AddScoped<ITransacaoRepository, TransacaoRepository>(); 
builder.Services.AddScoped<IDependenteRepository, DependenteRepository>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));

builder.Services.AddScoped<IImageKitService, ImageKitService>();
builder.Services.AddScoped<TransacaoService>();
builder.Services.AddScoped<FornecedorService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<AssociadoService>();
builder.Services.AddScoped<DependentesService>();
builder.Services.AddScoped<EventoService>();
builder.Services.AddScoped<AtividadeService>();
builder.Services.AddScoped<TurmaService>();
builder.Services.AddScoped<RelatorioService>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<FinanceiroService>(); 
builder.Services.AddScoped<CarouselService>();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "API UCENS", Version = "v1" });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Por favor, insira 'Bearer ' seguido do seu token JWT",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("login", opt =>
    {
        opt.PermitLimit = 5;
        opt.Window = TimeSpan.FromMinutes(10); 
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 0; 
    });

    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests; 
});
builder.Services.AddMemoryCache();
builder.Services.AddHttpContextAccessor();
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

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var dbContext = services.GetRequiredService<AppDbContext>();
    var userService = services.GetRequiredService<UserService>();

    dbContext.Database.Migrate();

    if (!dbContext.Users.Any(u => u.Email == "admin@gmail.com"))
    {

        var adminUserDto = new UserCreateDTO
        {
            UserName = "admin",
            Email = "admin@gmail.com",
            Senha = "nipponadmin9182738@_"
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

app.UseStaticFiles();
app.UseCors("AllowAngularApp");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();