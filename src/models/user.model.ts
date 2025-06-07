import bcrypt from 'bcrypt'
import mongoose, { Document } from 'mongoose';

export interface IUSer extends Document {
    nombre: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUSer>({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
}, {
    timestamps: true
})

// metodo hash password antes de guadar el usuario
userSchema.pre<IUSer>('save', async function (next) {
    if (!this.isModified('password')) return next();
    
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
});

export const UserModel = mongoose.model<IUSer>('User', userSchema);