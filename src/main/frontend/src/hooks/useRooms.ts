import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../services/RoomService';
import { RoomDto } from '../types/types';

export const useRooms = () =>
  useQuery({
    queryKey: ['rooms'],
    queryFn: async () => (await getAllRooms()).data,
  });

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RoomDto) => createRoom(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RoomDto }) =>
      updateRoom(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteRoom(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });
};
