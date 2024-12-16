import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Form from './components/form/Form'
import WelcomePage from './pages/WelcomePage'
import { FormProvider } from './provider/ContextProvider'

function App() {
  return (
    <FormProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/form" element={<Form />} />
        </Routes>
      </BrowserRouter>
    </FormProvider>
  )
}

export default App
