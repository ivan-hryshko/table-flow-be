import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { ValidationError, validate } from "class-validator";

@Injectable()
export class createTablePipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToClass(metadata.metatype, value)
    const errors = await validate(object)
    console.log('value :>> ', value);
    console.log('metadata :>> ', metadata);
    console.log('object :>> ', object);
    console.log('errors :>> ', errors);

    // if (errors.length === 0) {
    return value
    // }

    // throw new HttpException({errors: this.formatError(errors)}, HttpStatus.UNPROCESSABLE_ENTITY)
  }

  formatError(errors: ValidationError[]) {
    return errors.reduce((acc, err) => {
      acc[err.property] = Object.values(err.constraints)
      return acc
    }, {})
  }
}