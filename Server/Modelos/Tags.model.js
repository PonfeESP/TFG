import { ObjectId } from 'mongodb';
import mongoose, { Schema } from 'mongoose';

const tagsSchema = new Schema({
    Nombre: {
        type: String,
        required: true
    }
});

const Tags = mongoose.model('Tags', tagsSchema, 'Tags');
export const schema = Tags.schema;
export default Tags;