import { BaseCollection } from "../base-collection/baseCollection";
import { HttpStatus } from "../../utils/httpStatus";
import { ErrorHandler } from "../../utils/errorHandler";
import { UserModel } from '../../models/user.model'

class Mongo extends BaseCollection {
    // get(): Promise<unknown> {
    //     return new Promise((resolve) => {
    //         resolve([{data: "MongoDB"}, {data: "MongoDB"}])
    //     });
    // }

    async get(id?:string):Promise<unknown>{
        try {
            if(id){
                if(!id.match(/^[0-9a-fA-F]{24}$/)) {
                    throw new ErrorHandler(HttpStatus.BAD_REQUEST, 'Invalid user ID format');
                }
                const user = await UserModel.findById(id).select('-password');
                if(!user) {
                    throw new ErrorHandler(HttpStatus.NOT_FOUND, 'User not found');
                }
                return user;
            }
            return await UserModel.find().select('-password');
        } catch (error) {
            throw error;
        }
    }
    
    async post(body: unknown): Promise<unknown> {
        const { nombre, email, password } = body as { nombre: string; email: string; password: string };
        const existingUser = await UserModel.findOne({email});
        if (existingUser) {
            throw new ErrorHandler(HttpStatus.BAD_REQUEST, 'User already exists');
        }
        const newUser = new UserModel({nombre, email, password});
        await newUser.save();
        return newUser;
    }

    async delete(id: string): Promise<unknown> {
        const deletedUser = await UserModel.findByIdAndDelete(id);
        if (!deletedUser) {
            throw new ErrorHandler(HttpStatus.NOT_FOUND, 'User not found');
        }
        return { message:'User deleted successfully' };
    }
    async put(id:string, body: unknown): Promise<unknown> {
        try {
            const { nombre, email, password } = body as { nombre: string; email: string; password: string };
            const user = await UserModel.findById(id);
            if (!user) {
                throw new ErrorHandler(HttpStatus.NOT_FOUND, 'User not found');
            }

            if(email && email !== user.email) {
                const existingUser = await UserModel.findOne({ email });
                if (existingUser) {
                    throw new ErrorHandler(HttpStatus.BAD_REQUEST, 'Email already in use');
                }
            }

            return UserModel.findByIdAndUpdate(id, { nombre, email, password }, { new: true }).select('-password');
        } catch (error) {
            
        }
    }
}
export { Mongo }