import React from "react";
import { ColorRing } from "react-loader-spinner";

const QuestionLoader = ({ color = "#ffb600", size = 120 }) => {
  return (
    <div className={"loader-wrapper"}>
      <ColorRing
        visible={true}
        height={`${size}`}
        width={`${size}`}
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={[color, color, color, color, color]}
      />
    </div>
  );
};

export default QuestionLoader;
