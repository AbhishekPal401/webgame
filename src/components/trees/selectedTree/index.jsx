import React, { useEffect, useRef, useState } from "react";
import styles from "./selectedTree.module.css";
import Tree from "react-d3-tree";
import { Tooltip } from "react-tooltip";
import ReactDOMServer from "react-dom/server";

const trimTextWithEllipsis = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

const CustomNode = ({ nodeDatum, foreignObjectProps, userType }) => {
  const padding = 10;
  const label = trimTextWithEllipsis(nodeDatum.name, 115);

  let nodeClassName = styles.node;

  if (userType === "admin") {
    if (nodeDatum.attributes.isQuestion) {
      nodeClassName = styles.node;
    } else {
      if (
        nodeDatum.attributes.isAdminOptimal &&
        nodeDatum.attributes.isOptimal
      ) {
        nodeClassName = styles.isNotOptimalNode;
      } else if (nodeDatum.attributes.isAdminOptimal) {
        nodeClassName = styles.selected;
      } else if (nodeDatum.attributes.isOptimal) {
        nodeClassName = styles.isNotOptimalNode;
      } else {
        nodeClassName = styles.isNotOptimalNode;
      }
    }
  } else {
    if (nodeDatum.attributes.isQuestion) {
      nodeClassName = styles.node;
    } else {
      if (
        nodeDatum.attributes.isUserSubmitedAnswer &&
        nodeDatum.attributes.isOptimal
      ) {
        nodeClassName = styles.isNotOptimalNode;
      } else if (nodeDatum.attributes.isUserSubmitedAnswer) {
        nodeClassName = styles.selected;
      } else if (nodeDatum.attributes.isOptimal) {
        nodeClassName = styles.isNotOptimalNode;
      } else {
        nodeClassName = styles.isNotOptimalNode;
      }
    }
  }

  return (
    <g transform={`translate(-150, 0)`}>
      <foreignObject width={300} height={30 + 2 * padding}>
        <div className={styles.nodeContainer}>
          <div
            className={nodeClassName}
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

const SelectedTree = ({ data = {}, userType = "admin" }) => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const containerRef = useRef();
  const nodeSize = { x: 200, y: 100 };
  const foreignObjectProps = {
    width: nodeSize.x,
    height: nodeSize.y,
  };

  useEffect(() => {
    if (containerRef.current) {
      if (userType === "admin") {
        const optimalElements = containerRef.current.querySelectorAll(
          `path.${styles.selectedEdge}`
        );

        optimalElements.forEach((element) => {
          const parent = element.parentElement;
          parent.appendChild(element.cloneNode(true));
          parent.removeChild(element);
        });
      } else {
        const optimalElements = containerRef.current.querySelectorAll(
          `path.${styles.selectedEdge}`
        );

        optimalElements.forEach((element) => {
          const parent = element.parentElement;
          parent.appendChild(element.cloneNode(true));
          parent.removeChild(element);
        });
      }

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
    if (userType === "admin") {
      if (target.data.attributes.isQuestion) {
        return styles.selectedEdge;
      } else {
        if (
          target.data.attributes.isOptimal &&
          target.data.attributes.isAdminOptimal
        ) {
          return styles.selectedEdge;
        } else if (target.data.attributes.isOptimal) {
          return styles.isNotSelected;
        } else if (target.data.attributes.isAdminOptimal) {
          return styles.selectedEdge;
        } else {
          return styles.isNotSelected;
        }
      }
    } else {
      if (target.data.attributes.isQuestion) {
        return styles.selectedEdge;
      } else {
        if (
          target.data.attributes.isOptimal &&
          target.data.attributes.isUserSubmitedAnswer
        ) {
          return styles.selectedEdge;
        } else if (target.data.attributes.isOptimal) {
          return styles.isNotSelected;
        } else if (target.data.attributes.isUserSubmitedAnswer) {
          return styles.selectedEdge;
        } else {
          return styles.isNotSelected;
        }
      }
    }

    // if (
    //   !target.data.attributes.isQuestion &&
    //   target.data.attributes.isOptimal
    // ) {
    //   return styles.isOptimal;
    // } else if (target.data.attributes.isUserSubmitedAnswer) {
    //   return styles.selectedEdge;
    // } else if (target.data.attributes.isQuestion) {
    //   return styles.selectedEdge;
    // } else {
    //   return styles.isNotSelected;
    // }
  };

  return (
    <div
      ref={containerRef}
      id="treeNode"
      style={{ width: "100%", height: "100%" }}
    >
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
              userType={userType}
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

export default SelectedTree;
