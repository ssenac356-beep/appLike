import { useMutation, useQuery } from "@tanstack/react-query"
import { addDados, buscaDados } from "../services/produtoService"
/* api com json server */

export function useProduto(campo: string) {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["produtos"],
        queryFn: buscaDados,
    })

    const { mutate, isPending, } = useMutation({
        mutationKey: ["addProduto"],
        mutationFn: () => addDados(campo),
        onSuccess: () => refetch()
    })

    return {
        data,
        isLoading,
        isError,
        mutate,
        isPending,
        refetch

    }
}