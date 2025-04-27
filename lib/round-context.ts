import { createContext } from "react"

const RoundContext = createContext<RoundContextType>({
  loading: false,
  setLoading: () => null,
})

type RoundContextType = {
  loading: boolean
  setLoading: (arg: boolean) => void
}

export default RoundContext
