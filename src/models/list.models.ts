import { Document, Schema, model, SchemaTypes } from 'mongoose'

interface ListDocument{
    user_id: string;
    movie_id: string;
}

const ListSchema = new Schema(
    {
        user_id: {
            type: SchemaTypes.ObjectId,
            required: true
        },
        movie_id: {
            type: SchemaTypes.ObjectId,
            required: true,
            unique: true
        },
    },
    {
        // collection do banco de dados, data ....
        timestamps: true
    }
)

const List = model<ListDocument>("List", ListSchema);

export { List };