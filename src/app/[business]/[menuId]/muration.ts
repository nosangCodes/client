import { toast } from "@/hooks/use-toast";
import kyInstance from "@/lib/ky-instance";
import { menuItem } from "@/lib/validations";
import { Column, CreateColumn, CreateMenuItem, MenuItem } from "@/utils/types";
import { QueryFilters, QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddItemMutation(){
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (createData : CreateMenuItem) => kyInstance.post("api/business/create-menu-item", {
            headers: {
                'content-type': 'application/json'
              },
              json: {
                ...createData
              }
        }).json<MenuItem>(),
        onSuccess: async(newItem) => {
            const queryFilter = {
                queryKey: ["menu-items"],
            } satisfies QueryFilters
            
            await queryClient.cancelQueries(queryFilter);

            queryClient.setQueriesData<Array<MenuItem>>(queryFilter, (oldData) => {
                if(oldData){
                    return [
                        ...oldData,
                        newItem
                    ]
                }
            })

            queryClient.invalidateQueries({
                queryKey: ["menu-items"],
                exact: true, // Only invalidate the specific "albums" query
              });

        } ,
        onError: (error) => {
            console.error("Error  adding item: ", error); // Helpful for debugging
            toast({
              variant: "destructive",
              description: "Failed to add item, please try again.",
            });
          },
    })     
    
    return mutation;
}

export function useAddColumnMutation(){
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationKey: ["columns"],
        mutationFn: (createData: CreateColumn) => kyInstance.post("api/business/create-column", {
            headers: {
                'content-type': 'application/json'
              },
              json: {
                ...createData
              }
        }).json<Column>(),
        onSuccess: async (newColumn) => {
            const queryFilter = {
                queryKey: ["columns"],
            } satisfies QueryFilters
            
            await queryClient.cancelQueries(queryFilter);

            queryClient.setQueriesData<Array<Column>>(queryFilter, (oldData) => {
                if(oldData){
                    return [
                        ...oldData,
                        newColumn
                    ]
                }
            })

            queryClient.invalidateQueries({
                queryKey: ["columns"],
                exact: true, // Only invalidate the specific "albums" query
              });
        },
        onError: (error) => {
            console.error("Error adding column: ", error); // Helpful for debugging
            toast({
              variant: "destructive",
              description: "Failed to add column, please try again.",
            });
          },
    })
    
    return mutation
}

export function useDeleteItemMutation(){
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationKey: ["menu-items"],
        mutationFn: (itemId: number) => kyInstance.delete(`api/business/item/${itemId}`).json<{
            id: number
        }>(),
        onSuccess: async ({id}) => {
            const queryFilter = {
                queryKey: ["menu-items"],
            } satisfies QueryFilters
            
            await queryClient.cancelQueries(queryFilter);
            queryClient.setQueriesData<Array<MenuItem>>(queryFilter, (oldData) => {
                if(oldData){
                    oldData = oldData.filter((item) => item.itemId !== id)
                    return [
                        ...oldData
                    ]
                }
            })

            queryClient.invalidateQueries({
                queryKey: ["menu-items"],
                exact: true, // Only invalidate the specific "albums" query
              });
        },
        onError: (error) => {
            console.error("Error deleting item", error); // Helpful for debugging
            toast({
              variant: "destructive",
              description: "Failed to delete item, please try again.",
            });
          },
    })
    return mutation
}

export function useMoveItemMutation(){
    const queryClient = useQueryClient();
    const queryKey: QueryKey = ["menu-items"]
    const mutation = useMutation({
        mutationKey: ["menu-items"],
        mutationFn: ( {columnIdToMoveTo, itemIdToMove}:{itemIdToMove: number, columnIdToMoveTo: number}) => kyInstance.patch("api/business/move-item", {
            headers: {
                'content-type': 'application/json'
              },
              json: {
                itemId: itemIdToMove,
                columnId: columnIdToMoveTo
              }
        }).json<MenuItem>(),
        onMutate: async({columnIdToMoveTo, itemIdToMove}) => {
            await queryClient.cancelQueries({queryKey});
            const previousState = queryClient.getQueryData<Array<MenuItem>>(queryKey);

             // Optimistically update the cache
            queryClient.setQueryData<MenuItem[]>(
                ["menu-items"],
                (oldData) =>
                oldData?.map((item) =>
                    item.itemId === itemIdToMove
                    ? { ...item, columnId: columnIdToMoveTo } // Update the item column ID
                    : item
                ) || []
            );
            return {previousState}
        },
        onError(error, variables, context) {
            queryClient.setQueryData(queryKey, context?.previousState);
            console.error(error);
            toast({
              variant: "destructive",
              description: "Something went wrong! Please try again.",
            });
          },
    })

    return mutation
}