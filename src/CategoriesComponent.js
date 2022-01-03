import React from 'react'



export default function CategoriesComponent({displaySettings,categories,currentCategory, onChangeCategory}) {

    return (
        <div className={displaySettings.categoryOptionsStyle} id="categoryOptionsDiv">
            <span id="categorySpan">Category:</span>
            <select value={currentCategory} onChange={onChangeCategory}>
                {categories.map((category,index) => (
                    <option key={index} value={category.name}>{category.name}</option>
                ))}
            </select>
        </div>
    )
}
