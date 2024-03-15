import React from "react";
// import { ColorRing } from "react-loader-spinner";
// import { Loading } from "@appkit4/react-components/loading";
// import "@appkit4/styles/appkit.min.css";
// import "@appkit4/react-components/dist/styles/appkit4-react.min.css";

const QuestionLoader = ({ color = "#ffb600", size = 120 }) => {
  return (
    // <div className={"loader-wrapper"}>
    //   {/* <ColorRing
    //     visible={true}
    //     height={`${size}`}
    //     width={`${size}`}
    //     ariaLabel="color-ring-loading"
    //     wrapperStyle={{}}
    //     wrapperClass="color-ring-wrapper"
    //     colors={[color, color, color, color, color]}
    //   /> */}
    //   {/* <Loading
    //     loadingType="circular"
    //     indeterminate={true}
    //     compact={true}
    //     stopPercent={100}
    //   ></Loading> */}
    // </div>
    <div className="loader-container">
      <div className="loader"></div>
    </div>
  );
};

export default QuestionLoader;
