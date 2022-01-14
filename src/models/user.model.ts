// dependencias 
import { Document, Schema, model } from 'mongoose'
import bcryptjs  from 'bcryptjs';


interface UserDocument extends Document{
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

// uma regra ira executar esta função ao salvar
UserSchema.pre('save', async function(next) {
    const user = this as UserDocument;

    if (!user.isModified('password')){
        return next();
    }
    const salt = await bcryptjs.genSalt(12);

    // salt -> saltos, embaralha a hash
    const hash = await bcryptjs.hashSync(user.password, salt);
    user.password = hash

    return next();
})

// função que comparar password digitado e do banco
UserSchema.methods.comparePassword = async function (preHashPassword: string) {
    const user = this as UserDocument;
    
    return bcryptjs.compare(preHashPassword, user.password).catch((error) => false);
}


// criar um modelo em cima do Schema, modelo = User + UserSchema
const User = model<UserDocument>("User", UserSchema);

export { User };