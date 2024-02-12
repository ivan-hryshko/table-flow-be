import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class IntegerValidationPipe implements PipeTransform {
  transform(value: any): any {
    if (!Number.isInteger(value)) {
      throw new BadRequestException(
        'Не валідне значення параметру. Має бути ціле число.',
      );
    }

    return value;
  }
}
