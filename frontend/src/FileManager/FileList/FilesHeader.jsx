import { useMemo, useState } from 'react'
import Checkbox from '../../components/Checkbox/Checkbox'
import { useFileNavigation } from '../../contexts/FileNavigationContext'
import { useSelection } from '../../contexts/SelectionContext'
import { useTranslation } from '../../contexts/TranslationProvider'
import { useOptions } from '../../contexts/OptionsContext'

const FilesHeader = ({ space, spaces, unselectFiles, onSort, sortConfig }) => {
    const t = useTranslation()
    const [showSelectAll, setShowSelectAll] = useState(false);
    const { options } = useOptions()
    const { selectedFiles, setSelectedFiles } = useSelection();
    const { currentPathFiles } = useFileNavigation();

    const allFilesSelected = useMemo(() => {
        return (currentPathFiles.length > 0) && (selectedFiles.length === currentPathFiles.length)
    }, [selectedFiles, currentPathFiles])

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedFiles(currentPathFiles)
            setShowSelectAll(true)
        }
        else {
            unselectFiles()
        }
    }

    const handleSort = (key) => {
        if (onSort) onSort(key)
    }

    return (
        <div className='files-header' onMouseOver={() => setShowSelectAll(true)} onMouseLeave={() => setShowSelectAll(false)} >
            {
                options.checkBox && <div className='file-select-all'>
                    {(showSelectAll || allFilesSelected) && (
                    <Checkbox
                        id='selectAll'
                        checked={allFilesSelected}
                        onChange={handleSelectAll}
                        title='Select all'
                        disabled={currentPathFiles.length === 0}
                    />
                    )}
                </div>
            }
            <div className={`${sortConfig?.key === 'name' ? 'active' : ''}`} style={{ width: `calc(${spaces.get(space)?.width||10}% - 60px)`, paddingLeft: options.checkBox? '15px':'35px'}} onClick={() => handleSort('name')}>
                {spaces.get(space)?.text||''}
                {sortConfig?.key === 'name' && (
                    <span className='sort-indicator'>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
            </div>

            { spaces.get(space)?.properties.filter(p => p.visible).map((property) => {
                return (
                    <div key={property.name} className={`${sortConfig?.key === property.name ? 'active' : ''}`} style={{ width: `calc(${property.width}%)`}} onClick={() => handleSort(property.name)}>
                        {property.text}
                        {sortConfig?.key === property.name && (
                            <span className='sort-indicator'>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                        )}
                    </div>
                )
            })}
        </div>
    )    
}

export default FilesHeader