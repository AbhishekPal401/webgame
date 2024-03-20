import React, { useState, useMemo } from 'react';
import styles from './textEditor.module.css';
import { TextEditor } from '@appkit4/react-text-editor';
const RichTextEditor = ({
    sampleConfig,
    data,
    title,
    error,
    customContaierClass = {},
    customEditorStyleClass,
    onChange = () => { },
    ...props
}) => {

    return (
        <div className={`${styles.container} ${customContaierClass}`}>
            <TextEditor
                config={sampleConfig}
                className={`${styles.editor} ${customEditorStyleClass}`}
                data={data}
                title={title}
                onChange={onChange}
                {...props}
            />
            {/* {error && <div className={styles.error}>{error}</div>} */}

        </div>
    );
};

export default RichTextEditor;
