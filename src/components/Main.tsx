import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
type CommentsProps = {
    id: string,
    name: string,
    comment: string,
    like: number
}
export default function Main() {
    async function buscarDados(): Promise<CommentsProps[]> {
        const response = await axios.get("http://localhost:3000/comments ")
        await new Promise(resolve => setTimeout(resolve, 3000))
        return response.data
    }
    async function likeComment({ id, like }: CommentsProps) {
        await axios.patch(`http://localhost:3000/comments/${id}`, {
            like: like + 1
        })
    }
    async function createComment(): Promise<CommentsProps> {
        await new Promise(resolver => setInterval(resolver, 3000))

        const response = await axios.post("http://localhost:3000/comments", {
            id: Math.random(),
            user: "kawan",
            name: "kawan Sousa",
            comment: "esse foi o meu comment",
            like: 0,
            active: true,
            postTime: "2026-01-10T15:01:45Z"
        })

        await new Promise(resolver => setInterval(resolver, 3000))
        return response.data
    }
    const queryClient = useQueryClient()

    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["comments"],
        queryFn: buscarDados,
    })

    const { mutate, isPending } = useMutation({
        mutationKey: ['createComment'],
        mutationFn: createComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"] })
        },
        onError: () => {
            queryClient.cancelQueries({ queryKey: ["comments"] })
        },
    })

    const mutationLikeComment = useMutation({
        mutationFn: (comment) => likeComment(comment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"] })
        },
        /* demanda lógica */
        onMutate: (comment: CommentsProps) => {
            queryClient.cancelQueries({ queryKey: ["comments"] })

            const previousComments = queryClient.getQueryData<CommentsProps[]>(["comments"])
            console.log(previousComments);
            const newComments = previousComments?.map(c => {
                return c.id == comment.id ? { ...c, like: comment.like + 1 } : c
            })

            queryClient.setQueryData(["comments"], newComments)
        },
        onError: () => {
            queryClient.setQueryData(["comments"], [])
        }
    })
    return (
        <main className="flex-1  bg-zinc-900 flex  justify-center p-2">
            <div className="w-5xl bg-zinc-950 my-10">
                <div className=" space-x-2 p-5">
                    <input
                        className="border-2 rounded-sm outline-none w-1/2 p-2"
                        type="text"
                        placeholder="busque o comentario"
                    />
                    <button
                        className="bg-gray-50 text-black p-2 rounded-sm hover:bg-white"
                        onClick={() => mutate()}
                    >
                        Buscar
                    </button>
                </div>
                {isPending && <p className="text-white">fazendo comentario</p>}
                {isLoading && <p className="text-white">Carregando...</p>}
                {isError && <p className="text-white">Deu errado</p>}
                {data && data.map((c, index) => {
                    return (
                        <div className=" p-2" key={index}>
                            <div className="border-2 border-black rounded-sm p-4">
                                <div className=" flex space-x-2">
                                    <span className="text-gray-50">{c.id}</span>
                                    <span className="font-bold">{c.name}</span>
                                    <button
                                        className="ml-6 "
                                        onClick={() => mutationLikeComment.mutate(c)}
                                    >👍{c.like}
                                    </button>
                                </div>
                                <p>{c.comment}</p>
                            </div>

                        </div>
                    )
                })}

            </div>
        </main>
    )
}