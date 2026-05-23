namespace API.Helpers;

/// <summary>
/// Extends PaginationParams with listing-specific filters.
/// All filter properties are nullable — null means "no filter applied".
/// This pattern is clean: one class handles both pagination and filtering.
/// </summary>
public class ListingFilterParams : PaginationParams
{
    public string? Search { get; set; }       // searches title + description
    public string? City { get; set; }
    public Guid? CategoryId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? Status { get; set; }       // default: only Active
    public string? OrderBy { get; set; }      // e.g. "price_asc", "price_desc", "date_desc"
}
