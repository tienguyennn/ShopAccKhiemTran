using N.Api;
using N.Api.Hubs;
using N.Extensions;
using System.Security.Authentication;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        //Log.Logger = new LoggerConfiguration()
        //.WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day)
        //.Enrich.FromLogContext()
        //.CreateLogger();
        //builder.Host.UseSerilog();

        builder.WebHost.ConfigureKestrel(serverOptions =>
        {
            serverOptions.ConfigureHttpsDefaults(httpsOptions =>
            {
                httpsOptions.SslProtocols = SslProtocols.Tls12 | SslProtocols.Tls13;
            });
        });

        builder.Configuration.UseAppSettings();

        builder.Services.AddHttpClient();
        builder.Services.AddMemoryCache();
        builder.Services.UseConfigurationServices();

        builder.Services.AddTransient<ExceptionHandlingMiddleware>();
        builder.Services.AddSignalR();

        var app = builder.Build();

        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        });

        app.UseRouting();

        app.UseCors(c =>
        {
            c.WithOrigins(builder.Configuration.GetSection("AllowedOrigins").Get<string[]>())
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });

        app.UseDeveloperExceptionPage();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseMiddleware<ExceptionHandlingMiddleware>();
        //app.UseMiddleware<ApiPermissionsMiddleware>();
        //app.UseHttpsRedirection();
        app.MapControllers();
        app.MapHub<NotificationHub>("/notificationHub");

        app.Run();
    }
}