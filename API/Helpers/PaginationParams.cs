namespace API.Helpers;

/// <summary>
/// Base class for query parameters. Controllers bind [FromQuery] to this.
/// Max page size of 50 prevents clients from accidentally requesting huge payloads.
/// </summary>
public class PaginationParams
{
    private const int MaxPageSize = 50;
    private int _pageSize = 10;

    public int PageNumber { get; set; } = 1;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
    }
}
