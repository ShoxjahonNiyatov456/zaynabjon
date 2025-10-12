export interface GeneralSettings {
  _id?: string;
  restaurantName: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  currency: string;
}

export interface DeliverySettings {
  _id?: string;
  enableDelivery: boolean;
  deliveryFee: string;
  freeDeliveryThreshold: string;
  deliveryRadius: string;
}