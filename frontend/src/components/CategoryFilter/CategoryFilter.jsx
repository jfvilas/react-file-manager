import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
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
            <span 
                style={{ 
                    border: '1px solid #e0e0e0', 
                    borderRadius:'4px', 
                    fontSize:'10px', 
                    cursor:'pointer', 
                    padding: '4px',
                    backgroundColor: category.isFilterActive && category.isFilterActive(category.key)? 'black' : '#f5f5f5',
                    color: category.isFilterActive && category.isFilterActive(category.key) ? 'white':''
                }}
                onClick={clickCategory}
            >
                <b>&nbsp;{category.text}&nbsp;</b>
            </span>

            {showViewCategory && createPortal(
                <div style={{
                    position: 'fixed',
                    top: anchorRef.current?.getBoundingClientRect().bottom + 2,
                    left: anchorRef.current?.getBoundingClientRect().left + 202,
                    zIndex: 9999,
                    fontFamily,
                    backgroundColor: 'white',
                    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)'
                }}>
                    <ViewCategory
                        category={category}
                        searchText={searchText}
                        searchRegex={searchRegex}
                        searchCasing={searchCasing}
                        categories={categories}
                        setShowViewCategoryMenu={setShowViewCategory}
                    />
                </div>,
                document.body
            )}
        </div>
    );

}

export default CategoryFilter
