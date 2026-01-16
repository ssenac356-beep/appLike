import { useState } from "react"
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query"

// -----------------------------
// Tipagem do comentário
// -----------------------------
type Comment = {
  id: number
  user: string
  name: string
  comment: string
  like: number
  active: boolean
  postTime: string
}

// -----------------------------
// Função para buscar comentários
// -----------------------------
async function fetchComments(): Promise<Comment[]> {
  const res = await fetch("http://localhost:3000/comments")
  await new Promise(resolver => setTimeout(resolver, 3000))
  return res.json()
}

// -----------------------------
// Criar comentário
// -----------------------------
async function createComment(newComment: Omit<Comment, "id">) {
  const res = await fetch("http://localhost:3000/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newComment)
  })
  return res.json()
}

// -----------------------------
// Atualizar comentário (like/status)
// -----------------------------
async function updateComment(comment: Comment) {
  const res = await fetch(`http://localhost:3000/comments/${comment.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment)
  })
  return res.json()
}

export default function App() {
  const queryClient = useQueryClient()
  const [text, setText] = useState("")


  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments"],
    queryFn: fetchComments
  })

  // ➕ Criar comentário
  const createMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
      setText("")
    }
  })

  // 🔄 Atualizar comentário
  const updateMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    }
  })

  function handleCreate() {
    createMutation.mutate({
      user: "user_01",
      name: "Kawan",
      comment: text,
      like: 0,
      active: true,
      postTime: new Date().toISOString()
    })
  }

  function handleLike(comment: Comment) {
    updateMutation.mutate({
      ...comment,
      like: comment.like + 1
    })
  }

  function toggleStatus(comment: Comment) {
    updateMutation.mutate({
      ...comment,
      active: !comment.active
    })
  }

  // -----------------------------
  // UI
  // -----------------------------
  if (isLoading) {
    return <p className="text-white p-4">Carregando...</p>
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-6">
      <h1 className="text-2xl font-bold mb-6">
        💬 Comentários
      </h1>

      {/* Criar comentário */}
      <div className="flex gap-2 mb-6">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite um comentário..."
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 px-4 rounded hover:bg-blue-500"
        >
          Enviar
        </button>
      </div>

      {/* Lista de comentários */}
      <ul className="space-y-4">
        {comments?.map((c) => (
          <li
            key={c.id}
            className={`p-4 rounded border ${c.active
              ? "border-zinc-700 bg-zinc-800"
              : "border-red-500 bg-zinc-800 opacity-50"
              }`}
          >
            <div className="flex justify-between">
              <strong>{c.name}</strong>
              <span className="text-xs text-zinc-400">
                {new Date(c.postTime).toLocaleString()}
              </span>
            </div>

            <p className="my-2">{c.comment}</p>

            <div className="flex gap-3">
              <button
                onClick={() => handleLike(c)}
                className="text-sm bg-zinc-700 px-3 py-1 rounded hover:bg-zinc-600"
              >
                ❤️ {c.like}
              </button>

              <button
                onClick={() => toggleStatus(c)}
                className="text-sm bg-zinc-700 px-3 py-1 rounded hover:bg-zinc-600"
              >
                {c.active ? "Desativar" : "Ativar"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}