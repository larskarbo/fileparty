import canAutoPlayTest from 'can-autoplay';
import { useEffect, useState } from 'react';

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
