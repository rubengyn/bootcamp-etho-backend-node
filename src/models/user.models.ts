// dependencias 
import { Document, Schema, model } from 'mongoose'



interface UserDocument{
    name: string;
    email: string;
    password: string;

    // função de login, pega senha sem hash(preHash)
    comparePassword(preHashPassword: string): Promise<boolean>;
}

// documento para o próprio mongo
const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
    },
    {
        // collection do banco de dados, data ....
        timestamps: true
    }
)

// criar um modelo em cima do Schema, modelo = User + UserSchema
const User = model<UserDocument>("User", UserSchema);

export { User };