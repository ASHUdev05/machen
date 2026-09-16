namespace machen.Endpoints;

public static class EndPointExtensions
{
    public static IEndpointRouteBuilder MapAllEndpoints(
        this IEndpointRouteBuilder app,
        string globalPrefix = "/api")
    {
        var globalGroup = app.MapGroup(globalPrefix);

        var endpointTypes = typeof(Program).Assembly.GetTypes()
            .Where(t => typeof(IEndpointModule).IsAssignableFrom(t)
                        && t is { IsInterface: false, IsAbstract: false });

        foreach (var type in endpointTypes)
            if (ActivatorUtilities.CreateInstance(app.ServiceProvider, type) is IEndpointModule module)
            {
                var moduleGroup = globalGroup.MapGroup(module.BaseRoute);
                module.MapEndPoints(moduleGroup);
            }

        return app;
    }
}