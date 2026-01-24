import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import './CategoriesFilter.scss'
import { ViewCategories } from './ViewCategories'

const CategoriesFilter = ({ categories, fontFamily }) => {
    const [ showViewCategories, setShowViewCategories ] = useState(false)
    const anchorRef = useRef(null);

    const clickCategories = () => {
        setShowViewCategories(true)
    }

    return (
        <div ref={anchorRef}>
            <span 
                style={{ 
                    border: '1px solid #e0e0e0', 
                    borderRadius:'4px', 
                    fontSize:'10px', 
                    cursor:'pointer', 
                    padding: '4px'
                }}
                onClick={clickCategories}
            >
                <b>&nbsp;{categories.text}&nbsp;</b>
            </span>

            {showViewCategories && createPortal(
                <div style={{
                    position: 'fixed',
                    top: anchorRef.current?.getBoundingClientRect().bottom + 2,
                    left: anchorRef.current?.getBoundingClientRect().left + 202,
                    zIndex: 9999,
                    fontFamily,
                    backgroundColor: 'white',
                    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)'
                }}>
                    <ViewCategories categories={categories} setShowViewCategoriesMenu={setShowViewCategories} />
                </div>,
                document.body
            )}
        </div>
    );

}

export default CategoriesFilter
