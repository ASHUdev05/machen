namespace machen.Endpoints;

public interface IEndpointModule
{
    string BaseRoute { get; }
    void MapEndPoints(RouteGroupBuilder builder);
}