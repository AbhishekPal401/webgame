import React, { useState, useEffect, useRef } from "react";

const PieTimer = (props) => {
  const borderRef = useRef(null);
  const loaderRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let loops = props.loops == 0 ? 0 : props.loops || 1;
    let end = Date.now() + props.duration * loops;
    let totalDuration = props.duration * loops;

    const frame = () => {
      if (!props.isPaused) {
        const current = Date.now();
        const remaining = end - current;
        let rate = loops + 1 - remaining / props.duration;

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

    borderRef.current.setAttribute("d", shape);
    loaderRef.current.setAttribute("d", shape);
  };

  const fmtMSS = (s) => {
    return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
  };

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

// import React, { Component } from "react";
// export default class PieTimer extends Component {
//   constructor(props) {
//     super(props);

//     // This part might be confusing:
//     // If n==0, do infinite loops
//     // In other cases where n is set, do n loops
//     // If n is not set, do 1 loop
//     // Do it this way to prevent mixing n==0 and !n

//     var duration = props.duration || 1000,
//       n = props.loops == 0 ? 0 : props.loops ? props.loops : 1,
//       end = Date.now() + duration * n,
//       totalDuration = duration * n;

//     this.state = {
//       duration: duration,
//       loops: n,
//       end: end,
//       totalDuration: totalDuration,
//       showDuration: false,
//     };
//   }

//   // Animate frame by frame
//   frame() {
//     var current = Date.now(),
//       remaining = this.state.end - current,
//       // Now set rotation rate
//       // E.g. 50% of first loop returns 1.5
//       // E.g. 75% of sixth loop returns 6.75
//       // Has to return >0 for SVG to be drawn correctly
//       // If you need the current loop, use Math.floor(rate)

//       rate = this.state.loops + 1 - remaining / this.state.duration;

//     // As requestAnimationFrame will draw whenever capable,
//     // the animation might end before it reaches 100%.
//     // Let's simulate completeness on the last visual
//     // frame of the loop, regardless of actual progress
//     if (remaining < 60) {
//       // 1.0 might break, set to slightly lower than 1
//       // Update: Set to slightly lower than n instead
//       this.draw(this.state.loops - 0.0001);

//       // Stop animating when we reach the total number loops
//       if (remaining < this.state.totalDuration && this.state.loops) return;
//     }

//     if (this.props.reverse && this.props.reverse === true) {
//       rate = 360 - rate;
//     }

//     this.draw(rate);

//     requestAnimationFrame(this.frame.bind(this));
//   }

//   draw(rate) {
//     var angle = 360 * rate;

//     angle %= 360;

//     var rad = (angle * Math.PI) / 180,
//       x = Math.sin(rad) * (this.props.width / 2),
//       y = Math.cos(rad) * -(this.props.height / 2),
//       mid = angle > 180 ? 1 : 0,
//       sweepDirection = 1;

//     if (this.props.inverse && this.props.inverse === true) {
//       mid = Math.abs(mid - 1);
//       sweepDirection = 0;
//     }

//     var shape =
//       "M 0 0 v " +
//       -(this.props.height / 2) +
//       " A " +
//       this.props.width / 2 +
//       " " +
//       this.props.width / 2 +
//       " 1 " +
//       mid +
//       " " +
//       sweepDirection +
//       " " +
//       x +
//       " " +
//       y +
//       " z";

//     this.refs.border.setAttribute("d", shape);
//     this.refs.loader.setAttribute("d", shape);
//   }

//   fmtMSS(s) {
//     return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
//   }

//   componentDidMount() {
//     this.frame();
//   }

//   render() {
//     return (
//       <div className="svgPieTimer">
//         <svg
//           style={{ cursor: "pointer" }}
//           width={this.props.width}
//           height={this.props.width}
//           viewBox={"0 0 " + this.props.width + " " + this.props.height}
//         >
//           <path
//             className="svg-border"
//             ref="border"
//             transform={
//               "translate(" +
//               this.props.width / 2 +
//               " " +
//               this.props.height / 2 +
//               ")"
//             }
//           />
//           <path
//             className="svg-loader"
//             ref="loader"
//             transform={
//               "translate(" +
//               this.props.width / 2 +
//               " " +
//               this.props.height / 2 +
//               ")  scale(.84)"
//             }
//           />
//         </svg>
//       </div>
//     );
//   }
// }
