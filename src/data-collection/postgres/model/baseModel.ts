import {
  InferAttributes,
  InferCreationAttributes,
  Model,
} from '@sequelize/core';

export class BaseModel extends Model<
  InferAttributes<BaseModel>,
  InferCreationAttributes<BaseModel>
> {}
