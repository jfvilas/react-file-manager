import './SearchInput.scss'

const SearchInput = ({ onFilterChange }) => {
    const id='jfvilas-react-file-manager-search-id'
    const handleKeyDown = (e) => {
        if ("Delete Home End".includes(e.key)) e.stopPropagation()
    }

  return (
    <div>
        <input 
            id={id}
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
                    onFilterChange('')
                    e.preventDefault()
                    document.getElementById(id).value=''
                    e.target.placeholder = 'Search...'
                    e.target.blur()
                }
                else {
                    onFilterChange(document.getElementById(id).value)
                }
            }}
        />
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
    </div>

  )
}

export default SearchInput
