import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { getAllRooms, createRoom, updateRoom, deleteRoom } from '../services/RoomService';
import { RoomDto } from '../types/types';

const ROOMS_QUERY_KEY = ['rooms'];

export const useRooms = () =>
    useQuery({
        queryKey: ROOMS_QUERY_KEY,
        queryFn: async () => (await getAllRooms()).data,
    });

const useRoomMutation = <TArgs, TResult = void>(
    mutationFn: (args: TArgs) => Promise<TResult>
): UseMutationResult<TResult, unknown, TArgs> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ROOMS_QUERY_KEY }),
    });
};

export const useCreateRoom = () => useRoomMutation((data: RoomDto) => createRoom(data));

export const useUpdateRoom = () =>
    useRoomMutation(({ id, data }: { id: number; data: RoomDto }) => updateRoom(id, data));

export const useDeleteRoom = () => useRoomMutation((id: number) => deleteRoom(id));
