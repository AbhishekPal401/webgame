import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useInsertionEffect,
} from "react";
import styles from "./selectedTree.module.css";
import Tree from "react-d3-tree";
import { Tooltip } from "react-tooltip";
import ReactDOMServer from "react-dom/server";
import { isHTML, truncateHtml } from "../../../utils/helper";
import DOMPurify from "dompurify";

const randomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

const trimTextWithEllipsis = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

// const truncateHtml = (html, maxLength) => {
//   const tmp = document.createElement("div");
//   tmp.innerHTML = html;
//   if (tmp.textContent.length > maxLength) {
//     return tmp.textContent.substring(0, maxLength) + "...";
//   }
//   return html;
// };

// const truncateHtml = (html, maxLength) => {
//   const tmp = document.createElement("div");
//   tmp.innerHTML = html;

//   if (tmp.textContent.length > maxLength) {
//     const truncatedText = tmp.textContent.substring(0, maxLength) + "...";
//     tmp.innerHTML = truncatedText;
//   }

//   return tmp.innerHTML;
// };

const CustomNode = ({ nodeDatum, foreignObjectProps, userType }) => {
  let padding = 10;
  let truncatedLabel = "N/A";
  let contentIsHTML = false;

  let label = trimTextWithEllipsis(nodeDatum.name, 115);
  contentIsHTML = isHTML(nodeDatum.name);

  if (contentIsHTML) {
    // const labelHtml = ReactDOMServer.renderToStaticMarkup(
    //   <span
    //     dangerouslySetInnerHTML={{
    //       __html: truncateHtml(nodeDatum.name, 115),
    //     }}
    //   />
    // );
    padding = 15;
    // Truncate HTML content
    truncatedLabel = truncateHtml(nodeDatum.name, 100); // Maximum length for truncated HTML and content
  }

  let nodeClassName = styles.node;

  if (userType === "admin") {
    if (nodeDatum.attributes.isQuestion) {
      nodeClassName = styles.node;
    } else {
      if (
        nodeDatum.attributes.isAdminOptimal &&
        nodeDatum.attributes.isOptimal
      ) {
        nodeClassName = styles.selected;
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
              <div className={styles.tooltipContent}
                style={{
                  maxWidth: '50rem',
                  wordBreak: "break-all",
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: nodeDatum.name }}></div>
              </div>
            )}
            style={{
              padding: !contentIsHTML
                ? `${padding * 0.5}px ${padding}px`
                : `${padding * 0.1}px ${padding}px ${padding * 0.1}px ${padding + 5
                }px`,
            }}
          >
            {/* {label} */}
            {/* <span dangerouslySetInnerHTML={{ __html: labelHtml }} /> */}
            {!contentIsHTML
              ? label
              : truncatedLabel && (
                <span
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(truncatedLabel),
                  }}
                />
              )}
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
    if (containerRef.current && data) {
      try {
        if (userType === "admin") {
          const optimalElements = containerRef.current.querySelectorAll(
            `path.${styles.selectedEdge}`
          );

          optimalElements.forEach((element) => {
            const parent = element.parentElement;

            if (parent && parent.contains(element)) {
              const clonedNode = element.cloneNode(true);
              if (clonedNode) {
                parent.appendChild(clonedNode);
                parent.removeChild(element);
              }
            }
          });
        } else {
          const optimalElements = containerRef.current.querySelectorAll(
            `path.${styles.selectedEdge}`
          );

          optimalElements.forEach((element) => {
            const parent = element.parentElement;

            if (parent && parent.contains(element)) {
              const clonedNode = element.cloneNode(true);
              if (clonedNode) {
                parent.appendChild(clonedNode);
                parent.removeChild(element);
              }
            }
          });
        }

        const gElements = containerRef.current.querySelectorAll(`g.rd3t-node`);

        gElements.forEach((element) => {
          const parent = element.parentElement;

          if (parent && parent.contains(element)) {
            const clonedNode = element.cloneNode(true);
            if (clonedNode) {
              parent.appendChild(clonedNode);
              parent.removeChild(element);
            }
          }
        });

        // const leafElements =
        //   containerRef.current.querySelectorAll(`g.rd3t-leaf-node`);

        // leafElements.forEach((element) => {
        //   const parent = element.parentElement;

        //   if (parent && parent.contains(element)) {
        //     parent.appendChild(element.cloneNode(true));
        //     parent.removeChild(element);
        //   }
        // });

        const { width, height } = containerRef.current.getBoundingClientRect();
        setTranslate({ x: width / 2, y: 0 });
      } catch (e) {}
    }

    return () => {
      // containerRef.current = null;
    };
  }, [containerRef, data]);

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
      style={{ width: "100%", height: "100%", position: "relative" }}
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
      <svg
        className={styles.reset}
        viewBox="0 0 16 16"
        onClick={() => {
          console.log("containerRef", containerRef);
          if (containerRef.current) {
            const { width, height } =
              containerRef.current.getBoundingClientRect();

            setTranslate({ x: width / 2 + randomNumber(0.1, 0.2), y: 0 });
          }
        }}
      >
        <path
          d="M13.64 2.35C12.8999 1.60485 12.0196 1.01356 11.0499 0.610231C10.0802 0.206901 9.04024 -0.000494355 7.99 8.84845e-07C3.57 8.84845e-07 0 3.58 0 8C0 12.42 3.57 16 7.99 16C11.72 16 14.83 13.45 15.72 10H13.64C13.2281 11.1695 12.4633 12.1824 11.4513 12.8988C10.4393 13.6153 9.22994 14 7.99 14C4.68 14 1.99 11.31 1.99 8C1.99 4.69 4.68 2 7.99 2C9.65 2 11.13 2.69 12.21 3.78L8.99 7H15.99V8.84845e-07L13.64 2.35Z"
          fill="#FFB600"
        />
      </svg>
      <Tooltip id="my-tooltip" place="right" />
    </div>
  );
};

export default SelectedTree;
