import { useState } from 'react';

import Stream from './components/Stream'
import Modal from './components/Modal'

import './App.scss';

function App() {
  const [user, setUser] = useState(false)

  if (user) {
    return (
      <div className="App">
        <Stream />
      </div>
    )
  }

  return <div className="App">
    <Modal setUser={(value) => setUser(value)} />
  </div>
}

export default App;
