export default class UserDto {
  id: string;
  email: string;
  isActivated: boolean;

  constructor(model: { id: string; email: string; isActivated?: boolean }) {
    this.id = model.id;
    this.email = model.email;
    this.isActivated = Boolean(model.isActivated);
  }
}
