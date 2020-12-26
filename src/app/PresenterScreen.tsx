import React, { useCallback, useEffect, useRef, useState } from 'react';
import Present from "./graphics/present.inline.svg";
import canAutoPlayTest from 'can-autoplay';
import Media from './Media';

function PresenterScreen({ ...props }) {
  const [canAutoPlay, setCanAutoPlay] = useState(false)
  console.log("🚀 ~ canAutoPlay", canAutoPlay)

  useEffect(() => {
    canAutoPlayTest
      .video({ timeout: 250, muted: false, inline: true })
      .then(({ result, error }) => {
        if (result === false) {
          console.warn('Error did occur: ', error)
        } else {
          setCanAutoPlay(true)
        }
      })
  }, [])

  return (
    <div
      className="flex justify-center  rounded-r flex-grow bg-gray-200"
    >

      <div className="flex flex-col  w-full text-center align-middle justify-center">
        <div className="flex">
          <div className="select-none px-3 py-1 text-sm text-gray-800 ml-4 border-b-0 flex flex-grow-0 flex-row items-center bg-yellow-50 border border-gray-500">
            <Present className="inline w-3 h-3 mr-2" /> Presenter screen
            </div>
        </div>
        <div className=" w-full h-72 flex flex-col justify-center" style={{
          backgroundColor: "#4B4B4B"
        }}>
          {canAutoPlay ? 
          <Media {...props} setCanAutoPlay={setCanAutoPlay} />
          :
          <div className="">
            <div className={(
                
                "font-light text-2xs text-gray-100 mb-2"
              )}>
                <div>
                  Playback can be controlled by anyone in this room.
                </div>
              </div>
            <div>
              <button className="border-2 border-gray-50 hover:opacity-100 transition-opacity duration-200  text-gray-50 opacity-80 font-normal px-4 py-2 rounded " onClick={() => {
                canAutoPlayTest
                  .video({ timeout: 250, muted: false, inline: true })
                  .then(({ result, error }) => {
                    if (result === false) {
                      console.warn('Error did occur: ', error)
                    } else {
                      setCanAutoPlay(true)
                    }
                  })
              }}>Enable playback 📢</button>
            </div>
          </div>
        }

        </div>
      </div>
    </div>
  );
}

export default PresenterScreen;
