import React, { useEffect, useRef } from "react";

const PieTimer = (props) => {
  const borderRef = useRef(null);
  const loaderRef = useRef(null);

  const draw = (rate) => {
    let angle = 360 * rate;
    angle %= 360;

    const rad = (angle * Math.PI) / 180;

    const x = Math.sin(rad) * (props.width / 2);
    const y = Math.cos(rad) * -(props.height / 2);

    let mid = angle > 180 ? 1 : 0;
    let sweepDirection = 1;

    if (props.inverse && props.inverse === true) {
      mid = Math.abs(mid - 1);
      sweepDirection = 0;
    }

    const shape = `M 0 0 v ${-(props.height / 2)} A ${props.width / 2} ${
      props.width / 2
    } 1 ${mid} ${sweepDirection} ${x} ${y} z`;

    if (borderRef.current) {
      borderRef.current.setAttribute("d", shape);
    }
    if (loaderRef.current) {
      loaderRef.current.setAttribute("d", shape);
    }
  };

  useEffect(() => {
    let animationFrameId;

    let loops = props.loops == 0 ? 0 : props.loops || 1;
    const duration = props.duration * 1000 || 1000;

    let end = Date.now() + duration * loops;
    let totalDuration = duration * loops;

    const frame = () => {
      if (!props.isPaused) {
        const current = Date.now();
        const remaining = end - current;
        let rate = loops + 1 - remaining / duration;

        if (remaining < 60) {
          draw(loops - 0.0001);
          if (remaining < totalDuration && loops) return;
        }

        if (props.reverse && props.reverse === true) {
          rate = 360 - rate;
        }

        draw(rate);
      }

      animationFrameId = requestAnimationFrame(frame);
    };

    frame();

    return () => cancelAnimationFrame(animationFrameId);
  }, [props.duration, props.loops, props.reverse, props.isPaused]);

  return (
    <div className="svgPieTimer">
      <svg
        style={{ cursor: "pointer" }}
        width={props.width}
        height={props.width}
        viewBox={`0 0 ${props.width} ${props.height}`}
      >
        <path
          className="svg-border"
          ref={borderRef}
          transform={`translate(${props.width / 2} ${props.height / 2})`}
        />
        <path
          className="svg-loader"
          ref={loaderRef}
          transform={`translate(${props.width / 2} ${
            props.height / 2
          }) scale(.84)`}
        />
      </svg>
    </div>
  );
};

export default PieTimer;
