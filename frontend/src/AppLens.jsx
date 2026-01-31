import { useRef, useState } from "react";
import { createFolderAPI } from "./api/createFolderAPI";
import { deleteAPI } from "./api/deleteAPI";
import { downloadFile } from "./api/downloadFileAPI";
import { copyItemAPI, moveItemAPI } from "./api/fileTransferAPI";
import { getAllFilesAPI } from "./api/getAllFilesAPI";
import { renameAPI } from "./api/renameAPI";
import "./AppLens.scss";
import FileManager from "./FileManager/FileManager";

function App() {
    const fileUploadConfig = {
        url: import.meta.env.VITE_API_BASE_URL + "/upload",
    }

    const fileDownloadConfig = {
        //url: "https://getsamplefiles.com",
        //url: 'https://raw.githubusercontent.com/jfvilas/plugin-kwirth-log/refs/heads/master',
        //url: 'https://raw.githubusercontent.com/aa/tensorflow/refs/heads/master',
        url:'https://raw.githubusercontent.com/jfvilas/plugin-kwirth-log/refs/heads/master',
        headers : {
        //Authorization: 'Bearer xxx',
        //'X-Julio': 'Fernandez'
        }

    }

    const [isLoading, setIsLoading] = useState(false);
    const [currentPath, setCurrentPath] = useState("");
    const isMountRef = useRef(false);

    const onCategoryValuesChange = (categoryKey, categoryValue, selected) => {
        let cat = categories.find(c => c.key===categoryKey)

        if (categoryValue==='all') selected=['all']
        else if (categoryValue!=='all' && selected.length===2 && selected.includes('all')) selected=selected.filter(f => f!=='all')
        else if (selected.length===0) selected=['all']

        cat.selected = selected
        setCategories ([ ...categories ])
    }
    
    const onCategoryFilter = (categoryKey, f) => {
        let cat = categories.find(c => c.key===categoryKey)
        let valid = cat.selected.includes('all') || cat.selected.some(cat => f.name.includes(cat))
        return valid
    }

    const isFilterActive = (categoryKey) => {
        let cat = categories.find(c => c.key===categoryKey)
        return !(cat.selected.length===1 && cat.selected[0]==='all')
    }

    const [ categories, setCategories ] = useState([
        {
            key:'namespace',
            text: 'Namespaces',
            all: [ {key:'all',text:'All...'}, {key:'-'}, {key:'default'}, {key:'kube-system'}, {key:'kube-public'}, {key:'u', text:'u'}, {key:'login', text:'Login'} ],
            selected: ['all'],
            onCategoryValuesChange: onCategoryValuesChange,
            onCategoryFilter: onCategoryFilter,
            isFilterActive: isFilterActive
        },
        {
            key:'controller',
            text: 'Controller',
            all: [ {key:'all',text:'All...'}, {key:'replicaset'}, {key:'daemonset'}, {key:'replicationcontroller'}, {key:'statefulset'}, {key:'deployment'} ],
            selected: ['all'],
            onCategoryValuesChange: onCategoryValuesChange,
            onCategoryFilter: onCategoryFilter,
            isFilterActive: isFilterActive
        }
    ])

    const showPodContainers = (f) => {
        if (!f) return <></>
        console.log(f)
        return <img 
            src={f.endsWith('2')>'m' ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEgAGX0sCgqAAAAABJRU5ErkJggg==" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/DwAEgAGt+MvY7AAAAABJRU5ErkJggg=="}
            width="10" 
            height="10" 
            alt="Cuadrado azul de 10x10 px"
        />
    }

    const showPodCpu = (f) => {
        return <>2.3</>
    }
    
    const showPodMemory = (f) => {
        return <>128M</>
    }
    
    const showPodRestarts = (f) => {
        return <>5</>
    }
    
    const showOverview = () => {
        return <>
            <div style={{display:'flex', flexDirection:'column'}}>
            <span>Cluster Overview {new Date().toISOString()}</span>
            <span>{showPodContainers()}</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            <span style={{marginTop:'20px', marginBottom:'20px'}}>sdfsfsdf</span>
            </div>
        </>
    }
    
    const showWorkloadOverview = () => {
        return <>
            Workload Overview {new Date().toISOString()}
        </>
    }

    // layout: list, grid, own
let menu = [
    {
        name: "Overview",
        isDirectory: true,
        path: "/overview",
        class: 'classmenu',
        layout: 'own',   
        children: showOverview
    },
    {
        name: "Network",
        isDirectory: true,
        path: "/network",
        class: 'classmenu'
    },
    {
        name: "Service",
        isDirectory: true,
        path: "/network/service",
        layout: 'list',  
        class: 'classservice',
        categories: [ 'namespace' ],
        features: [ ],
        children: 'service'
    },
    {
        name: "Ingress",
        isDirectory: true,
        path: "/network/ingress",
        layout: 'list',  
        class: 'classingress',
        children: 'ingress'
    },
    {
        name: "Workload",
        isDirectory: true,
        path: "/workload",
        class: 'classmenu'
    },
    {   name: 'Overview',
        isDirectory: true,
        path: '/workload/overview',
        class: 'classworkloadoverview',
        layout: 'own',
    },
    {
        name: "Pod",
        isDirectory: true,
        path: "/workload/pod",
        layout: 'list',  
        categories: [ 'namespace', 'controller' ],
        features: [ 'search'],
        class: 'classmenu',
        children: 'pod'
    },
    {
        name: "Deployment",
        isDirectory: true,
        path: "/workload/deployment",
        class: 'classmenu',
        children: 'deployment'
    },
    {
        name: "Config",
        isDirectory: true,
        path: "/config",
        class: 'classmenu'
    },
]

let sampleFiles = [
        {
            name: "users-svc",
            isDirectory: false,
            path: "/network/service/users-svc",
            class: 'service',
            data: {
            },
        },
        {
            name: "login-svc",
            isDirectory: false,
            path: "/network/service/login-svc",
            class: 'service'
        },
        {
            name: "customer-svc",
            isDirectory: false,
            path: "/network/service/customer-svc",
            class: 'service'
        },
        {
            name: "eulen-ingress",
            path: "/network/ingress/eulen-ingress",
            class: 'ingress'
        },
        {
            name: "superset-ingress",
            path: "/network/ingress/superset-ingress",
            class: 'ingress'
        },
        {
            name: "kwirth-23s4r5t34a-e2r42",
            path: "/workload/pod/kwirth-23s4r5t34a-e2r42",
            data: {
                namespace: 'psd-nextbpm',
                controller: 'kwirth',
                node: 'b8asv2-vmss0000a',
                startTime: "2024-09-09T10:30:00Z"
            },
            class: 'pod',
        },
        {
            name: "kwirth-23s4r5t34a-e2r42",
            path: "/workload/pod/kwirth-23s4r5t34a-e2r42",
            data: {
                namespace: 'psd-nextbpm',
                controller: 'kwirth',
                node: 'b8asv2-vmss0000a',
                startTime: "2024-09-09T10:30:00Z"
            },
            class: 'pod',
        },
        {
            name: "kwirth-23s4r5t34a-e2r42",
            path: "/workload/pod/kwirth-23s4r5t34a-e2r42",
            data: {
                namespace: 'psd-nextbpm',
                controller: 'kwirth',
                node: 'b8asv2-vmss0000a',
                startTime: "2024-09-09T10:30:00Z"
            },
            class: 'pod',
        },
        {
            name: "kwirth-23s4r5t34a-e2r42",
            path: "/workload/pod/kwirth-23s4r5t34a-e2r42",
            data: {
                namespace: 'psd-nextbpm',
                controller: 'kwirth',
                node: 'b8asv2-vmss0000a',
                startTime: "2024-09-09T10:30:00Z"
            },
            class: 'pod',
        },
        {
            name: "kwirth-23s4r5t34a-e2r42",
            path: "/workload/pod/kwirth-23s4r5t34a-e2r42",
            data: {
                namespace: 'psd-nextbpm',
                controller: 'kwirth',
                node: 'b8asv2-vmss0000a',
                startTime: "2024-09-09T10:30:00Z"
            },
            class: 'pod',
        },
        {
            name: "kwirth-23s4r5t34a-e2r42",
            path: "/workload/pod/kwirth-23s4r5t34a-e2r42",
            data: {
                namespace: 'psd-nextbpm',
                controller: 'kwirth',
                node: 'b8asv2-vmss0000a',
                startTime: "2024-09-09T10:30:00Z"
            },
            class: 'pod',
        },
        {
            name: "obk-authorizator-236543334a-eieu2",
            path: "/workload/pod/obk-authorizator-236543334a-eieu2",
            data: {
                namespace: 'psd-flowable',
                controller: 'authorizator',
                node: 'b8asv2-vmss0000b',
                startTime: "2025-12-02T10:30:00Z",
            },
            class: 'pod',
        },
        {
            name: "kwirth-23s4r5t34a-e2r42",
            path: "/workload/pod/kwirth-23s4r5t34a-e2r42",
            data: {
                namespace: 'psd-nextbpm',
                controller: 'kwirth',
                node: 'b8asv2-vmss0000a',
                startTime: "2024-09-09T10:30:00Z"
            },
            class: 'pod',
        },
        {
            name: "obk-authorizator-236543334a-eieu2",
            path: "/workload/pod/obk-authorizator-236543334a-eieu2",
            data: {
                namespace: 'psd-flowable',
                controller: 'authorizator',
                node: 'b8asv2-vmss0000b',
                startTime: "2025-12-02T10:30:00Z",
            },
            class: 'pod',
        },
        {
            name: "kwirth-23s4r5t34a-e2r42",
            path: "/workload/pod/kwirth-23s4r5t34a-e2r42",
            data: {
                namespace: 'psd-nextbpm',
                controller: 'kwirth',
                node: 'b8asv2-vmss0000a',
                startTime: "2024-09-09T10:30:00Z"
            },
            class: 'pod',
        },
        {
            name: "obk-authorizator-236543334a-eieu2",
            path: "/workload/pod/obk-authorizator-236543334a-eieu2",
            data: {
                namespace: 'psd-flowable',
                controller: 'authorizator',
                node: 'b8asv2-vmss0000b',
                startTime: "2025-12-02T10:30:00Z",
            },
            class: 'pod',
        },
        {
            name: "kwirth-23s4r5t34a-e2r42",
            path: "/workload/pod/kwirth-23s4r5t34a-e2r42",
            data: {
                namespace: 'psd-nextbpm',
                controller: 'kwirth',
                node: 'b8asv2-vmss0000a',
                startTime: "2024-09-09T10:30:00Z"
            },
            class: 'pod',
        },
        {
            name: "obk-authorizator-236543334a-eieu2",
            path: "/workload/pod/obk-authorizator-236543334a-eieu2",
            data: {
                namespace: 'psd-flowable',
                controller: 'authorizator',
                node: 'b8asv2-vmss0000b',
                startTime: "2025-12-02T10:30:00Z",
            },
            class: 'pod',
        },
        {
            name: "kwirth-23s4r5t34a-e2r42",
            path: "/workload/pod/kwirth-23s4r5t34a-e2r42",
            data: {
                namespace: 'psd-nextbpm',
                controller: 'kwirth',
                node: 'b8asv2-vmss0000a',
                startTime: "2024-09-09T10:30:00Z"
            },
            class: 'pod',
        },
        {
            name: "obk-authorizator-236543334a-eieu2",
            path: "/workload/pod/obk-authorizator-236543334a-eieu2",
            data: {
                namespace: 'psd-flowable',
                controller: 'authorizator',
                node: 'b8asv2-vmss0000b',
                startTime: "2025-12-02T10:30:00Z",
            },
            class: 'pod',
        },
        {
            name: "kwirth-23s4r5t34a-e2r42",
            path: "/workload/pod/kwirth-23s4r5t34a-e2r42",
            data: {
                namespace: 'psd-nextbpm',
                controller: 'kwirth',
                node: 'b8asv2-vmss0000a',
                startTime: "2024-09-09T10:30:00Z"
            },
            class: 'pod',
        },
        {
            name: "obk-authorizator-236543334a-eieu2",
            path: "/workload/pod/obk-authorizator-236543334a-eieu2",
            data: {
                namespace: 'psd-flowable',
                controller: 'authorizator',
                node: 'b8asv2-vmss0000b',
                startTime: "2025-12-02T10:30:00Z",
            },
            class: 'pod',
        },
    ]

    const [files, setFiles] = useState([...menu,...sampleFiles])

    let permissions = {
      create: true,
      upload: false,
      move: true,
      copy:  true,
      rename:  false,
      download:  false,
      delete: true
    }

    let serviceStatus = (file) => {
        if (file.length % 3 === 0 ) return <span style={{color:'green'}}>Active</span>
        return <div style={{flexDirection:'column'}}>
            <span style={{color:'red'}}>Inactive</span><br/>
            <span style={{color:'red'}}>Inactive</span><br/>
            <span style={{color:'red'}}>Inactive</span><br/>
            <span style={{color:'red'}}>Inactive</span><br/>
        </div>
    }

    // format: string, number, age, function

    let spaces=new Map()
    spaces.set('ingress',
        {
            text:'Name',
            source:'name',
            width:40,
            sumSourceProperty: 'size',
            sumReducer: 1024,
            sumUnits: ['bytes', 'KB', 'MB'],
            icons: new Map(),
            actions: new Map(),
            properties: [
                {
                    name: 'namespace',
                    text: 'Namespace',
                    source: 'namespace',
                    format: 'string',
                    width: 15,
                    visible: true
                },
                {
                    name: 'loadbalancers',
                    text: 'LoadBalancers',
                    source: 'loadbalancers',
                    format: 'string',
                    width: 15,
                    visible: true
                },
                {
                    name: 'rules',
                    text: 'Rules',
                    source: 'rules',
                    format: 'string',
                    width: 15,
                    visible: true
                },
                {
                    name: 'age',
                    text: 'Age',
                    source: 'age',
                    format: 'age',
                    width: 15,
                    visible: true
                },
            ],
            emptySelectionContextMenu: undefined,
            selectionContextMenu: undefined
        }
    )

    spaces.set('classmenu',
        {
            leftItems: [],
            properties: [],
        }
    )

    spaces.set('classservice',
        {
            leftItems: [
                {
                    icon: <>+</>,
                    text: 'New service',
                    permission: permissions.create,
                    onClick: () => console.log('create ingress'),
                }
            ],
        }
    )

    spaces.set('classingress',
        {
            leftItems: [
                {
                    icon: <>+</>,
                    text: 'New ingress',
                    permission: permissions.create,
                    onClick: () => console.log('create ingress'),
                }
            ],
        }
    )

    spaces.set('service',
        {
            text:'Service name',
            source:'name',
            width: 40,
            icons: new Map(),
            actions: new Map(),
            leftItems: [
                {
                    icon: <>{'R'}</>,
                    text: 'Remove service',
                    multi: true,
                    permission: permissions.delete,
                    onClick: (a,b) => console.log('remove ingress',a,b),
                },
                {
                    icon: <>{'E'}</>,
                    text: 'Edit service',
                    permission: permissions.delete,
                    onClick: () => console.log('edit ingress'),
                }
            ],
            properties: [
                {
                    name: 'namespace',
                    text: 'Namespace',
                    source: 'namespace',
                    format: 'string',
                    width: 15,
                    visible: true
                },
                {
                    name: 'status',
                    text: 'Status',
                    source: serviceStatus,
                    format: 'function',
                    width: 10,
                    visible: true
                },
                {
                    name: 'ports',
                    text: 'Ports',
                    source: 'ports',
                    format: 'string',
                    width: 15,
                    visible: true
                },
                {
                    name: 'externalip',
                    text: 'ExternalIP',
                    source: 'externalip',
                    format: 'string',
                    width: 10,
                    visible: true
                },
                {
                    name: 'selector',
                    text: 'Selector',
                    source: 'selector',
                    format: 'string',
                    width: 10,
                    visible: true
                },
            ],
            emptySelectionContextMenu: undefined,
            selectionContextMenu: undefined
        }
    )

    spaces.set('pod',
        {
            text:'Name',
            source:'name',
            width:25,
            icons: new Map(),
            actions: new Map(),
            leftItems: [
                {
                    icon: <>{'D'}</>,
                    text: 'Pod details',
                    permission: permissions.delete,
                    onClick: () => console.log('poddd'),
                },
                {
                    icon: <>{'S'}</>,
                    text: 'Shell',
                    onClick: (a,b,c) => {
                        console.log(a)
                        console.log(b)
                        console.log(c)
                    }
                },
                {
                    icon: <>{'L'}</>,
                    multi: true,
                    text: 'Log',
                    onClick: (x) => console.log('launch tab ---->',x),
                },
                {
                    icon: <>{'M'}</>,
                    text: 'Metrics',
                    multi: true,
                    onClick: () => console.log('metrics'),
                },
                {
                    text: '~',
                },
                {
                    icon: <>{'R'}</>,
                    text: 'Remove pod',
                    multi: true,
                    permission: permissions.delete,
                    onClick: () => console.log('remove pod'),
                },
                {
                    icon: <>{'E'}</>,
                    text: 'Evict',
                    onClick: () => console.log('evit'),
                }
            ],
            properties: [
                {
                    name: 'namespace',
                    text: 'Namespace',
                    source: 'namespace',
                    format: 'string',
                    width: 10,
                    visible: true
                },
                {
                    name: 'container',
                    text: 'Container',
                    source: showPodContainers,
                    format: 'function',
                    width: 10,
                    visible: true
                },
                {
                    name: 'cpu',
                    text: 'CPU',
                    source: showPodCpu,
                    format: 'function',
                    width: 10,
                    visible: true
                },
                {
                    name: 'memory',
                    text: 'Memory',
                    source: showPodMemory,
                    format: 'function',
                    width: 10,
                    visible: true
                },
                {
                    name: 'restarts',
                    text: 'Restarts',
                    source: showPodRestarts,
                    format: 'function',
                    width: 5,
                    visible: true
                },
                {
                    name: 'Contrller',
                    text: 'Controller',
                    source: 'controller',
                    format: 'string',
                    width: 10,
                    visible: true
                },
                {
                    name: 'node',
                    text: 'Node',
                    source: 'node',
                    format: 'string',
                    width: 10,
                    visible: true
                },
                {
                    name: 'age',
                    text: 'Age',
                    source: 'startTime',
                    format: 'age',
                    width: 5,
                    visible: true
                },
                {
                    name: 'status',
                    text: 'Status',
                    source: 'status',
                    format: 'string',
                    width: 5,
                    visible: true
                }
            ],
            emptySelectionContextMenu: undefined,
            selectionContextMenu: undefined
        }
    )

    spaces.set('classworkloadoverview', 
    {
        leftItems: [
            {
                name:'search',
                icon: <>ICON</>,
                text: 'Search',
                permission: true
            }
        ]
    }    
)


    // Get Files
    const getFiles = async () => {
        setIsLoading(true);
        const response = await getAllFilesAPI();
        if (response.status === 200 && response.data) {
        setFiles(response.data);
        } else {
        console.error(response);
        setFiles([]);
        }
        setIsLoading(false);
    };

    // Create Folder
    const handleCreateFolder = async (name, parentFolder) => {
        setIsLoading(true)
        const response = await createFolderAPI(name, parentFolder?._id)
        if (response.status === 200 || response.status === 201) {
            setFiles((prev) => [...prev, response.data])
        } else {
            console.error(response)
        }
        setIsLoading(false)
    }

    // File Upload Handlers
    const handleFileUploading = (file, parentFolder) => {
        return { parentId: parentFolder?._id }
    }

    const handleFileUploaded = (response) => {
        const uploadedFile = JSON.parse(response)
        setFiles((prev) => [...prev, uploadedFile])
    }

    // Rename File/Folder
    const handleRename = async (file, newName) => {
        setIsLoading(true)
        const response = await renameAPI(file._id, newName)
        if (response.status === 200) {
            getFiles()
        }
        else {
            console.error(response)
        }
        setIsLoading(false)
    }

    // Delete File/Folder
    const handleDelete = async (files) => {
        setIsLoading(true)
        const idsToDelete = files.map((file) => file._id)
        const response = await deleteAPI(idsToDelete)
        if (response.status === 200) {
        getFiles()
        } else {
        console.error(response)
        setIsLoading(false)
        }
    }

    // Paste File/Folder
    const handlePaste = async (copiedItems, destinationFolder, operationType) => {
        setIsLoading(true)
        const copiedItemIds = copiedItems.map((item) => item._id)
        if (operationType === "copy") {
            const response = await copyItemAPI(copiedItemIds, destinationFolder?._id)
        }
        else {
            const response = await moveItemAPI(copiedItemIds, destinationFolder?._id)
        }
        await getFiles();
    }

    const handleLayoutChange = (layout) => {
    }

    // Refresh Files
    const handleRefresh = () => {
        getFiles()
    }

    const handleFileOpen = (file) => {
        console.log(`Opening file: ${file.name}`)
    }

    const handleError = (error, file) => {
        console.error(error)
    }

    const handleDownload = async (files) => {
        await downloadFile(files)
    }

    const handleCut = (files) => {
        console.log("Moving Files", files)
    }

    const handleCopy = (files) => {
        console.log("Copied Files", files)
    }

    const handleSelectionChange = (files) => {
        console.log("Selected Files", files)
    }

    let icons = new Map()
    const actions = new Map()

    const launchClusterSearch = (a,b,c) => {
        console.log('cs',a,b,c)
    }
    
    const setLeftItem = (space, name, invoke) => {
        let x = space.leftItems?.find(f => f.name===name)
        if (x) x.onClick = invoke
    }

    let spcClassWorkloadOverview = spaces.get('classworkloadoverview')
    setLeftItem(spcClassWorkloadOverview,'search', launchClusterSearch)

    return (
        <div className="app">
            <div className="file-manager-container">
                <FileManager
                    actions={actions}
                    files={files}
                    spaces={spaces}
                    fileUploadConfig={fileUploadConfig}
                    fileDownloadConfig={fileDownloadConfig}
                    icons={icons}
                    isLoading={isLoading}
                    onCreateFolder={handleCreateFolder}
                    onFileUploading={handleFileUploading}
                    onFileUploaded={handleFileUploaded}
                    onCut={handleCut}
                    onCopy={handleCopy}
                    onPaste={handlePaste}
                    onRename={handleRename}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    onLayoutChange={handleLayoutChange}
                    onRefresh={handleRefresh}
                    onFileOpen={handleFileOpen}
                    onSelectionChange={handleSelectionChange}
                    onError={handleError}
                    layout="grid"
                    enableFilePreview={true}
                    maxFileSize={10485760}
                    filePreviewPath={'https://getsamplefiles.com'}
                    acceptedFileTypes={["txt", "png", "jpg", "jpeg", "pdf", "doc", "docx", "exe"]}
                    height="100%"
                    width="100%"
                    initialPath={'/overview'}
                    permissions={permissions}
                    onFolderChange={setCurrentPath}
                    search='auto'
                    searchRegex={true}
                    searchCasing={true}
                    showRefresh={false}
                    showContextMenu={false}
                    categories={categories}
                />
            </div>
        </div>
    )
}

export default App
