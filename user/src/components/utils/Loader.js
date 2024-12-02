import React from 'react';
import '../../styles/loader.css';

const Loader = ({ width, height, marginRight, marginLeft, marginTop, bRadius }) => {
    return (
        <div className="loader" style={{ width: width,
                                         height: height,
                                         marginRight: marginRight,
                                         marginLeft: marginLeft,
                                         marginTop: marginTop,
                                         borderRadius: bRadius }}></div>
    );
};

export default Loader;
