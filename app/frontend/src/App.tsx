import { Header } from './components/Header'
import { PropertyForm } from './components/PropertySubmission/PropertyForm'
import { PropertyList } from './components/PropertyList'
import { RequestValidation } from './components/PropertyValidation/RequestValidation'
import { ValidationDetails } from './components/PropertyValidation/ValidationDetails'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-poplar-cream flex flex-col">
      <Header />

      <main className="flex-1 mt-4">
        <Routes>
          <Route path="/" element={<PropertyForm />} />
          <Route path="/properties" element={<PropertyList />} />
          <Route path="/request-validation" element={<RequestValidation />} />
          <Route path="/validation/:propertyId" element={<ValidationDetails />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
