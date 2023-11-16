import { fireEvent, render, screen } from '@testing-library/react';
import { Socket } from 'socket.io-client/debug';
import Room from '../Room';
import * as useRoom from '@/hooks/useRoom';
import * as useMedia from '@/hooks/useMedia';

const mockRoomData = {
  socket: {} as Socket,
  streamList: [] as { id: string; stream: MediaStream }[],
  dataChannels: [] as { id: string; dataChannel: RTCDataChannel }[],
};
const mockMedia = {
  stream: {} as MediaStream,
  camera: { list: [] as MediaDeviceInfo[], setCamera: () => {} },
  mic: { list: [] as MediaDeviceInfo[], setMic: () => {} },
  speaker: { list: [] as MediaDeviceInfo[] },
};

jest.mock('@/constants/env', () => ({
  VITE_SOCKET_URL: '',
  VITE_STUN_URL: '',
  VITE_TURN_URL: '',
  VITE_TURN_USERNAME: '',
  VITE_TURN_CREDENTIAL: '',
}));

describe('Room 조건부 렌더링 테스트', () => {
  jest.spyOn(useRoom, 'default').mockImplementation(() => mockRoomData);
  jest.spyOn(useMedia, 'default').mockImplementation(() => mockMedia);

  it('Room에 처음 입장하면 Setting컴포넌트가 렌더링된다.', () => {
    render(<Room />);
    expect(screen.getByText('참여할 준비가 되셨나요?')).toBeTruthy();
  });

  it('Room에서 참여 버튼을 누르면 Setting 컴포넌트가 사라진다.', () => {
    render(<Room />);
    fireEvent.click(screen.getByText('참여'));
    expect(() => screen.getByText('참여할 준비가 되셨나요?')).toThrow();
  });
});