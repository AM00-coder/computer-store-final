export class Product {
  _id?: string; // ✅ MongoDB ID
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  isPopular: boolean;
  quantity: number;

  constructor(
    name: string,
    price: number,
    image: string,
    description: string,
    category: string,
    isPopular: boolean,
     quantity: number
  ) {
    this.name = name;
    this.price = price;
    this.image = image;
    this.description = description;
    this.category = category;
    this.isPopular = isPopular;
    this.quantity = quantity;

  }
}
