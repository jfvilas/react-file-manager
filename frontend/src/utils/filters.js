export const applySearchText = (f, searchText, searchRegex, searchCasing) => {
    if (searchText!=='' && searchText!==undefined) {
        if (searchCasing) {
            if (searchRegex) {
                try {
                    const regex=new RegExp(searchText)
                    if (!regex.test(f.name)) return false
                }
                catch { return false }
            }
            else {
                if (!f.name.includes(searchText)) return false
            }
        }
        else {
            if (searchRegex) {
                try {
                    const regex=new RegExp(searchText.toLocaleLowerCase())
                    if (!regex.test(f.name.toLocaleLowerCase())) return false
                }
                catch { 
                    return false 
                }
            }
            else {
                if (!f.name.toLocaleLowerCase().includes(searchText.toLowerCase())) return false
            }
        }
    }
    return true
}

export const applyCategories = (f, allCategories, folderCategories) => {
    if (allCategories && folderCategories) {
        let applicableCategories = allCategories.filter(c => folderCategories.includes(c.key))
        let valid=true
        for (let c of applicableCategories) {
            valid = valid && c.onCategoryFilter(c.key, f)
            if (!valid) return false
        }
    }
    return true
}

export const applyFilters = (files, searchText, searchRegex, searchCasing, categories, folderCategories) => {
    if (searchText!=='' && searchText!==undefined) {
        files = files.filter(f => applySearchText(f, searchText, searchRegex, searchCasing))
    }
    if (categories && folderCategories) {
        files = files.filter(f => applyCategories(f, categories, folderCategories))
    }
    return files
}
