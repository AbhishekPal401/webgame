import React, { useEffect, useRef, useState } from "react";
import styles from "./mission.module.css";
import Tree from "react-d3-tree";

const CustomNode = ({ nodeDatum, foreignObjectProps }) => {
  const padding = 10;

  return (
    <g transform={`translate(-150, 0)`}>
      <foreignObject width={300} height={20 + 2 * padding}>
        <div className={styles.nodeContainer}>
          <div
            className={
              nodeDatum.attributes.IsQuestion
                ? styles.node
                : nodeDatum.attributes.Isoptimal
                ? styles.isOptimalNode
                : styles.isNotOptimalNode
            }
            style={{ padding: `${padding * 0.5}px ${padding}px` }}
          >
            {nodeDatum.name}
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

const MissionTree = ({ data = {} }) => {
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

      const { width, height } = containerRef.current.getBoundingClientRect();
      setTranslate({ x: width / 2, y: height * 0.1 });
    }
  }, [containerRef]);

  const getDynamicPathClass = ({ source, target }, orientation) => {
    if (
      !target.data.attributes.IsQuestion &&
      target.data.attributes.Isoptimal
    ) {
      return styles.isOptimal;
    } else if (target.data.attributes.IsQuestion) {
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
        separation={{ siblings: 1.5, nonSiblings: 2 }}
        renderCustomNodeElement={(rd3tProps) => {
          return (
            <CustomNode
              {...rd3tProps}
              foreignObjectProps={foreignObjectProps}
            />
          );
        }}
        // scaleExtent={{ min: 0.01, max: 2 }}
        zoom={0.8}
        depthFactor={140}
        orientation="vertical"
      />
    </div>
  );
};

export default MissionTree;
