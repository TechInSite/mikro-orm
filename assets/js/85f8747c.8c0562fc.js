(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[2734],{3905:function(e,t,n){"use strict";n.d(t,{Zo:function(){return m},kt:function(){return k}});var r=n(67294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var p=r.createContext({}),d=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},m=function(e){var t=d(e.components);return r.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,l=e.originalType,p=e.parentName,m=o(e,["components","mdxType","originalType","parentName"]),s=d(n),k=i,c=s["".concat(p,".").concat(k)]||s[k]||u[k]||l;return n?r.createElement(c,a(a({ref:t},m),{},{components:n})):r.createElement(c,a({ref:t},m))}));function k(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var l=n.length,a=new Array(l);a[0]=s;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o.mdxType="string"==typeof e?e:i,a[1]=o;for(var d=2;d<l;d++)a[d]=n[d];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},73079:function(e,t,n){"use strict";n.r(t),n.d(t,{frontMatter:function(){return a},metadata:function(){return o},toc:function(){return p},default:function(){return m}});var r=n(74034),i=n(79973),l=(n(67294),n(3905)),a={id:"knex.knex-1.poolconfig",title:"Interface: PoolConfig",sidebar_label:"PoolConfig",custom_edit_url:null,hide_title:!0},o={unversionedId:"api/interfaces/knex.knex-1.poolconfig",id:"version-4.5/api/interfaces/knex.knex-1.poolconfig",isDocsHomePage:!1,title:"Interface: PoolConfig",description:"knex.Knex.PoolConfig",source:"@site/versioned_docs/version-4.5/api/interfaces/knex.knex-1.poolconfig.md",sourceDirName:"api/interfaces",slug:"/api/interfaces/knex.knex-1.poolconfig",permalink:"/docs/api/interfaces/knex.knex-1.poolconfig",editUrl:null,version:"4.5",lastUpdatedBy:"Renovate Bot",lastUpdatedAt:1624059800,formattedLastUpdatedAt:"6/18/2021",sidebar_label:"PoolConfig",frontMatter:{id:"knex.knex-1.poolconfig",title:"Interface: PoolConfig",sidebar_label:"PoolConfig",custom_edit_url:null,hide_title:!0},sidebar:"version-4.5/API",previous:{title:"Interface: PgConnectionConfig",permalink:"/docs/api/interfaces/knex.knex-1.pgconnectionconfig"},next:{title:"Interface: PostgreSqlColumnBuilder",permalink:"/docs/api/interfaces/knex.knex-1.postgresqlcolumnbuilder"}},p=[{value:"Properties",id:"properties",children:[{value:"acquireTimeoutMillis",id:"acquiretimeoutmillis",children:[]},{value:"afterCreate",id:"aftercreate",children:[]},{value:"createRetryIntervalMillis",id:"createretryintervalmillis",children:[]},{value:"createTimeoutMillis",id:"createtimeoutmillis",children:[]},{value:"destroyTimeoutMillis",id:"destroytimeoutmillis",children:[]},{value:"idleTimeoutMillis",id:"idletimeoutmillis",children:[]},{value:"log",id:"log",children:[]},{value:"max",id:"max",children:[]},{value:"min",id:"min",children:[]},{value:"name",id:"name",children:[]},{value:"priorityRange",id:"priorityrange",children:[]},{value:"propagateCreateError",id:"propagatecreateerror",children:[]},{value:"reapIntervalMillis",id:"reapintervalmillis",children:[]},{value:"refreshIdle",id:"refreshidle",children:[]},{value:"returnToHead",id:"returntohead",children:[]}]}],d={toc:p};function m(e){var t=e.components,n=(0,i.Z)(e,["components"]);return(0,l.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/docs/api/modules/knex"},"knex"),".",(0,l.kt)("a",{parentName:"p",href:"/docs/api/modules/knex.knex-1"},"Knex"),".PoolConfig"),(0,l.kt)("h2",{id:"properties"},"Properties"),(0,l.kt)("h3",{id:"acquiretimeoutmillis"},"acquireTimeoutMillis"),(0,l.kt)("p",null,"\u2022 ",(0,l.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,l.kt)("strong",{parentName:"p"},"acquireTimeoutMillis"),": ",(0,l.kt)("em",{parentName:"p"},"number")),(0,l.kt)("p",null,"Defined in: node_modules/knex/types/index.d.ts:2095"),(0,l.kt)("hr",null),(0,l.kt)("h3",{id:"aftercreate"},"afterCreate"),(0,l.kt)("p",null,"\u2022 ",(0,l.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,l.kt)("strong",{parentName:"p"},"afterCreate"),": Function"),(0,l.kt)("p",null,"Defined in: node_modules/knex/types/index.d.ts:2080"),(0,l.kt)("hr",null),(0,l.kt)("h3",{id:"createretryintervalmillis"},"createRetryIntervalMillis"),(0,l.kt)("p",null,"\u2022 ",(0,l.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,l.kt)("strong",{parentName:"p"},"createRetryIntervalMillis"),": ",(0,l.kt)("em",{parentName:"p"},"number")),(0,l.kt)("p",null,"Defined in: node_modules/knex/types/index.d.ts:2092"),(0,l.kt)("hr",null),(0,l.kt)("h3",{id:"createtimeoutmillis"},"createTimeoutMillis"),(0,l.kt)("p",null,"\u2022 ",(0,l.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,l.kt)("strong",{parentName:"p"},"createTimeoutMillis"),": ",(0,l.kt)("em",{parentName:"p"},"number")),(0,l.kt)("p",null,"Defined in: node_modules/knex/types/index.d.ts:2093"),(0,l.kt)("hr",null),(0,l.kt)("h3",{id:"destroytimeoutmillis"},"destroyTimeoutMillis"),(0,l.kt)("p",null,"\u2022 ",(0,l.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,l.kt)("strong",{parentName:"p"},"destroyTimeoutMillis"),": ",(0,l.kt)("em",{parentName:"p"},"number")),(0,l.kt)("p",null,"Defined in: node_modules/knex/types/index.d.ts:2094"),(0,l.kt)("hr",null),(0,l.kt)("h3",{id:"idletimeoutmillis"},"idleTimeoutMillis"),(0,l.kt)("p",null,"\u2022 ",(0,l.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,l.kt)("strong",{parentName:"p"},"idleTimeoutMillis"),": ",(0,l.kt)("em",{parentName:"p"},"number")),(0,l.kt)("p",null,"Defined in: node_modules/knex/types/index.d.ts:2084"),(0,l.kt)("hr",null),(0,l.kt)("h3",{id:"log"},"log"),(0,l.kt)("p",null,"\u2022 ",(0,l.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,l.kt)("strong",{parentName:"p"},"log"),": (",(0,l.kt)("inlineCode",{parentName:"p"},"message"),": ",(0,l.kt)("em",{parentName:"p"},"string"),", ",(0,l.kt)("inlineCode",{parentName:"p"},"logLevel"),": ",(0,l.kt)("em",{parentName:"p"},"string"),") => ",(0,l.kt)("em",{parentName:"p"},"void")),(0,l.kt)("h4",{id:"type-declaration"},"Type declaration:"),(0,l.kt)("p",null,"\u25b8 (",(0,l.kt)("inlineCode",{parentName:"p"},"message"),": ",(0,l.kt)("em",{parentName:"p"},"string"),", ",(0,l.kt)("inlineCode",{parentName:"p"},"logLevel"),": ",(0,l.kt)("em",{parentName:"p"},"string"),"): ",(0,l.kt)("em",{parentName:"p"},"void")),(0,l.kt)("h4",{id:"parameters"},"Parameters:"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,l.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"left"},(0,l.kt)("inlineCode",{parentName:"td"},"message")),(0,l.kt)("td",{parentName:"tr",align:"left"},(0,l.kt)("em",{parentName:"td"},"string"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"left"},(0,l.kt)("inlineCode",{parentName:"td"},"logLevel")),(0,l.kt)("td",{parentName:"tr",align:"left"},(0,l.kt)("em",{parentName:"td"},"string"))))),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns:")," ",(0,l.kt)("em",{parentName:"p"},"void")),(0,l.kt)("p",null,"Defined in: node_modules/knex/types/index.d.ts:2088"),(0,l.kt)("p",null,"Defined in: node_modules/knex/types/index.d.ts:2088"),(0,l.kt)("hr",null),(0,l.kt)("h3",{id:"max"},"max"),(0,l.kt)("p",null,"\u2022 ",(0,l.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,l.kt)("strong",{parentName:"p"},"max"),": ",(0,l.kt)("em",{parentName:"p"},"number")),(0,l.kt)("p",null,"Defined in: node_modules/knex/types/index.d.ts:2082"),(0,l.kt)("hr",null),(0,l.kt)("h3",{id:"min"},"min"),(0,l.kt)("p",null,"\u2022 ",(0,l.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,l.kt)("strong",{parentName:"p"},"min"),": ",(0,l.kt)("em",{parentName:"p"},"number")),(0,l.kt)("p",null,"Defined in: node_modules/knex/types/index.d.ts:2081"),(0,l.kt)("hr",null),(0,l.kt)("h3",{id:"name"},"name"),(0,l.kt)("p",null,"\u2022 ",(0,l.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,l.kt)("strong",{parentName:"p"},"name"),": ",(0,l.kt)("em",{parentName:"p"},"string")),(0,l.kt)("p",null,"Defined in: node_modules/knex/types/index.d.ts:2079"),(0,l.kt)("hr",null),(0,l.kt)("h3",{id:"priorityrange"},"priorityRange"),(0,l.kt)("p",null,"\u2022 ",(0,l.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,l.kt)("strong",{parentName:"p"},"priorityRange"),": ",(0,l.kt)("em",{parentName:"p"},"number")),(0,l.kt)("p",null,"Defined in: node_modules/knex/types/index.d.ts:2087"),(0,l.kt)("hr",null),(0,l.kt)("h3",{id:"propagatecreateerror"},"propagateCreateError"),(0,l.kt)("p",null,"\u2022 ",(0,l.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,l.kt)("strong",{parentName:"p"},"propagateCreateError"),": ",(0,l.kt)("em",{parentName:"p"},"boolean")),(0,l.kt)("p",null,"Defined in: node_modules/knex/types/index.d.ts:2091"),(0,l.kt)("hr",null),(0,l.kt)("h3",{id:"reapintervalmillis"},"reapIntervalMillis"),(0,l.kt)("p",null,"\u2022 ",(0,l.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,l.kt)("strong",{parentName:"p"},"reapIntervalMillis"),": ",(0,l.kt)("em",{parentName:"p"},"number")),(0,l.kt)("p",null,"Defined in: node_modules/knex/types/index.d.ts:2085"),(0,l.kt)("hr",null),(0,l.kt)("h3",{id:"refreshidle"},"refreshIdle"),(0,l.kt)("p",null,"\u2022 ",(0,l.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,l.kt)("strong",{parentName:"p"},"refreshIdle"),": ",(0,l.kt)("em",{parentName:"p"},"boolean")),(0,l.kt)("p",null,"Defined in: node_modules/knex/types/index.d.ts:2083"),(0,l.kt)("hr",null),(0,l.kt)("h3",{id:"returntohead"},"returnToHead"),(0,l.kt)("p",null,"\u2022 ",(0,l.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,l.kt)("strong",{parentName:"p"},"returnToHead"),": ",(0,l.kt)("em",{parentName:"p"},"boolean")),(0,l.kt)("p",null,"Defined in: node_modules/knex/types/index.d.ts:2086"))}m.isMDXComponent=!0}}]);