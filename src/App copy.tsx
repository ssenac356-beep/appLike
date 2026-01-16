import { useState } from "react"
import { useProduto } from "./hooks/usePoduto"

export default function App() {
  const [campo, setCampo] = useState('')
  const {
    data,
    isLoading,
    isError,
    refetch,
    mutate,
    isPending 
  } = useProduto(campo)

  return (
    <div>
      <input type="text"
        value={campo}
        onChange={(e) => setCampo(e.target.value)}
      />
      <button onClick={() => mutate()}>Add</button>
      <hr />
      <button onClick={() => refetch()}>Buscar</button>
      {isLoading && <p>Carregando..</p>}
      {isError && <p>deu erro</p>}
      {isPending && <p>Coisa mudando</p>}
      {data && data.map((p, index) => <p key={index}>{p.desc}</p>)}
    </div>
  )
}
