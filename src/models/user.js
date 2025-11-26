import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ['admin'], default: 'admin' },
        lastLoginAt: { type: Date },
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        toJSON: {
            versionKey: false,
            transform: (doc, ret) => {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.passwordHash;
                delete ret.isDeleted;
            },
        },
    },
);

export const UserModel = models.User || model('User', UserSchema);
