import { BsGridFill } from "react-icons/bs"
import { FaCheck, FaListUl, FaWindowMinimize, FaRegSquareCheck, FaFolderTree } from "react-icons/fa6"
import { useDetectOutsideClick } from "../../hooks/useDetectOutsideClick"
import { useLayout } from "../../contexts/LayoutContext"
import { useTranslation } from "../../contexts/TranslationProvider"
import { useOptions } from '../../contexts/OptionsContext'

const ViewOptions = ({ setShowViewOptionsMenu, onLayoutChange, onNavigationPaneChange }) => {
  const viewOptionsRef = useDetectOutsideClick(() => {
      setShowViewOptionsMenu(false)
  })
  const { activeLayout, setActiveLayout } = useLayout()
  const t = useTranslation()
  const { options, toggleStatusBar, toggleCheckBox, toggleFolderTree } = useOptions()

  const viewOptions = [
    {
        key: "grid",
        name: t("grid"),
        icon: <BsGridFill size={18} />,
        checked: activeLayout==='grid'
    },
    {
        key: "list",
        name: t("list"),
        icon: <FaListUl size={18} />,
        checked: activeLayout==='list'
    },
    {
        key: "divider",
    },
    {
        key: "statusbar",
        name: 'Status bar',
        icon: <FaWindowMinimize size={18} />,
        checked: options.statusBar
    },
    {
        key: "checkbox",
        name: 'Check box',
        icon: <FaRegSquareCheck size={18} />,
        checked: options.checkBox
    },
    {
        key: "foldertree",
        name: 'Folder tree',
        icon: <FaFolderTree size={18} />,
        checked: options.folderTree
    }
  ]

  const handleSelection = (key) => {
    switch (key) {
        case 'grid':
        case 'list':
            setActiveLayout(key)
            onLayoutChange(key)
            break
        case 'statusbar':
            toggleStatusBar()
            break
        case 'checkbox':
            toggleCheckBox()
            break
        case 'foldertree':
            onNavigationPaneChange(!options.folderTree)
            toggleFolderTree()
            break
    }
    setShowViewOptionsMenu(false)
  }

  return (
    <div ref={viewOptionsRef.ref} className="toggle-view" role="dropdown">
        <ul role="menu" aria-orientation="vertical">
            {viewOptions.map((option) => 
                option.key==='divider'?
                <div key={option.key} className="divider" style={{boderTop:0, borderLeft:0, borderRight:0, borderWidth:1, borderColor: '#c4c4c4', borderBottom:0, borderStyle:'solid'}}></div>
                :
                <li role="menuitem" key={option.key} onClick={() => handleSelection(option.key)} onKeyDown={() => handleSelection(option.key)} >
                    <span>{option.checked && <FaCheck size={13} />}</span>
                    <span>{option.icon}</span>
                    <span>{option.name}</span>
                </li>
            )}
        </ul>
    </div>
  )
}

export { ViewOptions }
