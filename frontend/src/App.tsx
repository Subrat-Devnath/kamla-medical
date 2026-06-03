
import './App.css'

import { Calendar } from './components/ui/calendar'

function App() {

  return (
    <div className="p-10 flex flex-col gap-2 justify-center items-center">
      <h1 className="text-3xl font-bold">Welcome to saurabh medical</h1>

       <Calendar />
    </div>
  )
}

export default App
