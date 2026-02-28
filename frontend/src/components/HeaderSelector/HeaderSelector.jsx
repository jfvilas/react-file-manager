import { FaCheck } from 'react-icons/fa6'
import { useDetectOutsideClick } from '../../hooks/useDetectOutsideClick'

const HeaderSelector = ({ setHeaderSelectorVisible, onHeadersReset, space, spaces }) => {

    const viewHeaderSelectorRef = useDetectOutsideClick(() => {
        setHeaderSelectorVisible(false)
    })

    const handleHeaderVisibility = (name) => {
        setHeaderSelectorVisible(false)
		let col = spaces.get(space).properties.find(p => p.name===name)
		col.visible = !col.visible
    }

    const handleHeadersReset = () => {
        setHeaderSelectorVisible(false)
        onHeadersReset(space)
    }

    return (
        <div ref={viewHeaderSelectorRef.ref} className='category-view' role='dropdown'>
            <ul role='menu' aria-orientation='vertical'>
                {spaces.get(space).properties.map((property, index) => 
                    <li role='menuitem' key={index} onClick={() => handleHeaderVisibility(property.name)} onKeyDown={() => handleHeaderVisibility(property.name)}>
                        <span>{property.visible && <FaCheck size={13} />}</span>
                        <span>{property.text}</span>
                    </li>
                )}
                <div className='divider' style={{boderTop:0, borderLeft:0, borderRight:0, borderWidth:1, borderColor: '#c4c4c4', borderBottom:0, borderStyle:'solid'}}/>
                <li role='menuitem' onClick={handleHeadersReset} onKeyDown={handleHeadersReset}>
                    <span/>
                    <span>Reset</span>
                </li>
            </ul>
        </div>
    )
}

export { HeaderSelector }
