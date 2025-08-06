export class User {
  _id?: string; // ✅ ADD THIS
  name: string;
  email: string;
  password: string;
  birthDate: Date;
  gender: string;
  isAdmin: boolean;
  avatar: string;

  constructor(
    name: string,
    email: string,
    password: string,
    birthDate: Date,
    gender: string,
    isAdmin: boolean,
    _id?: string // ✅ optional in constructor too
  ) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.birthDate = birthDate;
    this.gender = gender;
    this.avatar = gender === 'Male' ? 'assets/male.jpg' : 'assets/female.jpg';
    this.isAdmin = isAdmin;
  }
}
