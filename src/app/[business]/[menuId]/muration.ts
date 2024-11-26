import { toast } from "@/hooks/use-toast";
import kyInstance from "@/lib/ky-instance";
import { CreateMenuItem, MenuItem } from "@/utils/types";
import { QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";

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
            console.error("Error updating album: ", error); // Helpful for debugging
            toast({
              variant: "destructive",
              description: "Failed to update album, please try again.",
            });
          },
    })     
    
    return mutation;
}