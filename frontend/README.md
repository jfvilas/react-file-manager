# React File Manager
<p>
An open-source React package for easy integration of a file manager into applications. It provides a user-friendly interface for managing files and folders, including viewing, uploading, and deleting, with full UI and backend integration.

This project is forked from [this fantastic project](https://github.com/Saifullah-dev/react-file-manager).

And our source code project is [here](https://github.com/jfvilas/react-file-manager).
</p>

## ✨ Features
- **File & Folder Management**: View, upload, download, delete, copy, move, create, and rename files
  or folders seamlessly.
- **Grid & List View**: Switch between grid and list views to browse files in your preferred layout.
- **Navigation**: Use the breadcrumb trail and sidebar navigation pane for quick directory
  traversal.
- **Toolbar & Context Menu**: Access all common actions (upload, download, delete, copy, move,
  rename, etc.) via the toolbar or right-click for the same options in the context menu.
- **Context cutomization**: Add your specific *icons* and *actions* for your unique object types. They
  will be shown when needed and added to context menus.
- **Multi-Selection**: Select multiple files and folders at once to perform bulk actions like
  delete, copy, move, or download.
- **Keyboard Shortcuts**: Quickly perform file operations like copy, paste, delete, and more using
  intuitive keyboard shortcuts.
- **Drag-and-Drop**: Move selected files and folders by dragging them to the desired directory,
  making file organization effortless.
- **Search**: the navigation pane includes a search feature for filtering files on current
  directory.
- **Status bar**: the navigation pane includes a status bar where info about curren folder
  and info abour current selection is shown.


## 🚀 Installation
To install `React File Manager`, use the following command:

```bash
npm i @jfvilas/react-file-manager
```


## 💻 Usage
Here’s a basic example of how to use the File Manager Component in your React application:

```jsx
import { useState } from "react";
import { FileManager } from "@jfvilas/react-file-manager";
import "@jfvilas/react-file-manager/dist/style.css";

function App() {
  const [files, setFiles] = useState([
    {
      name: "Documents",
      isDirectory: true, // Folder
      path: "/Documents", // Located in Root directory
      updatedAt: "2024-09-09T10:30:00Z", // Last updated time
    },
    {
      name: "Pictures",
      isDirectory: true,
      path: "/Pictures", // Located in Root directory as well
      updatedAt: "2024-09-09T11:00:00Z",
    },
    {
      name: "Pic.png",
      isDirectory: false, // File
      path: "/Pictures/Pic.png", // Located inside the "Pictures" folder
      updatedAt: "2024-09-08T16:45:00Z",
      size: 2048, // File size in bytes (example: 2 KB)
      class: 'image' // optional property for customization
    },
  ]);

  return (
    <>
      <FileManager files={files} />
    </>
  );
}

export default App;
```


## Typescript Usage
If you plan to user react-file-manager in a Typescript project, you can add type management by adding a `.d.ts` file. What follows is a sample file, but you can donwload a full module declaaration file **[here](https://raw.githubusercontent.com/jfvilas/react-file-manager/refs/heads/main/frontend/public/jfvilas-react-file-manager.d.ts)**. Inside that file you will find a module declaration and a bunch of type and interface declarations. What follows is just a excerpt.

```typescript
declare module '@jfvilas/react-file-manager' {
    export interface IFileData {
        name: string;
        isDirectory: boolean;
        path: string;
        updatedAt?: string;
        size?: number;
        class?: string;
    }

    export interface IError {
        type: string,
        message: string,
        response: {
            status: number,
            statusText: string,
            data: any,
        }
    }
...
```

In order to use this 'types' declaration file, just donwload and add it to your project inside your source folder (or any other folder and change your `package.json` accordingly).

## 📂 File Structure
The `files` prop accepts an array of objects, where each object represents a file or folder. You can
customize the structure to meet your application needs. Each file or folder object follows the
structure detailed below:

```typescript
type File = {
  name: string;
  isDirectory: boolean;
  path: string;
  updatedAt?: string; // Optional: Last update timestamp in ISO 8601 format
  size?: number; // Optional: File size in bytes (only applicable for files)
  class?:string; // Optional: File class to be used with custom icons and custom actions
};
```

## 🎬 Icons & Actions
By adding your own icons and specific actions for your items, you can think of react-file-manager as just a hierarchical object manager, that is, this package is no longer just a file manager, you can, for example, create a hierarchy of books and implement particular actions. For example...:

 - You can have a top level category that consist of types of books: novel, essay, history...
 - On a second level you can add the topic: science-fiction, love, thriller...
 - On a third level you can just store the book title.

You can also add specific icons for each object (category, topic, book).

Moreover, you can add specific actions for each type of object:

  - For the top level, a sample action could be to show the list of books that belong to that category.
  - For the third level, the book in itself, you could add some actions like: read, view details, share link...

You can build interfaces like this: 
![fileman](https://raw.githubusercontent.com/jfvilas/react-file-manager/refs/heads/main/frontend/public/fileman.png)

For achieving these objectives you need to add to each entry in the `files` object an **optional** property called `class`. So, for the top level, the class property could be `category`. For the second level, the value of `class` could be something like `topic`, and for the third level it could be something like `book`.

The next step is to add the icons for these objects. You must create a Map like this one:

```javascript
  let icons = new Map();
  icons.set('category', { open: <JSX.Element />, closed: <JSX.Element />, list: <JSX.Element />, grid: <JSX.Element /> })
  icons.set('topic', { default: <JSX.Element /> })
  icons.set('book', { open: <JSX.Element />, closed: <JSX.Element /> })
```

This way, when rendering an object with the `class` `category`, react-file-manager will show the proper icon, in the folder tree and also in the file list, wherever it be a grid or a list.

If you want to add specific actions for each `class`, you can, for example, create an `actions` map like this:

```javascript
  let actions = new Map();
  actions.set('book', [
    {
      title: 'Read book',
      icon: <FaRead />,
      onClick: (files) => {
        console.log('onclick view:', files)
      }
    },
    {
      title: 'Book details',
      icon: <FaBook />,
      onClick: (files) => {
        console.log('onclick delete:', files)
      }
    }
  ])
```

This previous piece of code adds two actions to objects of `class` `book`:

  - One for reading the book (the `onClick` method should open an ebook reader on screen).
  - Another one for viewing book details.

A typical action contains these properties (review the `.d.td` file):
  - `title`: the text to appear in context menus.
  - `icon`: the icon to show next to the text.
  - `onClick`: a function to process the action (one only parameter will be send: an array contianing the files which the action must be executed on).

Once you have defined your `icons` and your `actions`, you just need to add them to your FileManager object like this:

```xml
  <FileManager files={files} icons={icons} actions={actions} />
```

...And you'll see the magic 🪄!!

What follows is an example with Kubernetes objects, icons and actions that we have implemented in [Kwirth](https://www.github.com/jfvilas/kwirth) project.

![fileman-2](https://raw.githubusercontent.com/jfvilas/react-file-manager/refs/heads/main/frontend/public/fileman-2.png)


## 🎨 UI Customization
`react-file-manager` can be easily customized to mmet your React application UI srtyles.

The simplest way for customizing this component is as follows:

  1. Create a `.css` file in your project directory (`custom-fm.css`, for example).
  2. Import it in the JSX or TSX file that contains your FileManager object: 
  ```javascript
  import './custom-fm.css'
  ```
  3. Customize your FileManager by adding classes to the `custom-fm.css` file. For example (please note we add our class name `custom-fm` on each style):
  ```css
  .custom-fm .toolbar {
    background-color: #e0e0e0;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  .custom-fm .files-container {
    background-color: #f0f0f0;
  }
  ```
  4. Add your class name to your `FileManager` object this way:
  ```xml
  <FileManager ... className='custom-fm'>
  ```

Et voilà !


## ⚙️ Props

| Name | Type  | Description  |
| -    | -     | -            |
| `acceptedFileTypes`      | string  | (Optional) A comma-separated list of allowed file extensions for uploading specific file types (e.g., `.txt, .png, .pdf`). If omitted, all file types are accepted.  |
| `actions`                | Map<string Action[]>    |   (Optional) A map of custom actions that would be added to the proper file class  |
| `className`              | string  | CSS class names to apply to the FileManager root element.  |
| `collapsibleNav`         | boolean  | Enables a collapsible navigation pane on the left side. When `true`, a toggle will be shown to expand or collapse the navigation pane. `default: false`.  |
| `defaultNavExpanded`     | boolean  | Sets the default expanded (`true`) or collapsed (`false`) state of the navigation pane when `collapsibleNav` is enabled. This only affects the initial render. `default: true`. |
| `enableFilePreview`      | boolean | A boolean flag indicating whether to use the default file previewer in the file manager `default: true`.  |
| `filePreviewPath`        | string | The base URL for file previews e.g.`https://example.com`, file path will be appended automatically to it i.e. `https://example.com/yourFilePath`. |
| `filePreviewComponent`   | (file: [File](#-file-structure)) => React.ReactNode | (Optional) A callback function that provides a custom file preview. It receives the selected file as its argument and must return a valid React node, JSX element, or HTML. Use this prop to override the default file preview behavior. Example: [Custom Preview Usage](#custom-file-preview). |
| `fileUploadConfig`       | { url: string; method?: "POST" \| "PUT"; headers?: { [key: string]: string } } | Configuration object for file uploads. It includes the upload URL (`url`), an optional HTTP method (`method`, default is `"POST"`), and an optional `headers` object for setting custom HTTP headers in the upload request. The `method` property allows only `"POST"` or `"PUT"` values. The `headers` object can accept any standard or custom headers required by the server. Example: `{ url: "https://example.com/fileupload", method: "PUT", headers: { Authorization: "Bearer " + TOKEN, "X-Custom-Header": "value" } }` |
| `files`                  | Array<[File](#-file-structure)>  | An array of file and folder objects representing the current directory structure. Each object includes `name`, `isDirectory`, and `path` properties.  |
| `fontFamily`             | string | The font family to be used throughout the component. Accepts any valid CSS font family (e.g., `'Arial, sans-serif'`, `'Roboto'`). You can customize the font styling to match your application's theme. `default: 'Nunito Sans, sans-serif'`. |
| `formatDate`             | (date: string \| Date) => string | (Optional) A custom function used to format file and folder modification dates. If omitted, the component falls back to its built-in formatter from `utils/formatDate`. Useful for adapting the date display to different locales or formats.
| `height`                 | string \| number | The height of the component `default: 600px`. Can be a string (e.g., `'100%'`, `'10rem'`) or a number (in pixels). |
| `icons`                  | Map<string, { open:JSX.Element, closed:JSX.Element }>    |   (Optional) A map of custom icons that would be shown according to file class  |
| `initialPath`            | string | The path of the directory to be loaded initially e.g. `/Documents`. This should be the path of a folder which is included in `files` array. Default value is `""`  |
| `isLoading`              | boolean | A boolean state indicating whether the application is currently performing an operation, such as creating, renaming, or deleting a file/folder. Displays a loading state if set `true`. |
| `language` | string | A language code used for translations (e.g., `"en-US"`, `"fr-FR"`, `"tr-TR"`). Defaults to `"en-US"` for English. Allows the user to set the desired translation language manually. <br><br>**Available languages:** <br> 🇸🇦 `ar-SA` (Arabic, Saudi Arabia) <br> 🇩🇪 `de-DE` (German, Germany) <br> 🇺🇸 `en-US` (English, United States) <br> 🇪🇸 `es-ES` (Spanish, Spain) <br> 🇫🇷 `fr-FR` (French, France) <br> 🇮🇱 `he-IL` (Hebrew, Israel) <br> 🇮🇳 `hi-IN` (Hindi, India) <br> 🇮🇹 `it-IT` (Italian, Italy) <br> 🇯🇵 `ja-JP` (Japanese, Japan) <br> 🇰🇷 `ko-KR` (Korean, South Korea) <br> 🇧🇷 `pt-BR` (Portuguese, Brazil) <br> 🇵🇹 `pt-PT` (Portuguese, Portugal) <br> 🇷🇺 `ru-RU` (Russian, Russia) <br> 🇹🇷 `tr-TR` (Turkish, Turkey) <br> 🇺🇦 `uk-UA` (Ukrainian, Ukraine) <br> 🇵🇰 `ur-UR` (Urdu, Pakistan) <br> 🇻🇳 `vi-VN` (Vietnamese, Vietnam) <br> 🇨🇳 `zh-CN` (Chinese, Simplified) <br> 🇵🇱 `pl-PL` (Polish, Poland) |
| `layout` | "list" \| "grid"  | Specifies the default layout style for the file manager. Can be either "list" or "grid". Default value is "grid". |
| `maxFileSize`            | number | For limiting the maximum upload file size in bytes. |
| `onCopy`                 | (files: Array<[File](#-file-structure)>) => void | (Optional) A callback function triggered when one or more files or folders are copied providing copied files as an argument. Use this function to perform custom actions on copy event. |
| `onCut`                  | (files: Array<[File](#-file-structure)>) => void | (Optional) A callback function triggered when one or more files or folders are cut, providing the cut files as an argument. Use this function to perform custom actions on the cut event |
| `onCreateFolder`         | (name: string, parentFolder: [File](#-file-structure)) => void | A callback function triggered when a new folder is created. Use this function to update the files state to include the new folder under the specified parent folder using create folder API call to your server. |
| `onDelete`               | (files: Array<[File](#-file-structure)>) => void | A callback function is triggered when one or more files or folders are deleted. |
| `onDownload`             | (files: Array<[File](#-file-structure)>) => void | A callback function triggered when one or more files or folders are downloaded. |
| `onError` | (error: { type: string, message: string }, file: [File](#-file-structure)) => void | A callback function triggered whenever there is an error in the file manager. Where error is an object containing `type` ("upload", etc.) and a descriptive error `message`. |
| `onFileOpen`             | (file: [File](#-file-structure)) => void | A callback function triggered when a file or folder is opened. |
| `onFolderChange`         | (path: string) => void | A callback function triggered when the active folder changes. Receives the full path of the current folder as a string parameter. Useful for tracking the active folder path. |
| `onFileUploaded`         | (response: { [key: string]: any }) => void | A callback function triggered after a file is successfully uploaded. Provides JSON `response` holding uploaded file details, use it to extract the uploaded file details and add it to the `files` state e.g. `setFiles((prev) => [...prev, JSON.parse(response)]);` |
| `onFileUploading`        | (file: [File](#-file-structure), parentFolder: [File](#-file-structure)) => { [key: string]: any } | A callback function triggered during the file upload process. You can also return an object with key-value pairs that will be appended to the `FormData` along with the file being uploaded. The object can contain any number of valid properties. |
| `onLayoutChange`         | (layout: "list" \| "grid") => void | A callback function triggered when the layout of the file manager is changed. |
| `onPaste`                | (files: Array<[File](#-file-structure)>, destinationFolder: [File](#-file-structure), operationType: "copy" \| "move") => void  | A callback function triggered when when one or more files or folders are pasted into a new location. Depending on `operationType`, use this to either copy or move the `sourceItem` to the `destinationFolder`, updating the files state accordingly. |
| `onRefresh`              | () => void | A callback function triggered when the file manager is refreshed. Use this to refresh the `files` state to reflect any changes or updates. |
| `onRename`               | (file: [File](#-file-structure), newName: string) => void | A callback function triggered when a file or folder is renamed. |
| `onSelectionChange`      | (files: Array<[File](#-file-structure)>) => void | (Optional) A callback triggered whenever a file or folder is **selected or deselected**. The function receives the updated array of selected files or folders, allowing you to handle selection-related actions such as displaying file details, enabling toolbar actions, or updating the UI. |
| `onSelect`⚠️(deprecated) | (files: Array<[File](#-file-structure)>) => void | (Optional) Legacy callback triggered only when a file or folder is **selected**. This prop is deprecated and will be removed in the next major release. Please migrate to `onSelectionChange`. |
| `permissions`            | { create?: boolean; upload?: boolean; move?: boolean; copy?: boolean; rename?: boolean; download?: boolean; delete?: boolean; } | An object that controls the availability of specific file management actions. Setting an action to `false` hides it from the toolbar, context menu, and any relevant UI. All actions default to `true` if not specified. This is useful for implementing role-based access control or restricting certain operations. Example: `{ create: false, delete: false }` disables folder creation and file deletion.                                                                                                                   |
| `primaryColor`           | string | The primary color for the component's theme. Accepts any valid CSS color format (e.g., `'blue'`, `'#E97451'`, `'rgb(52, 152, 219)'`). This color will be applied to buttons, highlights, and other key elements. `default: #6155b4`. |
| `style`                  | object | Inline styles applied to the FileManager root element. |
| `width`                  | string \| number | The width of the component `default: 100%`. Can be a string (e.g., `'100%'`, `'10rem'`) or a number (in pixels). |


## ⌨️ Keyboard Shortcuts

| **Action**                     | **Shortcut**       |
| ------------------------------ | ------------------ |
| New Folder                     | `Alt + Shift + N`  |
| Upload Files                   | `CTRL + U`         |
| Cut                            | `CTRL + X`         |
| Copy                           | `CTRL + C`         |
| Paste                          | `CTRL + V`         |
| Rename                         | `F2`               |
| Download                       | `CTRL + D`         |
| Delete                         | `DEL`              |
| Select All Files               | `CTRL + A`         |
| Select Multiple Files          | `CTRL + Click`     |
| Select Range of Files          | `Shift + Click`    |
| Switch to List Layout          | `CTRL + Shift + 1` |
| Switch to Grid Layout          | `CTRL + Shift + 2` |
| Jump to First File in the List | `Home`             |
| Jump to Last File in the List  | `End`              |
| Refresh File List              | `F5`               |
| Clear Selection                | `Esc`              |


## 🛡️ Permissions

Control file management actions using the `permissions` prop (optional). Actions default to `true`
if not specified.

```jsx
<FileManager
  // Other props...
  permissions={{
    create: false, // Disable "Create Folder"
    delete: false, // Disable "Delete"
    download: true, // Enable "Download"
    copy: true,
    move: true,
    rename: true,
    upload: true,
  }}
/>
```

## </> Custom File Preview

The `FileManager` component allows you to provide a custom file preview by passing the
`filePreviewComponent` prop. This is an optional callback function that receives the selected file
as an argument and must return a valid React node, JSX element, or HTML.


### Usage Example

```jsx
const CustomImagePreviewer = ({ file }) => {
  return <img src={`${file.path}`} alt={file.name} />;
};

<FileManager
  // Other props...
  filePreviewComponent={(file) => <CustomImagePreviewer file={file} />}
/>;
```

## 🧭 Handling Current Path

By default, the file manager starts in the root directory (`""`). You can override this by passing
an `initialPath` prop. For example, to start in `/Documents`:

```jsx
<FileManager initialPath="/Documents" />
```

### Controlled usage with `currentPath`

If you want to **track and control** the current folder, you can pair `initialPath` with the
`onFolderChange` callback. A common pattern is to keep the path in React state:

```jsx
import { useState } from "react";

function App() {
  const [currentPath, setCurrentPath] = useState("/Documents");

  return (
    <FileManager
      // other props...
      initialPath={currentPath}
      onFolderChange={setCurrentPath}
    />
  );
}
```

### Important notes

- `initialPath` is applied **only once** when the `files` state is first set.
- After that, folder changes are driven by `onFolderChange`.
- If you want to keep the path in sync with user navigation, use a controlled state (as shown
  above).
