using Microsoft.EntityFrameworkCore;
using GerenciamentoZoo.Api.Data;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var serverVersion = new MySqlServerVersion(new Version(8, 0, 31));

builder.Services.AddDbContext<ZooContext>(
    dbContextOptions => dbContextOptions
        .UseMySql(connectionString, serverVersion, 
            mySqlOptions => mySqlOptions.EnableRetryOnFailure())
);

builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();