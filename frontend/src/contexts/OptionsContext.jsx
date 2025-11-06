import { createContext, useContext, useState } from 'react';

const OptionsContext = createContext()

export function OptionsProvider({ children }) {
    const [options, setOptions] = useState({
        statusBar: true,
        checkBox: false,
        folderTree: true
    })

    const toggleStatusBar = () => setOptions(prev => ({ ...prev, statusBar: !prev.statusBar }))
    const toggleFolderTree = () => setOptions(prev => ({ ...prev, folderTree: !prev.folderTree }))
    const toggleCheckBox = () => setOptions(prev => ({ ...prev, checkBox: !prev.checkBox }))

    return (
        <OptionsContext.Provider value={{ options, toggleStatusBar, toggleFolderTree, toggleCheckBox }}>
            {children}
        </OptionsContext.Provider>
    )
}

export function useOptions() {
    const context = useContext(OptionsContext);
    if (!context) {
        throw new Error('useOptions must be included inside a <OptionsProvider>')
    }
    return context
}