enum USER_TYPES {
  superadmin,
  admin,
  user,
}

export enum SPORTS {
  tennis = "tennis",
  soccer = "soccer",
  basketball = "basketball",
  volley = "volley",
  rugby = "rugby",
}

enum SURFACES {
  clay,
  grass,
  hard,
}

export enum SERVICES {
  buffet = "buffer",
  showers = "showers",
  parking = "parking",
  grills = "grills",
  security = "security",
}

interface Club {
  id: string;
  createdAt: Date;
  name: string;
  image: string;
  location: string;
  address: string;
  coords: string;
  courts: Court[];
  admin: User;
  adminId: string;
  sports: SPORTS[];
  services: SERVICES[];
  //TODO: add reputation to the club
}

interface Court {
  id: string;
  createdAt: Date;
  name: string;
  surface: SURFACES;
  lightning: boolean;
  club: Club;
  clubId: string;
  reservations: Reservation[];
  sport: SPORTS;
  // TODO: add price for the court
}

interface Reservation {
  id: string;
  createdAt: Date;
  date: string;
  hour: string;
  isLarge: boolean;
  court: Court;
  courtId: string;
  user: User;
  userId: string;
}

interface User {
  id?: string;
  createdAt?: Date;
  fullname: string;
  email: string;
  phonenumber?: string;
  reservations?: Reservation[];
  userType?: USER_TYPES;
  club?: Club;
}

export type { Club, Court, Reservation, User };
