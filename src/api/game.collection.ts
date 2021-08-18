import axios from 'axios';

export const createGame = async () => {
  return await axios.get(`${process.env.REACT_APP_API_GAME}/createGame`, {});
};

export const joinGame = async (room: string) => {
  return await axios.post(
    `${process.env.REACT_APP_API_GAME}/joingame`,
    { room },
    {}
  );
};

export const getGame = async (id: string) => {
  return await axios.get(`${process.env.REACT_APP_API_GAME}/getgame/${id}`, {});
};

export const shooting = async (id: string, _idTarget: string) => {
  return await axios.post(`${process.env.REACT_APP_API_GAME}/shooting/${id}`, {
    _idTarget,
  });
};
