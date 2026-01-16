import type { Produto } from "../types/typePoduto"
import { api } from "../lib/api"

export async function buscaDados(): Promise<Produto[]> {
    await new Promise(resolver => setTimeout(resolver, 3000))
    const { data } = await api.get("/produtos")
    return data
}

export async function addDados(campo: string) {
    await new Promise(resolver => setTimeout(resolver, 3000))
    await api.post("/produtos", {
        desc: campo
    }
    )
}