export class ErrorHelper {
  errors: object = {};

  public addNewError(message: string, key: string) {
    if (!key) {
      this.errors['message'] = message;
    } else {
      this.errors[key] = message;
    }
  }

  public getErrors() {
    return { errors: this.errors };
  }
}
