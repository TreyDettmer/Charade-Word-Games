import React from 'react'


export default function CategoryLoaderComponent(props) {
    const {
        displaySettings,
        LoadCategories
    } = props;

    if (displaySettings.categoryLoaderStyle === "loading")
    {
        return (
            <div>Loading Categories...</div>
        )
    }
    else
    {
        return (
            <div>
                <button id="categoryLoaderDiv" className={displaySettings.categoryLoaderStyle} onClick={LoadCategories}>Load Categories</button>
            </div>
        )
    }


}
