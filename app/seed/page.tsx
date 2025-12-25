"use client"

import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"

export default function SeedGraphPage() {
  const seed = useMutation(api.mutations.seedTypes.default)

  return (
    <button onClick={() => seed()}>
      Seed Graph
    </button>
  )
}
