export class Product {
  _id?: string; // ✅ MongoDB ID
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  isPopular: boolean;

  constructor(
    name: string,
    price: number,
    image: string,
    description: string,
    category: string,
    isPopular: boolean
  ) {
    this.name = name;
    this.price = price;
    this.image = image;
    this.description = description;
    this.category = category;
    this.isPopular = isPopular;
  }
}
