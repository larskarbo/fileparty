import React, { useCallback, useEffect, useRef, useState } from 'react';
import useHover from "@react-hook/hover";

function useDragElement(parent) {
  // const [isOnline, setIsOnline] = useState(null);
  const [dragPercentage, setDragPercentage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isReleased, setIsReleased] = useState(false);

  const onHitterDown = (e) => {
    setIsDragging(true)

    const coords = getCoordinates(getPosition(e), parent)
    const ms = xToPercentage(coords.x, parent)
    setDragPercentage(ms)

    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", up)
    setIsReleased(false)
  }

  const onDown = (e) => {
    setIsDragging(true)

    const coords = getCoordinates(getPosition(e), parent)
    const ms = xToPercentage(coords.x, parent)
    setDragPercentage(ms)

    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", up)
    setIsReleased(false)
  }

  const up = (e) => {
    window.removeEventListener("mousemove", move)
    window.removeEventListener("mouseup", up)
    const coords = getCoordinates(getPosition(e), parent)
    const ms = xToPercentage(coords.x, parent)

    setDragPercentage(ms)
    setIsDragging(false)
    setIsReleased(true)

  }

  const move = (e) => {
    e.preventDefault()
    const coords = getCoordinates(getPosition(e), parent)
    const ms = xToPercentage(coords.x, parent)
    setDragPercentage(ms)
  }

  const elementProps = {
    onMouseDown: onDown
  }

  const backgroundHitterProps = {
    onMouseDown: onHitterDown
  }

  return { elementProps, backgroundHitterProps, isDragging, isReleased, dragPercentage }
}

function Handle({ value, duration, parent, onUp }) {
  const { elementProps, backgroundHitterProps, isDragging, isReleased, dragPercentage } = useDragElement(parent)
  const draggingPointerValue = duration * (dragPercentage)
  const [isUsingDragValue, setIsUsingDragValue] = useState(false)

  useEffect(() => {
    if (isReleased) {
      onUp(draggingPointerValue)
    }
  }, [isReleased])

  useEffect(() => {
    if (isDragging) {
      setIsUsingDragValue(true)
    }
  }, [isDragging])

  useEffect(() => {
    if (isUsingDragValue) {
      setIsUsingDragValue(false)
    }
  }, [value])

  const val = isUsingDragValue ? draggingPointerValue : value
  return (
    <>
      <div className="bg-white absolute w-full h-xs"></div>
      <div className={" absolute h-xs " + (isUsingDragValue ? "bg-green-300"  : "bg-red-300")} style={{
        width: (val / duration) * 100 + "%"
      }}></div>
      <div
        // {...elementProps}
        className="bg-white rounded-full absolute" style={{
          width: 14,
          height: 14,
          marginLeft: `calc(${(val / duration) * 100}% - ${14 / 2}px`
        }}
      >

      </div>
      <div {...backgroundHitterProps} className="absolute top-0 left-0 right-0 bottom-0"></div>
    </>
  );
}

export default Handle;


export function getPosition(e) {
  if (typeof e.touches !== "undefined") {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  } else {
    return {
      x: e.clientX,
      y: e.clientY
    };
  }
}

export function getCoordinates(position, element) {
  var boundingRect = element.getBoundingClientRect();
  // use window.devicePixelRatio because if a retina screen, canvas has more pixels
  // than the getCoordinates
  var dpr = 1// typeof window !== "undefined" ? window.devicePixelRatio : 1;
  return {
    x: (position.x - boundingRect.left) * dpr,
    y: (position.y - boundingRect.top) * dpr
  };
}

export const xToPercentage = (x, parent) => {
  const width = parent.getBoundingClientRect().width;
  const percentage = (x) / width
  if (percentage < 0) {
    return 0;
  }
  if (percentage > 1) {
    return 1;
  }
  return percentage;
};