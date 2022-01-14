// dependencias 
import { Document, Schema, model } from 'mongoose'



interface MovieDocument{
    name: string;
    category: string;
    description: string;
    media_type: string;
    poster: string;
    backdrop? : string;
}

// documento para o próprio mongo
const MovieSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true,
            unique: true
        },
        media_type: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        backdrop: {
            type: String,
        },
    },
    {
        // collection do banco de dados, createAt, updateAT ....
        timestamps: true
    }
)


const Movie = model<MovieDocument>("Movie", MovieSchema);

export { Movie };