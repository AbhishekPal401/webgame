import styles from "./inputtdatacontainer.module.css";
const InputDataContainer = ({ 
  customRightContainerStyles,
  customFormContainerStyles,
  children,
 }) => {
  return (
    <div style={customFormContainerStyles} className={styles.formContainer}>
      <div className={styles.formLeft}></div>
      <div
        style={{
          ...customRightContainerStyles,
          backgroundImage: 'url("./images/particles.png")',
        }}
        className={styles.formRight}
      >
        {children}
      </div>
    </div>
  );
};

export default InputDataContainer;
