using API.DTOs.Account;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// Handles registration, login, and profile management.
///
/// We use UserManager (ASP.NET Identity) directly here because Identity
/// already provides all the user CRUD logic (hashing, validation, etc.).
/// There's no need to wrap it in a service for these simple operations.
/// </summary>
public class AccountController : BaseApiController
{
    private readonly UserManager<AppUser> _userManager;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;
    private readonly IPhotoService _photoService;

    public AccountController(
        UserManager<AppUser> userManager,
        ITokenService tokenService,
        IMapper mapper,
        IPhotoService photoService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _mapper = mapper;
        _photoService = photoService;
    }

    // POST /api/account/register
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto dto)
    {
        if (await _userManager.FindByEmailAsync(dto.Email) != null)
            return BadRequest("Email is already in use");

        if (await _userManager.FindByNameAsync(dto.Username) != null)
            return BadRequest("Username is already taken");

        var user = new AppUser
        {
            UserName = dto.Username,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            City = dto.City,
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors.Select(e => e.Description));

        // Every new user gets the "Member" role
        await _userManager.AddToRoleAsync(user, "Member");

        var userDto = _mapper.Map<UserDto>(user);
        userDto.Token = await _tokenService.CreateTokenAsync(user);
        return Ok(userDto);
    }

    // POST /api/account/login
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null || !user.IsActive)
            return Unauthorized("Invalid credentials");

        var passwordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!passwordValid)
            return Unauthorized("Invalid credentials");

        // Same generic message for both cases — don't reveal whether email exists
        var userDto = _mapper.Map<UserDto>(user);
        userDto.Token = await _tokenService.CreateTokenAsync(user);
        return Ok(userDto);
    }

    // GET /api/account/me
    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var userId = GetCurrentUserId();
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return NotFound();

        var userDto = _mapper.Map<UserDto>(user);
        userDto.Token = await _tokenService.CreateTokenAsync(user);  // refresh token
        return Ok(userDto);
    }

    // PUT /api/account/me
    [Authorize]
    [HttpPut("me")]
    public async Task<ActionResult> UpdateProfile(UpdateProfileDto dto)
    {
        var userId = GetCurrentUserId();
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return NotFound();

        if (dto.PhoneNumber != null) user.PhoneNumber = dto.PhoneNumber;
        if (dto.City != null) user.City = dto.City;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest(result.Errors.Select(e => e.Description));

        return NoContent();
    }

    // POST /api/account/me/photo — upload profile picture
    [Authorize]
    [HttpPost("me/photo")]
    public async Task<ActionResult<string>> UploadProfilePhoto(IFormFile file)
    {
        var userId = GetCurrentUserId();
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return NotFound();

        // Delete old photo from Cloudinary if it exists
        if (!string.IsNullOrEmpty(user.ProfilePicturePublicId))
            await _photoService.DeletePhotoAsync(user.ProfilePicturePublicId);

        var uploadResult = await _photoService.AddPhotoAsync(file, "avatars");
        if (uploadResult.Error != null)
            return BadRequest(uploadResult.Error.Message);

        user.ProfilePicture = uploadResult.SecureUrl.ToString();
        user.ProfilePicturePublicId = uploadResult.PublicId;

        await _userManager.UpdateAsync(user);
        return Ok(new { photoUrl = user.ProfilePicture });
    }
}
