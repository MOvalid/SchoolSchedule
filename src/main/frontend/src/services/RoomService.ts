import api from '../api/api';
import { RoomDto } from '../types/types';

export const getAllRooms = () => api.get<RoomDto[]>('/rooms');

export const getRoomById = (id: number) =>
  api.get<RoomDto>(`/rooms/${id}`);

export const createRoom = (data: RoomDto) =>
  api.post<RoomDto>('/rooms', data);

export const updateRoom = (id: number, data: RoomDto) =>
  api.put<RoomDto>(`/rooms/${id}`, data);

export const deleteRoom = (id: number) =>
  api.delete(`/rooms/${id}`);
