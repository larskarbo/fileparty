import React, { useEffect, useRef, useState } from "react";
import GatsbyImage from 'gatsby-image';
import { TwitterShareButton } from "react-share";
import { SmallMan } from "./SmallMan";
import { BigMan } from './BigMan';

export const Show = ({ data }) => {
  const mainLars = useRef();
  const [progr, setProgr] = useState(0);
  const [active, setActive] = useState(null);
  const [buttons, setButtons] = useState(false);
  const [paused, setPaused] = useState(true);
  const [player, setPlayer] = useState(null);


  const controls = false



  useEffect(() => {
    if (mainLars) {
      // if () {
      // } else {
      const test = function () {

        mainLars.current.play();

      }
      // }
      mainLars.current.addEventListener('loadeddata', test);
      return () => mainLars.current?.removeEventListener('loadeddata', test);
    }

  }, [mainLars]);


  return (
    <div>

      <SmallMan controls={controls} className="absolute top-52 left-52" bigMan={mainLars} paused={paused} active={active} buttons={buttons} player={player} />
      <SmallMan controls={controls} className="absolute top-32 right-60" type={"full"} bigMan={mainLars} paused={paused} active={active} buttons={buttons} player={player} />
      <SmallMan controls={controls} className="absolute top-64 right-56" bigMan={mainLars} paused={paused} active={active} buttons={buttons} player={player} />
      <BigMan controls={controls} mainLars={mainLars} active={active} buttons={buttons} player={player}
        setPaused={setPaused}
        paused={paused}
        setProgr={setProgr}
        setPlayer={setPlayer}
        setButtons={setButtons}
        setActive={setActive}
      />

    </div>
  );
};
