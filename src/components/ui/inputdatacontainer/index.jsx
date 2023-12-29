import styles from "./inputtdatacontainer.module.css";
const InputDataContainer = ({
    customRightContainerStyles,
    children }) => {
    return (
        <div className={styles.formContainer}>
            <div className={styles.formLeft}></div>
            <div style={customRightContainerStyles} className={styles.formRight} >
                {children}
            </div>
        </div>
    );
}

export default InputDataContainer;