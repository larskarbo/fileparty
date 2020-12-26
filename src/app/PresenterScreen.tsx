import React, { useCallback, useEffect, useRef, useState } from 'react';
import Present from "./graphics/present.inline.svg";
import canAutoPlayTest from 'can-autoplay';
import Media from './Media';

function PresenterScreen({ isDragActive, ...props }) {
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
    
  );
}

export default PresenterScreen;
