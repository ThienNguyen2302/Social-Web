import { DataStoredInToken, IUser, TokenData } from "./";
import { UserSchema } from "@modules/users"
import LoginDto from "./dto/login.dto";
import { isEmptyObject } from "@core/utils";
import { HttpException } from "@core/exceptions";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';

class AuthService {
    public userSchema = UserSchema;

    public async login(model: LoginDto): Promise<TokenData> {
        if (isEmptyObject(model)) {
            throw new HttpException(400, 'Model is empty');
        }

        const user = await this.userSchema.findOne({ email: model.email });
        if (!user) {
            throw new HttpException(409, `Your email ${model.email} is not exist.`);
        }
        const isMatchPassword = await bcryptjs.compare(
            model.password,
            user.password
        );
        if (!isMatchPassword)
            throw new HttpException(400, 'Credential is not valid');

        return this.createToken(user);
    }

    public async refreshToken(refreshToken: string): Promise<TokenData> {
        try {
            // Verify the refresh token
            const secret = process.env.JWT_REFRESH_SECRET!;
            const decoded = jwt.verify(refreshToken, secret) as DataStoredInToken;

            // Find the user
            const user = await this.userSchema.findById(decoded.id).exec();

            if (!user) {
                throw new HttpException(404, 'User not found');
            }

            // Generate new tokens
            return this.createToken(user);
        } catch (error) {
            throw new HttpException(401, 'Invalid refresh token');
        }
    }

    public async revokeToken(token: string): Promise<void> {
        // In a real implementation, you would add the token to a blacklist
        // or remove it from a whitelist in your database
        // For this example, we'll just return success
        return Promise.resolve();
    }

    public async getCurrentLoginUser(userId: string): Promise<IUser> {
        const user = await this.userSchema.findById(userId).exec();
        if (!user) {
            throw new HttpException(404, 'User not found');
        }
        return user;
    } private createToken(user: IUser): TokenData {
        const dataInToken: DataStoredInToken = { id: user._id };
        const secret: string = process.env.JWT_TOKEN_SECRET!;
        const refreshSecret: string = process.env.JWT_REFRESH_SECRET || secret;
        const expiresIn: number = 60; // 60 seconds for access token
        const refreshExpiresIn: number = 60 * 60 * 24 * 7; // 7 days for refresh token

        return {
            token: jwt.sign(dataInToken, secret, { expiresIn: expiresIn }),
            refreshToken: jwt.sign(dataInToken, refreshSecret, { expiresIn: refreshExpiresIn }),
        };
    }
}
export default AuthService;