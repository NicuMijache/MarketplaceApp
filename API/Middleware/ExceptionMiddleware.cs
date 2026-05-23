using System.Net;
using System.Text.Json;

namespace API.Middleware;

/// <summary>
/// Global exception handler middleware. Sits at the start of the pipeline,
/// wraps all downstream middleware in a try/catch.
///
/// WHY: Without this, unhandled exceptions return ASP.NET's default error page
/// (HTML in dev, empty 500 in prod). With this middleware, every error returns
/// a consistent JSON structure that Angular can parse reliably.
///
/// Usage: app.UseMiddleware&lt;ExceptionMiddleware&gt;(); in Program.cs (before everything else)
/// </summary>
public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        context.Response.ContentType = "application/json";

        var (statusCode, message) = ex switch
        {
            UnauthorizedAccessException => (HttpStatusCode.Unauthorized, ex.Message),
            KeyNotFoundException        => (HttpStatusCode.NotFound, ex.Message),
            ArgumentException           => (HttpStatusCode.BadRequest, ex.Message),
            InvalidOperationException   => (HttpStatusCode.BadRequest, ex.Message),
            _                           => (HttpStatusCode.InternalServerError, "An unexpected error occurred")
        };

        context.Response.StatusCode = (int)statusCode;

        var response = new
        {
            statusCode = (int)statusCode,
            message,
            // Only include stack trace in Development for security reasons
            details = _env.IsDevelopment() ? ex.StackTrace?.TrimStart() : null
        };

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var json = JsonSerializer.Serialize(response, options);
        await context.Response.WriteAsync(json);
    }
}
