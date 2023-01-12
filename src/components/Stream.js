import { useEffect, useRef } from 'react';
import { Button } from 'antd';
import { FaVideo, FaMicrophone, FaLink } from 'react-icons/fa';
import io from 'socket.io-client';

const endpoint = "http://localhost:8000"

function Stream() {
    const localVideo = useRef()
    const remoteVideo = useRef()

    const localConnection = useRef()
    const remoteConnection = useRef()
    const localChannel = useRef()
    const remoteChannel = useRef()

    useEffect(() => {
        startStream()
    })

    const startStream = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                localVideo.current.srcObject = stream

                connection(stream);
            })
            .catch(error => console.log(error));
    }

    const connection = (stream) => {
        const socket = io(endpoint);

        socket.on('other-users', (otherUsers) => {
            if (!otherUsers || !otherUsers.length) return;

            const socketId = otherUsers[0];

            localConnection.current = new RTCPeerConnection();

            stream.getTracks().forEach(track => localConnection.current.addTrack(track, stream));

            localConnection.current.onicecandidate = ({ candidate }) => {
                candidate && socket.emit('candidate', socketId, candidate);
            };

            localConnection.ontrack = ({ streams: [stream] }) => {
                remoteVideo.current.srcObject = stream;
            };

            localChannel.current = localConnection.current.createDataChannel('chat_channel');

            localConnection.current
                .createOffer()
                .then(offer => localConnection.current.setLocalDescription(offer))
                .then(() => {
                    socket.emit('offer', socketId, localConnection.current.localDescription);
                });
        });

        socket.on('offer', (socketId, description) => {
            remoteConnection.current = new RTCPeerConnection();

            stream.getTracks().forEach(track => remoteConnection.current.addTrack(track, stream));

            remoteConnection.current.onicecandidate = ({ candidate }) => {
                candidate && socket.emit('candidate', socketId, candidate);
            };

            remoteConnection.current.ontrack = ({ streams: [stream] }) => {
                remoteVideo.current.srcObject = stream;
            };

            remoteConnection.current.ondatachannel = ({ channel }) => {
                remoteChannel.current = channel;
            }

            remoteConnection.current
                .setRemoteDescription(description)
                .then(() => remoteConnection.current.createAnswer())
                .then(answer => remoteConnection.current.setLocalDescription(answer))
                .then(() => {
                    socket.emit('answer', socketId, remoteConnection.current.localDescription);
                });
        });

        socket.on('answer', (description) => {
            localConnection.current.setRemoteDescription(description);
        });

        socket.on('candidate', (candidate) => {
            const conn = localConnection.current || remoteConnection.current;
            conn.addIceCandidate(new RTCIceCandidate(candidate));
        });
    }

    return (
        <div className='stream'>
            <div className='stream-frames'>
                <div className='stream-frames__item'>
                    <video playsInline autoPlay muted ref={localVideo}></video>
                </div>

                <div className='stream-frames__item'>
                    <video playsInline autoPlay ref={remoteVideo}></video>
                </div>
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
