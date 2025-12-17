import React, { useRef, useState } from 'react';
import './SearchInput.scss'

const SearchInput = ({ onFilterChange, searchRegex, searchCasing }) => {
    const inputRef = useRef(null)
    const [filterRegex, setFilterRegex] = useState(false)
    const [filterCasing, setFilterCasing] = useState(false)

    const handleKeyDown = (e) => {
        if ("Delete Home End".includes(e.key)) e.stopPropagation()
    }

    const clickRegex = () => {
        onFilterChange(inputRef.current.value, !filterRegex, filterCasing)
        setFilterRegex(!filterRegex)
    }
    const clickCasing = () => {
        onFilterChange(inputRef.current.value, filterRegex, !filterCasing)
        setFilterCasing(!filterCasing)
    }

    return (
        <div>
            <input 
                ref={inputRef}
                placeholder='Search...'
                className='search-input'
                onFocus={(e) => e.target.placeholder = ""}
                onBlur={
                    (e) => {
                        e.target.placeholder = 'Search...'
                    }
                }
                onKeyDown={handleKeyDown}
                onKeyUp={(e) => {
                    if (e.key === 'Escape') {
                        onFilterChange('', false, false)
                        if (inputRef.current) {
                            inputRef.current.value = ''; 
                            inputRef.current.placeholder = 'Search...';
                            inputRef.current.blur();
                        }                        
                    }
                    else {
                        onFilterChange(inputRef.current.value, filterRegex, filterCasing)
                    }
                }}
            />
            { !searchRegex && !searchCasing &&
                <svg 
                    width="16"
                    height="16"
                    fill="none"
                    stroke="#000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-60%)", pointerEvents: "none" }}
                >
                    <circle cx="11" cy="11" r="6" />
                    <line x1="21" y1="21" x2="14.65" y2="14.65" />
                </svg>
            }
            { searchRegex &&
                <span style={{ border: '1px solid #e0e0e0', borderRadius:'4px', backgroundColor: filterRegex? 'black' : '#f5f5f5', color: filterRegex? 'white':'', position: "absolute", right: (searchCasing?28:8)+"px", top: "50%", width:'14px', height:'14px', fontSize:'10px', textAlign:'center', transform: "translateY(-60%)", cursor:'default' }} onClick={clickRegex}><b>.*</b></span>
            }
            { searchCasing &&
                <span style={{ border: '1px solid #e0e0e0', borderRadius:'4px', backgroundColor: filterCasing? 'black' : '#f5f5f5', color: filterCasing? 'white':'', position: "absolute", right: "12px", top: "50%", width:'14px', height:'14px', fontSize:'9px', verticalAlign:'center',  textAlign:'center', transform: "translateY(-60%)", cursor:'default' }} onClick={clickCasing}><b>aA</b></span>
            }
        </div>
    )
}

export default SearchInput
