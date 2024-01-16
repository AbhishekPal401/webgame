import React, { useEffect, useRef, useState } from "react";
import styles from "./mission.module.css";
import Tree from "react-d3-tree";
import { Tooltip } from "react-tooltip";
import ReactDOMServer from "react-dom/server";

const trimTextWithEllipsis = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

const CustomNode = ({ nodeDatum, foreignObjectProps }) => {
  const padding = 10;
  const label = trimTextWithEllipsis(nodeDatum.name, 115);

  return (
    <g transform={`translate(-150, 0)`}>
      <foreignObject width={300} height={30 + 2 * padding}>
        <div className={styles.nodeContainer}>
          <div
            className={
              nodeDatum.attributes.isQuestion
                ? styles.node
                : nodeDatum.attributes.isOptimal
                ? styles.isOptimalNode
                : styles.isNotOptimalNode
            }
            data-tooltip-id="my-tooltip"
            data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
              <div className={styles.tooltipContent}>
                <div>{nodeDatum.attributes.ToolTipTitle}</div>
                <div>{nodeDatum.attributes.ToolTipDescr}</div>
              </div>
            )}
            style={{ padding: `${padding * 0.5}px ${padding}px` }}
          >
            {label}
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

const OptimalTree = ({ data = {} }) => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const containerRef = useRef();
  const nodeSize = { x: 200, y: 100 };
  const foreignObjectProps = {
    width: nodeSize.x,
    height: nodeSize.y,
  };

  useEffect(() => {
    if (containerRef.current) {
      const optimalElements = containerRef.current.querySelectorAll(
        `path.${styles.isOptimal}`
      );

      optimalElements.forEach((element) => {
        const parent = element.parentElement;
        parent.appendChild(element.cloneNode(true));
        parent.removeChild(element);
      });

      const gElements = containerRef.current.querySelectorAll(`g.rd3t-node`);

      gElements.forEach((element) => {
        const parent = element.parentElement;
        parent.appendChild(element.cloneNode(true));
        parent.removeChild(element);
      });

      const leafElements =
        containerRef.current.querySelectorAll(`g.rd3t-leaf-node`);

      leafElements.forEach((element) => {
        const parent = element.parentElement;
        parent.appendChild(element.cloneNode(true));
        parent.removeChild(element);
      });

      const { width, height } = containerRef.current.getBoundingClientRect();
      setTranslate({ x: width / 2, y: 0 });
    }
  }, [containerRef]);

  const getDynamicPathClass = ({ source, target }, orientation) => {
    if (
      !target.data.attributes.isQuestion &&
      target.data.attributes.isOptimal
    ) {
      return styles.isOptimal;
    } else if (target.data.attributes.isQuestion) {
      return styles.isOptimal;
    } else {
      return styles.isNotSelected;
    }
  };

  return (
    <div ref={containerRef}>
      <Tree
        data={data}
        translate={translate}
        nodeSize={nodeSize}
        pathFunc={"step"}
        pathClassFunc={getDynamicPathClass}
        separation={{ siblings: 1.6, nonSiblings: 1.6 }}
        renderCustomNodeElement={(rd3tProps) => {
          return (
            <CustomNode
              {...rd3tProps}
              foreignObjectProps={foreignObjectProps}
            />
          );
        }}
        scaleExtent={{ min: 0.2, max: 3 }}
        zoom={0.6}
        depthFactor={120}
        orientation="vertical"
      />
      {/* <Tooltip id="my-tooltip" place="right" /> */}
    </div>
  );
};

export default OptimalTree;
