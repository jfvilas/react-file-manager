import { FaCheck } from 'react-icons/fa6'
import { useDetectOutsideClick } from '../../hooks/useDetectOutsideClick'

const ViewCategories = ({ setShowViewCategoriesMenu, categories }) => {
    const viewCategoriesRef = useDetectOutsideClick(() => {
        setShowViewCategoriesMenu(false)
    })

    const viewCategories = categories.all.map(c => { return {
        key: c.key || c.text,
        text: c.text || c.key,
        checked: categories.selected.includes(c.key)
    }})

    const handleSelection = (key) => {
        setShowViewCategoriesMenu(false)
        if (categories.selected.includes(key))
            categories.selected = categories.selected.filter(x => x!==key)
        else
            categories.selected.push(key)
        categories.onCategoriesChange(categories.selected)
    }

    return (
        <div ref={viewCategoriesRef.ref} className='categories-view' role='dropdown'>
            <ul role='menu' aria-orientation='vertical'>
                {viewCategories.map((category, index) => 
                    category.key!=='-'?
                        <li role='menuitem' key={index} onClick={() => handleSelection(category.key)} onKeyDown={() => handleSelection(category.key)} style={{widtrh:'100%'}}>
                        <span>{category.checked && <FaCheck size={13} />}</span>
                        <span>{category.text}</span>
                    </li>
                    :
                    <div key={category.key} className="divider" style={{boderTop:0, borderLeft:0, borderRight:0, borderWidth:1, borderColor: '#c4c4c4', borderBottom:0, borderStyle:'solid'}}></div>
                )}
            </ul>
        </div>
    )
}

export { ViewCategories }
