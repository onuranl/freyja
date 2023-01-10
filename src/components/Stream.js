import { useEffect } from 'react';
import { Button } from 'antd';
import { FaVideo, FaMicrophone, FaLink } from 'react-icons/fa';

function Stream() {
    return (
        <div className='stream'>

            <div className='stream-frames'>
                {Array.from("fooo").map((item, i) =>
                    <div className='stream-frames__item' key={i}>

                    </div>
                )}
            </div>
            <div className='stream-tools'>
                <div>
                    <div className='stream-tools__video'>
                        <Button icon={<FaVideo />} />
                    </div>
                    <div className='stream-tools__microphone'>
                        <Button icon={<FaMicrophone />} />
                    </div>
                </div>
                <div className='stream-tools__link'>
                    <Button icon={<FaLink />} />
                </div>
            </div>
        </div>
    );
}

export default Stream;
