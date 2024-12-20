import { DELETE_CONFIG, GET_CONFIG, POST_CONFIG } from './generateConfigs';
import { Reservation, SPORTS, User } from './models';

/**
 * UTILS
 */

const generateFetch = async (url: string, config: {}) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/${url}`,
    config
  );
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

/**
 * CLUBS
 */

const getClubsByLocation = async (location: string) =>
  await generateFetch(`clubs/${location}`, GET_CONFIG());

const getClubsByLocationAndSport = async (location: string, sport: SPORTS) =>
  await generateFetch(`clubs/${location}/${SPORTS[sport]}`, GET_CONFIG());

const getClubById = async (id: string) =>
  generateFetch(`clubs/search/${id}`, GET_CONFIG());

/**
 * COURTS
 */

const getCourtsByClubId = async (clubId: string) =>
  await generateFetch(`courts/club/${clubId}`, GET_CONFIG());

const getCourtById = async (id: string) =>
  await generateFetch(`courts/${id}`, GET_CONFIG());

/**
 * USERS
 */

const getUserById = async (id: string) =>
  await generateFetch(`users/id/${id}`, GET_CONFIG());

const getUserByEmail = async (email: string) =>
  await generateFetch(`users/${email}`, GET_CONFIG());

const createUser = async (user: User) =>
  await generateFetch(
    'users',
    POST_CONFIG({ fullname: user.fullname, email: user.email })
  );

/**
 * RESERVATIONS
 */

const createReservation = async (reservation: Partial<Reservation>) =>
  await generateFetch(
    'reservations',
    POST_CONFIG({
      date: reservation.date,
      hour: reservation.hour,
      isLarge: reservation.isLarge,
      userId: reservation.userId,
      courtId: reservation.courtId,
    })
  );

const deleteReservation = async (id: string) =>
  await generateFetch(`reservations/${id}`, DELETE_CONFIG());

/**
 * EXPORTS
 */

export {
  getClubsByLocation,
  getClubsByLocationAndSport,
  getClubById,
  getCourtsByClubId,
  getCourtById,
  getUserById,
  getUserByEmail,
  createUser,
  createReservation,
  deleteReservation,
};
