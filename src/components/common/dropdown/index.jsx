import style from "./dropdown.module.css";
import React from 'react';
import { Select, Badge } from '@appkit4/react-components'

const Dropdown = ({
    data,
    value,
    label,
    onSelect = () => { },
    selecttStyleClass,
    customContainerClass,
    customLabelStyle,
    labelStyle,
    ...props
}) => {

    return (
        <div className={`${customContainerClass} ${style.formGroup}`}>
            <label style={customLabelStyle} className={labelStyle}>{label}</label>

            <Select
                data={data}
                value={value}
                className={`${style.formControl} ${selecttStyleClass}`}
                badgeTemplate={item => {
                    return (item.badgeValue && <Badge size="lg" style={{ marginLeft: 8 }} value={item.badgeValue}></Badge>)
                }}
                onSelect={onSelect}
                dropdownRenderMode="portal"
                {...props}
            />
        </div>

    );

}
export default Dropdown;
