import tableApiRequest from "@/apiRequests/table";
import { UpdateTableBodyType } from "@/schemaValidations/table.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetTableList = () => {
  return useQuery({
    queryKey: ["tables"],
    queryFn: tableApiRequest.list, // pass result of function
  });
};

export const useGetTable = ({
  number,
  enabled,
}: {
  number: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["tables", number],
    queryFn: () => tableApiRequest.getTable(number), // pass function
    enabled,
  });
};

export const useAddTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tableApiRequest.addTable,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    }, // after create new table successfully, fetch table list again to get updated data
  });
};

export const useUpdateTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      number,
      ...body
    }: { number: number } & UpdateTableBodyType) =>
      tableApiRequest.updateTable(number, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
        exact: true,
      });
    }, // after update table successfully, fetch table list again to get updated data
  });
};

export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tableApiRequest.deleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    }, // after delete table successfully, fetch table list again to get updated data
  });
};
