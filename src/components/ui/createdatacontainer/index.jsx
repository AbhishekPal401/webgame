import styles from "./createdatacontainer.module.css";

const CreateDataContainer = ({
    customContainerClass,
    customLeftContainerClass,
    customRightContainerClass,
    customBackgroundStyles,
    children }) => {
    return (
        <div className={`${customContainerClass || styles.formContainer} `}>
            <div className={`${customLeftContainerClass || styles.formLeft} `}></div>
            <div className={`${customBackgroundStyles || styles.defaultContainerBackGround} ${customRightContainerClass || styles.formRight} `}>
                {children}
            </div>
        </div>
    );
}

export default CreateDataContainer;