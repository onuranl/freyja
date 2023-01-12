import { useState } from 'react';
import { Button, Input } from 'antd';

function Modal({ setUser }) {
    const [name, setName] = useState('');

    return (
        <div className="modal">
            <Input placeholder='Enter your name' onChange={event => setName(event.target.value)} />
            <Button onClick={() => setUser(name)}> Join </Button>
        </div>
    );
}

export default Modal;
