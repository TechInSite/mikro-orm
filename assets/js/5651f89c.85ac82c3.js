(window.webpackJsonp=window.webpackJsonp||[]).push([[313],{1026:function(e,t,a){"use strict";a.d(t,"a",(function(){return m})),a.d(t,"b",(function(){return j}));var n=a(0),r=a.n(n);function c(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function b(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?b(Object(a),!0).forEach((function(t){c(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):b(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function p(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},c=Object.keys(e);for(n=0;n<c.length;n++)a=c[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)a=c[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var i=r.a.createContext({}),l=function(e){var t=r.a.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},m=function(e){var t=l(e.components);return r.a.createElement(i.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},O=r.a.forwardRef((function(e,t){var a=e.components,n=e.mdxType,c=e.originalType,b=e.parentName,i=p(e,["components","mdxType","originalType","parentName"]),m=l(a),O=n,j=m["".concat(b,".").concat(O)]||m[O]||s[O]||c;return a?r.a.createElement(j,o(o({ref:t},i),{},{components:a})):r.a.createElement(j,o({ref:t},i))}));function j(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var c=a.length,b=new Array(c);b[0]=O;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o.mdxType="string"==typeof e?e:n,b[1]=o;for(var i=2;i<c;i++)b[i]=a[i];return r.a.createElement.apply(null,b)}return r.a.createElement.apply(null,a)}O.displayName="MDXCreateElement"},385:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return b})),a.d(t,"metadata",(function(){return o})),a.d(t,"toc",(function(){return p})),a.d(t,"default",(function(){return l}));var n=a(3),r=a(8),c=(a(0),a(1026)),b={id:"core.connection",title:"Class: Connection",sidebar_label:"Connection",custom_edit_url:null,hide_title:!0},o={unversionedId:"api/classes/core.connection",id:"api/classes/core.connection",isDocsHomePage:!1,title:"Class: Connection",description:"Class: Connection",source:"@site/docs/api/classes/core.connection.md",slug:"/api/classes/core.connection",permalink:"/docs/next/api/classes/core.connection",editUrl:null,version:"current",sidebar_label:"Connection",sidebar:"API",previous:{title:"Class: Configuration<D>",permalink:"/docs/next/api/classes/core.configuration"},next:{title:"Class: ConnectionException",permalink:"/docs/next/api/classes/core.connectionexception"}},p=[{value:"Hierarchy",id:"hierarchy",children:[]},{value:"Constructors",id:"constructors",children:[{value:"constructor",id:"constructor",children:[]}]},{value:"Methods",id:"methods",children:[{value:"begin",id:"begin",children:[]},{value:"close",id:"close",children:[]},{value:"commit",id:"commit",children:[]},{value:"connect",id:"connect",children:[]},{value:"execute",id:"execute",children:[]},{value:"getClientUrl",id:"getclienturl",children:[]},{value:"getConnectionOptions",id:"getconnectionoptions",children:[]},{value:"getDefaultClientUrl",id:"getdefaultclienturl",children:[]},{value:"getPlatform",id:"getplatform",children:[]},{value:"isConnected",id:"isconnected",children:[]},{value:"rollback",id:"rollback",children:[]},{value:"setMetadata",id:"setmetadata",children:[]},{value:"setPlatform",id:"setplatform",children:[]},{value:"transactional",id:"transactional",children:[]}]}],i={toc:p};function l(e){var t=e.components,a=Object(r.a)(e,["components"]);return Object(c.b)("wrapper",Object(n.a)({},i,a,{components:t,mdxType:"MDXLayout"}),Object(c.b)("h1",{id:"class-connection"},"Class: Connection"),Object(c.b)("p",null,Object(c.b)("a",{parentName:"p",href:"/docs/next/api/modules/core"},"core"),".Connection"),Object(c.b)("h2",{id:"hierarchy"},"Hierarchy"),Object(c.b)("ul",null,Object(c.b)("li",{parentName:"ul"},Object(c.b)("p",{parentName:"li"},Object(c.b)("strong",{parentName:"p"},"Connection")),Object(c.b)("p",{parentName:"li"},"\u21b3 ",Object(c.b)("a",{parentName:"p",href:"/docs/next/api/classes/knex.abstractsqlconnection"},Object(c.b)("em",{parentName:"a"},"AbstractSqlConnection"))))),Object(c.b)("h2",{id:"constructors"},"Constructors"),Object(c.b)("h3",{id:"constructor"},"constructor"),Object(c.b)("p",null,"+"," ",Object(c.b)("strong",{parentName:"p"},"new Connection"),"(",Object(c.b)("inlineCode",{parentName:"p"},"config"),": ",Object(c.b)("a",{parentName:"p",href:"/docs/next/api/classes/core.configuration"},Object(c.b)("em",{parentName:"a"},"Configuration")),"<",Object(c.b)("a",{parentName:"p",href:"/docs/next/api/interfaces/core.idatabasedriver"},Object(c.b)("em",{parentName:"a"},"IDatabaseDriver")),"<",Object(c.b)("a",{parentName:"p",href:"/docs/next/api/classes/core.connection"},Object(c.b)("em",{parentName:"a"},"Connection")),">",">",", ",Object(c.b)("inlineCode",{parentName:"p"},"options?"),": ",Object(c.b)("a",{parentName:"p",href:"/docs/next/api/interfaces/core.connectionoptions"},Object(c.b)("em",{parentName:"a"},"ConnectionOptions")),", ",Object(c.b)("inlineCode",{parentName:"p"},"type?"),": ",Object(c.b)("inlineCode",{parentName:"p"},'"read"')," ","|"," ",Object(c.b)("inlineCode",{parentName:"p"},'"write"'),"): ",Object(c.b)("a",{parentName:"p",href:"/docs/next/api/classes/core.connection"},Object(c.b)("em",{parentName:"a"},"Connection"))),Object(c.b)("h4",{id:"parameters"},"Parameters:"),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",{parentName:"tr",align:"left"},"Name"),Object(c.b)("th",{parentName:"tr",align:"left"},"Type"),Object(c.b)("th",{parentName:"tr",align:"left"},"Default value"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},"config")),Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("a",{parentName:"td",href:"/docs/next/api/classes/core.configuration"},Object(c.b)("em",{parentName:"a"},"Configuration")),"<",Object(c.b)("a",{parentName:"td",href:"/docs/next/api/interfaces/core.idatabasedriver"},Object(c.b)("em",{parentName:"a"},"IDatabaseDriver")),"<",Object(c.b)("a",{parentName:"td",href:"/docs/next/api/classes/core.connection"},Object(c.b)("em",{parentName:"a"},"Connection")),">",">"),Object(c.b)("td",{parentName:"tr",align:"left"},"-")),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},"options?")),Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("a",{parentName:"td",href:"/docs/next/api/interfaces/core.connectionoptions"},Object(c.b)("em",{parentName:"a"},"ConnectionOptions"))),Object(c.b)("td",{parentName:"tr",align:"left"},"-")),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},"type")),Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},'"read"')," ","|"," ",Object(c.b)("inlineCode",{parentName:"td"},'"write"')),Object(c.b)("td",{parentName:"tr",align:"left"},"'write'")))),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Returns:")," ",Object(c.b)("a",{parentName:"p",href:"/docs/next/api/classes/core.connection"},Object(c.b)("em",{parentName:"a"},"Connection"))),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/f779c26/packages/core/src/connections/Connection.ts#L14"},"packages/core/src/connections/Connection.ts:14")),Object(c.b)("h2",{id:"methods"},"Methods"),Object(c.b)("h3",{id:"begin"},"begin"),Object(c.b)("p",null,"\u25b8 ",Object(c.b)("strong",{parentName:"p"},"begin"),"(",Object(c.b)("inlineCode",{parentName:"p"},"ctx?"),": ",Object(c.b)("em",{parentName:"p"},"any"),", ",Object(c.b)("inlineCode",{parentName:"p"},"eventBroadcaster?"),": ",Object(c.b)("a",{parentName:"p",href:"/docs/next/api/classes/core.transactioneventbroadcaster"},Object(c.b)("em",{parentName:"a"},"TransactionEventBroadcaster")),"): ",Object(c.b)("em",{parentName:"p"},"Promise"),"<unknown",">"),Object(c.b)("h4",{id:"parameters-1"},"Parameters:"),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",{parentName:"tr",align:"left"},"Name"),Object(c.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},"ctx?")),Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("em",{parentName:"td"},"any"))),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},"eventBroadcaster?")),Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("a",{parentName:"td",href:"/docs/next/api/classes/core.transactioneventbroadcaster"},Object(c.b)("em",{parentName:"a"},"TransactionEventBroadcaster")))))),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Returns:")," ",Object(c.b)("em",{parentName:"p"},"Promise"),"<unknown",">"),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/f779c26/packages/core/src/connections/Connection.ts#L49"},"packages/core/src/connections/Connection.ts:49")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"close"},"close"),Object(c.b)("p",null,"\u25b8 ",Object(c.b)("inlineCode",{parentName:"p"},"Abstract"),Object(c.b)("strong",{parentName:"p"},"close"),"(",Object(c.b)("inlineCode",{parentName:"p"},"force?"),": ",Object(c.b)("em",{parentName:"p"},"boolean"),"): ",Object(c.b)("em",{parentName:"p"},"Promise"),"<void",">"),Object(c.b)("p",null,"Closes the database connection (aka disconnect)"),Object(c.b)("h4",{id:"parameters-2"},"Parameters:"),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",{parentName:"tr",align:"left"},"Name"),Object(c.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},"force?")),Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("em",{parentName:"td"},"boolean"))))),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Returns:")," ",Object(c.b)("em",{parentName:"p"},"Promise"),"<void",">"),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/f779c26/packages/core/src/connections/Connection.ts#L38"},"packages/core/src/connections/Connection.ts:38")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"commit"},"commit"),Object(c.b)("p",null,"\u25b8 ",Object(c.b)("strong",{parentName:"p"},"commit"),"(",Object(c.b)("inlineCode",{parentName:"p"},"ctx"),": ",Object(c.b)("em",{parentName:"p"},"any"),", ",Object(c.b)("inlineCode",{parentName:"p"},"eventBroadcaster?"),": ",Object(c.b)("a",{parentName:"p",href:"/docs/next/api/classes/core.transactioneventbroadcaster"},Object(c.b)("em",{parentName:"a"},"TransactionEventBroadcaster")),"): ",Object(c.b)("em",{parentName:"p"},"Promise"),"<void",">"),Object(c.b)("h4",{id:"parameters-3"},"Parameters:"),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",{parentName:"tr",align:"left"},"Name"),Object(c.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},"ctx")),Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("em",{parentName:"td"},"any"))),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},"eventBroadcaster?")),Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("a",{parentName:"td",href:"/docs/next/api/classes/core.transactioneventbroadcaster"},Object(c.b)("em",{parentName:"a"},"TransactionEventBroadcaster")))))),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Returns:")," ",Object(c.b)("em",{parentName:"p"},"Promise"),"<void",">"),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/f779c26/packages/core/src/connections/Connection.ts#L53"},"packages/core/src/connections/Connection.ts:53")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"connect"},"connect"),Object(c.b)("p",null,"\u25b8 ",Object(c.b)("inlineCode",{parentName:"p"},"Abstract"),Object(c.b)("strong",{parentName:"p"},"connect"),"(): ",Object(c.b)("em",{parentName:"p"},"Promise"),"<void",">"),Object(c.b)("p",null,"Establishes connection to database"),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Returns:")," ",Object(c.b)("em",{parentName:"p"},"Promise"),"<void",">"),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/f779c26/packages/core/src/connections/Connection.ts#L28"},"packages/core/src/connections/Connection.ts:28")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"execute"},"execute"),Object(c.b)("p",null,"\u25b8 ",Object(c.b)("inlineCode",{parentName:"p"},"Abstract"),Object(c.b)("strong",{parentName:"p"},"execute"),"(",Object(c.b)("inlineCode",{parentName:"p"},"query"),": ",Object(c.b)("em",{parentName:"p"},"string"),", ",Object(c.b)("inlineCode",{parentName:"p"},"params?"),": ",Object(c.b)("em",{parentName:"p"},"any"),"[], ",Object(c.b)("inlineCode",{parentName:"p"},"method?"),": ",Object(c.b)("inlineCode",{parentName:"p"},'"all"')," ","|"," ",Object(c.b)("inlineCode",{parentName:"p"},'"get"')," ","|"," ",Object(c.b)("inlineCode",{parentName:"p"},'"run"'),", ",Object(c.b)("inlineCode",{parentName:"p"},"ctx?"),": ",Object(c.b)("em",{parentName:"p"},"any"),"): ",Object(c.b)("em",{parentName:"p"},"Promise"),"<any",">"),Object(c.b)("h4",{id:"parameters-4"},"Parameters:"),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",{parentName:"tr",align:"left"},"Name"),Object(c.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},"query")),Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("em",{parentName:"td"},"string"))),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},"params?")),Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("em",{parentName:"td"},"any"),"[]")),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},"method?")),Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},'"all"')," ","|"," ",Object(c.b)("inlineCode",{parentName:"td"},'"get"')," ","|"," ",Object(c.b)("inlineCode",{parentName:"td"},'"run"'))),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},"ctx?")),Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("em",{parentName:"td"},"any"))))),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Returns:")," ",Object(c.b)("em",{parentName:"p"},"Promise"),"<any",">"),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/f779c26/packages/core/src/connections/Connection.ts#L61"},"packages/core/src/connections/Connection.ts:61")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"getclienturl"},"getClientUrl"),Object(c.b)("p",null,"\u25b8 ",Object(c.b)("strong",{parentName:"p"},"getClientUrl"),"(): ",Object(c.b)("em",{parentName:"p"},"string")),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Returns:")," ",Object(c.b)("em",{parentName:"p"},"string")),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/f779c26/packages/core/src/connections/Connection.ts#L75"},"packages/core/src/connections/Connection.ts:75")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"getconnectionoptions"},"getConnectionOptions"),Object(c.b)("p",null,"\u25b8 ",Object(c.b)("strong",{parentName:"p"},"getConnectionOptions"),"(): ",Object(c.b)("a",{parentName:"p",href:"/docs/next/api/interfaces/core.connectionconfig"},Object(c.b)("em",{parentName:"a"},"ConnectionConfig"))),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Returns:")," ",Object(c.b)("a",{parentName:"p",href:"/docs/next/api/interfaces/core.connectionconfig"},Object(c.b)("em",{parentName:"a"},"ConnectionConfig"))),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/f779c26/packages/core/src/connections/Connection.ts#L63"},"packages/core/src/connections/Connection.ts:63")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"getdefaultclienturl"},"getDefaultClientUrl"),Object(c.b)("p",null,"\u25b8 ",Object(c.b)("inlineCode",{parentName:"p"},"Abstract"),Object(c.b)("strong",{parentName:"p"},"getDefaultClientUrl"),"(): ",Object(c.b)("em",{parentName:"p"},"string")),Object(c.b)("p",null,"Returns default client url for given driver (e.g. mongodb://127.0.0.1:27017 for mongodb)"),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Returns:")," ",Object(c.b)("em",{parentName:"p"},"string")),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/f779c26/packages/core/src/connections/Connection.ts#L43"},"packages/core/src/connections/Connection.ts:43")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"getplatform"},"getPlatform"),Object(c.b)("p",null,"\u25b8 ",Object(c.b)("strong",{parentName:"p"},"getPlatform"),"(): ",Object(c.b)("a",{parentName:"p",href:"/docs/next/api/classes/core.platform"},Object(c.b)("em",{parentName:"a"},"Platform"))),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Returns:")," ",Object(c.b)("a",{parentName:"p",href:"/docs/next/api/classes/core.platform"},Object(c.b)("em",{parentName:"a"},"Platform"))),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/f779c26/packages/core/src/connections/Connection.ts#L90"},"packages/core/src/connections/Connection.ts:90")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"isconnected"},"isConnected"),Object(c.b)("p",null,"\u25b8 ",Object(c.b)("inlineCode",{parentName:"p"},"Abstract"),Object(c.b)("strong",{parentName:"p"},"isConnected"),"(): ",Object(c.b)("em",{parentName:"p"},"Promise"),"<boolean",">"),Object(c.b)("p",null,"Are we connected to the database"),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Returns:")," ",Object(c.b)("em",{parentName:"p"},"Promise"),"<boolean",">"),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/f779c26/packages/core/src/connections/Connection.ts#L33"},"packages/core/src/connections/Connection.ts:33")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"rollback"},"rollback"),Object(c.b)("p",null,"\u25b8 ",Object(c.b)("strong",{parentName:"p"},"rollback"),"(",Object(c.b)("inlineCode",{parentName:"p"},"ctx"),": ",Object(c.b)("em",{parentName:"p"},"any"),", ",Object(c.b)("inlineCode",{parentName:"p"},"eventBroadcaster?"),": ",Object(c.b)("a",{parentName:"p",href:"/docs/next/api/classes/core.transactioneventbroadcaster"},Object(c.b)("em",{parentName:"a"},"TransactionEventBroadcaster")),"): ",Object(c.b)("em",{parentName:"p"},"Promise"),"<void",">"),Object(c.b)("h4",{id:"parameters-5"},"Parameters:"),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",{parentName:"tr",align:"left"},"Name"),Object(c.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},"ctx")),Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("em",{parentName:"td"},"any"))),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},"eventBroadcaster?")),Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("a",{parentName:"td",href:"/docs/next/api/classes/core.transactioneventbroadcaster"},Object(c.b)("em",{parentName:"a"},"TransactionEventBroadcaster")))))),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Returns:")," ",Object(c.b)("em",{parentName:"p"},"Promise"),"<void",">"),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/f779c26/packages/core/src/connections/Connection.ts#L57"},"packages/core/src/connections/Connection.ts:57")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"setmetadata"},"setMetadata"),Object(c.b)("p",null,"\u25b8 ",Object(c.b)("strong",{parentName:"p"},"setMetadata"),"(",Object(c.b)("inlineCode",{parentName:"p"},"metadata"),": ",Object(c.b)("a",{parentName:"p",href:"/docs/next/api/classes/core.metadatastorage"},Object(c.b)("em",{parentName:"a"},"MetadataStorage")),"): ",Object(c.b)("em",{parentName:"p"},"void")),Object(c.b)("h4",{id:"parameters-6"},"Parameters:"),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",{parentName:"tr",align:"left"},"Name"),Object(c.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},"metadata")),Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("a",{parentName:"td",href:"/docs/next/api/classes/core.metadatastorage"},Object(c.b)("em",{parentName:"a"},"MetadataStorage")))))),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Returns:")," ",Object(c.b)("em",{parentName:"p"},"void")),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/f779c26/packages/core/src/connections/Connection.ts#L82"},"packages/core/src/connections/Connection.ts:82")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"setplatform"},"setPlatform"),Object(c.b)("p",null,"\u25b8 ",Object(c.b)("strong",{parentName:"p"},"setPlatform"),"(",Object(c.b)("inlineCode",{parentName:"p"},"platform"),": ",Object(c.b)("a",{parentName:"p",href:"/docs/next/api/classes/core.platform"},Object(c.b)("em",{parentName:"a"},"Platform")),"): ",Object(c.b)("em",{parentName:"p"},"void")),Object(c.b)("h4",{id:"parameters-7"},"Parameters:"),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",{parentName:"tr",align:"left"},"Name"),Object(c.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},"platform")),Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("a",{parentName:"td",href:"/docs/next/api/classes/core.platform"},Object(c.b)("em",{parentName:"a"},"Platform")))))),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Returns:")," ",Object(c.b)("em",{parentName:"p"},"void")),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/f779c26/packages/core/src/connections/Connection.ts#L86"},"packages/core/src/connections/Connection.ts:86")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"transactional"},"transactional"),Object(c.b)("p",null,"\u25b8 ",Object(c.b)("strong",{parentName:"p"},"transactional"),"<T",">","(",Object(c.b)("inlineCode",{parentName:"p"},"cb"),": (",Object(c.b)("inlineCode",{parentName:"p"},"trx"),": ",Object(c.b)("em",{parentName:"p"},"any"),") => ",Object(c.b)("em",{parentName:"p"},"Promise"),"<T",">",", ",Object(c.b)("inlineCode",{parentName:"p"},"ctx?"),": ",Object(c.b)("em",{parentName:"p"},"any"),", ",Object(c.b)("inlineCode",{parentName:"p"},"eventBroadcaster?"),": ",Object(c.b)("a",{parentName:"p",href:"/docs/next/api/classes/core.transactioneventbroadcaster"},Object(c.b)("em",{parentName:"a"},"TransactionEventBroadcaster")),"): ",Object(c.b)("em",{parentName:"p"},"Promise"),"<T",">"),Object(c.b)("h4",{id:"type-parameters"},"Type parameters:"),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",{parentName:"tr",align:"left"},"Name"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},"T"))))),Object(c.b)("h4",{id:"parameters-8"},"Parameters:"),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",{parentName:"tr",align:"left"},"Name"),Object(c.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},"cb")),Object(c.b)("td",{parentName:"tr",align:"left"},"(",Object(c.b)("inlineCode",{parentName:"td"},"trx"),": ",Object(c.b)("em",{parentName:"td"},"any"),") => ",Object(c.b)("em",{parentName:"td"},"Promise"),"<T",">")),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},"ctx?")),Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("em",{parentName:"td"},"any"))),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("inlineCode",{parentName:"td"},"eventBroadcaster?")),Object(c.b)("td",{parentName:"tr",align:"left"},Object(c.b)("a",{parentName:"td",href:"/docs/next/api/classes/core.transactioneventbroadcaster"},Object(c.b)("em",{parentName:"a"},"TransactionEventBroadcaster")))))),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Returns:")," ",Object(c.b)("em",{parentName:"p"},"Promise"),"<T",">"),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/f779c26/packages/core/src/connections/Connection.ts#L45"},"packages/core/src/connections/Connection.ts:45")))}l.isMDXComponent=!0}}]);