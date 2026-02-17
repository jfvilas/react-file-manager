import { FaCheck } from 'react-icons/fa6'
import { useDetectOutsideClick } from '../../hooks/useDetectOutsideClick'
import { useSelection } from '../../contexts/SelectionContext'
import { useFileNavigation } from "../../contexts/FileNavigationContext"

const HeaderSelector = ({ setHeaderSelectorVisible, space, spaces }) => {

    const viewHeaderSelectorRef = useDetectOutsideClick(() => {
        setHeaderSelectorVisible(false)
    })

    const handleSelection = (name) => {
        setHeaderSelectorVisible(false)
		let col = spaces.get(space).properties.find(p => p.name===name)
		col.visible = !col.visible
		//setColumnWidths( {...columnWidths})  // refresh
    }

    return (
        <div ref={viewHeaderSelectorRef.ref} className='category-view' role='dropdown'>
            <ul role='menu' aria-orientation='vertical'>
                {spaces.get(space).properties.map((property, index) => 
                    <li role='menuitem' key={index} onClick={() => handleSelection(property.name)} onKeyDown={() => handleSelection(property.name)}>
                        <span>{property.visible && <FaCheck size={13} />}</span>
                        <span>{property.text}</span>
                    </li>
                )}
            </ul>
        </div>
    )
}

export { HeaderSelector }
