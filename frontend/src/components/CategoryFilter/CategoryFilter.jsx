import { useState, useRef } from 'react'
import './CategoryFilter.scss'
import { ViewCategory } from './ViewCategory'

const CategoryFilter = ({ category, fontFamily, searchText, searchRegex, searchCasing, categories }) => {
    const [ showViewCategory, setShowViewCategory ] = useState(false)
    const anchorRef = useRef(null);

    const clickCategory = () => {
        setShowViewCategory(true)
    }

    return (
        <div ref={anchorRef}>
            <span className={`category-button ${category.isFilterActive && category.isFilterActive(category.key)? 'category-button-active' : ''}`}
                onClick={clickCategory}
            >
                <b>&nbsp;{category.text}&nbsp;</b>
            </span>

            {showViewCategory && 
                <ViewCategory
                    category={category}
                    searchText={searchText}
                    searchRegex={searchRegex}
                    searchCasing={searchCasing}
                    categories={categories}
                    setShowViewCategoryMenu={setShowViewCategory}
                    letf={anchorRef.current?.getBoundingClientRect().left + 202}
                    top={anchorRef.current?.getBoundingClientRect().top - 164}
                />
            }

        </div>
    );

}

export default CategoryFilter
