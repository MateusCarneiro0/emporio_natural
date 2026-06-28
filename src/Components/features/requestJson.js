import { BASE_URL } from "../../secretKeys"

export default async function requestJson(url,options){
    const res = await fetch(`${BASE_URL}/${url}`,options)
    if (!res.ok){
        throw new Error("A error ocurred in response")
    }
    const data = await res.json().catch(() => {
        throw new Error("A error ocurred in response")
    })
    return data
} 