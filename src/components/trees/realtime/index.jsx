import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./realtime.module.css";
import Tree from "react-d3-tree";
import { Tooltip } from "react-tooltip";
import ReactDOMServer from "react-dom/server";
import { isHTML, truncateHtml } from "../../../utils/helper";
import DOMPurify from "dompurify";

const trimTextWithEllipsis = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

const CustomNode = ({ nodeDatum, foreignObjectProps, userType }) => {
  // const padding = 10;
  // const label = trimTextWithEllipsis(nodeDatum.name, 115);

  let padding = 10;
  let truncatedLabel = "N/A";
  let contentIsHTML = false;

  let label = trimTextWithEllipsis(nodeDatum.name, 115);
  contentIsHTML = isHTML(nodeDatum.name);

  if (contentIsHTML) {
    padding = 15;
    // Truncate HTML content
    truncatedLabel = truncateHtml(nodeDatum.name, 100); // Maximum length for truncated HTML and content
  }


  let nodeClassName = styles.node;

  if (userType === "admin") {
    if (nodeDatum.attributes.isQuestion) {
      nodeClassName = styles.node;
    } else {
      if (nodeDatum.attributes.isAdminOptimal) {
        nodeClassName = styles.selected;
      } else {
        nodeClassName = styles.isNotSelected;
      }
    }
  } else {
    if (nodeDatum.attributes.isQuestion) {
      nodeClassName = styles.node;
    } else {
      if (nodeDatum.attributes.isUserSubmitedAnswer) {
        nodeClassName = styles.selected;
      } else {
        nodeClassName = styles.isNotSelected;
      }
    }
  }

  return (
    <g transform={`translate(-150, 0)`}>
      <foreignObject width={300} height={30 + 2 * padding}>
        <div className={styles.nodeContainer}>
          <div
            className={nodeClassName}
            // data-tooltip-id="my-tooltip"
            // data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
            //   <div className={styles.tooltipContent}>
            //     <div>{nodeDatum.attributes.ToolTipTitle}</div>
            //     <div>{nodeDatum.attributes.ToolTipDescr}</div>
            //   </div>
            // )}
            data-tooltip-id="my-tooltip"
            data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
              <div className={styles.tooltipContent}
                style={{
                  maxWidth: '50rem',
                  wordBreak: "break-all",
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: nodeDatum.name }}></div>
              </div>
            )}
            // style={{ padding: `${padding * 0.5}px ${padding}px` }}
            style={{
              padding: !contentIsHTML ?
                `${padding * 0.5}px ${padding}px` : `${padding * 0.1}px ${padding}px ${padding * 0.1}px ${padding + 5}px`
            }}
          >
            {/* {label} */}
            {
              !contentIsHTML ? label :
                (truncatedLabel && <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncatedLabel) }} />)
            }
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

const RealTimeTree = ({ data = {}, userType = "admin" }) => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const containerRef = useRef();
  const nodeSize = { x: 200, y: 100 };
  const foreignObjectProps = {
    width: nodeSize.x,
    height: nodeSize.y,
  };

  useLayoutEffect(() => {
    if (containerRef.current) {
      const optimalElements = containerRef.current.querySelectorAll(
        `path.${styles.selectedEdge}`
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
      setTranslate({ x: width * 0.5, y: 0 });
    }
  }, [containerRef]);

  const getDynamicPathClass = ({ source, target }, orientation) => {
    if (userType === "admin") {
      if (target.data.attributes.isQuestion) {
        return styles.selectedEdge;
      } else {
        if (target.data.attributes.isAdminOptimal) {
          return styles.selectedEdge;
        } else {
          return styles.isNotSelected;
        }
      }
    } else {
      if (target.data.attributes.isQuestion) {
        return styles.selectedEdge;
      } else {
        if (target.data.attributes.isUserSubmitedAnswer) {
          return styles.selectedEdge;
        } else {
          return styles.isNotSelected;
        }
      }
    }
  };

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
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
        zoom={0.7}
        depthFactor={120}
        orientation="vertical"
      />
      <Tooltip id="my-tooltip" place="right" />
    </div>
  );
};

export default RealTimeTree;
