import { Header } from './components/Header'
import { PropertyForm } from './components/PropertySubmission/PropertyForm'

function App() {

  return (
    <div className="min-h-screen bg-poplar-cream flex flex-col">
      <Header />

      <main className="flex-1 mt-4">
        <PropertyForm />
      </main>
    </div>
  )
}

export default App
