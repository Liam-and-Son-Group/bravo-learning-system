import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { LoginDto, SignupDto } from "./dto/create-authentication.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { SignInResponseDto } from "./dto/response.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { BaseResponseDto } from "src/types/dto/response.dto";

@ApiTags("Authentication")
@ApiBearerAuth()
@Controller("authentication")
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post("/signup")
  async signup(@Body() body: SignupDto) {
    return this.authenticationService.signup(body);
  }

  @Post("/signin")
  @HttpCode(200) // Use 200 instead of 201 for login
  @ApiOperation({ summary: "User sign in - returns access and refresh tokens" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ type: SignInResponseDto })
  async signIn(@Body() signInDto: LoginDto) {
    const result = await this.authenticationService.signIn(signInDto);
    console.log("SignIn controller result:", JSON.stringify(result));
    return result;
  }

  @Post("/refresh")
  @ApiOperation({
    summary: "Exchange a valid refresh token for new tokens (rotation)",
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ type: SignInResponseDto })
  refresh(@Body() body: RefreshTokenDto) {
    return this.authenticationService.refreshTokens(body.refreshToken);
  }

  @Post("/logout")
  @ApiOperation({ summary: "Logout user and revoke refresh token" })
  @ApiResponse({ type: BaseResponseDto })
  async logout(@Headers("authorization") authHeader: string) {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new BaseResponseDto(true, "Logged out successfully");
    }
    const token = authHeader.substring("Bearer ".length);
    const payload = await this.authenticationService.decodeAccessToken(token);
    if (!payload) {
      return new BaseResponseDto(true, "Logged out successfully");
    }
    return this.authenticationService.logout(payload.sub);
  }

  @Post("/verify")
  @ApiOperation({ summary: "Verify access token validity" })
  @ApiResponse({ type: BaseResponseDto })
  async verify(@Headers("authorization") authHeader: string) {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new BaseResponseDto(false, "Missing authorization header");
    }
    const token = authHeader.substring("Bearer ".length);
    return this.authenticationService.verifyAccessToken(token);
  }

  @Get("/profile")
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({
    status: 200,
    description: "User profile retrieved successfully",
  })
  async getProfile(@Headers("authorization") authHeader: string) {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new BaseResponseDto(false, "Missing authorization header");
    }
    const token = authHeader.substring("Bearer ".length);
    const payload = await this.authenticationService.decodeAccessToken(token);
    if (!payload) {
      return new BaseResponseDto(false, "Invalid token");
    }
    return this.authenticationService.getUserProfile(payload.sub);
  }
}
