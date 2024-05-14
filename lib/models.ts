enum USER_TYPES {
  superadmin,
  admin,
  user,
}

enum SPORTS {
  tennis,
  soccer,
  basketball,
  volley,
  rugby,
}

enum SURFACES {
  clay,
  grass,
  hard,
}

interface Club {
  id: string;
  createdAt: Date;
  name: string;
  image: string;
  location: string;
  address: string;
  courts: Court[];
  admin: User;
  adminId: string;
  sports: SPORTS[];
}

interface Court {
  id: string;
  createdAt: Date;
  name: string;
  surface: SURFACES;
  club: Club;
  clubId: string;
  reservations: Reservation[];
  sport: SPORTS;
}

interface Reservation {
  id: string;
  createdAt: Date;
  date: string;
  hour: string;
  court: Court;
  courtId: string;
  user: User;
  userId: string;
}

interface User {
  id: string;
  createdAt: Date;
  fullname: string;
  email: string;
  reservations: Reservation[];
  userType: USER_TYPES;
  club?: Club;
}

export type { Club, Court, Reservation, User };