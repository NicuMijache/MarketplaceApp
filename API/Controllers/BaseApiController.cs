using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// Base class for all API controllers.
/// [ApiController] enables automatic model validation, binding source inference,
/// and automatic 400 responses for validation failures.
/// [Route("api/[controller]")] generates route from class name (e.g. AccountController → /api/account).
/// </summary>
[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    // Helper: extract the current user's ID from the JWT claim
    protected Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)
                 ?? User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);

        if (claim == null || !Guid.TryParse(claim.Value, out var userId))
            throw new UnauthorizedAccessException("User ID not found in token");

        return userId;
    }
}
