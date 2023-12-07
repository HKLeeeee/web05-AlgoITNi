import { useEffect } from 'react';
import randomNameGenerator from '@utils/randomNameGenerator';
import { MediaObject } from '@/hooks/useMedia';
import Button from '../common/Button';
import SettingVideo from './SettingVideo';
import Header from '../common/Header';
import useFocus from '@/hooks/useFocus';
import useInput from '@/hooks/useInput';
import useRoomConfigData from '@/stores/useRoomConfigData';
import Spinner from '../common/Spinner';

export default function Setting({ mediaObject }: { mediaObject: MediaObject }) {
  const { isConnectionError, isSignalingError, isSettingDone } = useRoomConfigData();
  const { setNickname, settingOn, settingOff, resolveConnectionError, resolveSignalError } = useRoomConfigData((state) => state.actions);

  const { inputValue, onChange } = useInput(randomNameGenerator());

  const ref = useFocus<HTMLInputElement>();

  const onClick = () => {
    resolveConnectionError();
    resolveSignalError();
    setNickname(inputValue);
    localStorage.setItem('nickName', inputValue);
    settingOn();
  };

  useEffect(() => {
    settingOff();
  }, [isConnectionError, isSignalingError]);

  return (
    <div className="min-h-screen min-w-screen bg-base">
      <Header />
      <main className="flex px-[7vw] gap-10 tablet:flex-col">
        <div className="basis-7/12">
          <SettingVideo mediaObject={mediaObject} />
        </div>
        <div className="flex flex-col items-center justify-center px-10 my-10 basis-5/12 tablet:px-0 mobile:px-0">
          <div className="flex flex-col items-start justify-center w-full gap-12">
            <div className="text-5xl font-light whitespace-nowrap mobile:text-4xl">참여할 준비가 되셨나요?</div>
            <div className="flex flex-col w-full gap-2 text-xl">
              <h2 className="font-medium">닉네임을 설정해보세요!</h2>
              <input className="p-4 rounded-lg drop-shadow-lg" type="text" ref={ref} value={inputValue} onChange={onChange} />
            </div>
            <div className="flex flex-col w-full gap-2">
              <Button.Full
                onClick={onClick}
                fontSize="20px"
                className={isConnectionError || isSignalingError ? 'animate-[vibration_.5s_linear]' : ''}
              >
                {isSettingDone ? <Spinner /> : '참여'}
              </Button.Full>
              <div className="h-7">
                {isConnectionError && <span className="text-lg font-semibold text-point-red">방이 가득 찼습니다!</span>}
                {isSignalingError && (
                  <span className="text-lg font-semibold text-point-red">
                    연결 과정에서 오류가 발생했습니다. 새로고침 후 다시 시도해주세요!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
