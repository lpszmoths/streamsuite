import ClientScripts from "../components/client-scripts.tsx";
import type PropsWithServerState from '../interfaces/props-with-server-state.ts'

export default function Index({serverState}: PropsWithServerState) {
  return (
    <div>
      <main id='main'></main>
      <ClientScripts/>
    </div>
  )
}
