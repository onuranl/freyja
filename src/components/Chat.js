import { Input } from 'antd';

function Chat() {
    return (
        <div className="chat" >
            <div className='chat-messages'>
                <div className='chat-messages__mine'>
                    selam
                </div>
                <div className='chat-messages__your'>
                    aselam
                </div>
            </div>
            <Input />
        </div>
    );
}

export default Chat;
