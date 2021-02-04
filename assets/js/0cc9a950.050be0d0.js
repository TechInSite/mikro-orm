(window.webpackJsonp=window.webpackJsonp||[]).push([[53],{121:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return i})),t.d(n,"metadata",(function(){return a})),t.d(n,"toc",(function(){return b})),t.d(n,"default",(function(){return s}));var r=t(3),o=t(7),c=(t(0),t(1256)),i={id:"connectionconfig",title:"Interface: ConnectionConfig",sidebar_label:"ConnectionConfig"},a={unversionedId:"api/interfaces/connectionconfig",id:"version-4.3/api/interfaces/connectionconfig",isDocsHomePage:!1,title:"Interface: ConnectionConfig",description:"Hierarchy",source:"@site/versioned_docs/version-4.3/api/interfaces/connectionconfig.md",slug:"/api/interfaces/connectionconfig",permalink:"/docs/4.3/api/interfaces/connectionconfig",editUrl:"https://github.com/mikro-orm/mikro-orm/edit/master/docs/versioned_docs/version-4.3/api/interfaces/connectionconfig.md",version:"4.3",lastUpdatedBy:"Renovate Bot",lastUpdatedAt:1612397369,sidebar_label:"ConnectionConfig",sidebar:"version-4.3/API",previous:{title:"Interface: Column",permalink:"/docs/4.3/api/interfaces/column"},next:{title:"Interface: ConnectionOptions",permalink:"/docs/4.3/api/interfaces/connectionoptions"}},b=[{value:"Hierarchy",id:"hierarchy",children:[]},{value:"Properties",id:"properties",children:[{value:"database",id:"database",children:[]},{value:"host",id:"host",children:[]},{value:"password",id:"password",children:[]},{value:"port",id:"port",children:[]},{value:"user",id:"user",children:[]}]}],p={toc:b};function s(e){var n=e.components,t=Object(o.a)(e,["components"]);return Object(c.b)("wrapper",Object(r.a)({},p,t,{components:n,mdxType:"MDXLayout"}),Object(c.b)("h2",{id:"hierarchy"},"Hierarchy"),Object(c.b)("ul",null,Object(c.b)("li",{parentName:"ul"},Object(c.b)("strong",{parentName:"li"},"ConnectionConfig"))),Object(c.b)("h2",{id:"properties"},"Properties"),Object(c.b)("h3",{id:"database"},"database"),Object(c.b)("p",null,"\u2022 ",Object(c.b)("inlineCode",{parentName:"p"},"Optional")," ",Object(c.b)("strong",{parentName:"p"},"database"),": string"),Object(c.b)("p",null,Object(c.b)("em",{parentName:"p"},"Defined in ",Object(c.b)("a",Object(r.a)({parentName:"em"},{href:"https://github.com/mikro-orm/mikro-orm/blob/18b580bb42/packages/core/src/connections/Connection.ts#L137"}),"packages/core/src/connections/Connection.ts:137"))),Object(c.b)("hr",null),Object(c.b)("h3",{id:"host"},"host"),Object(c.b)("p",null,"\u2022 ",Object(c.b)("inlineCode",{parentName:"p"},"Optional")," ",Object(c.b)("strong",{parentName:"p"},"host"),": string"),Object(c.b)("p",null,Object(c.b)("em",{parentName:"p"},"Defined in ",Object(c.b)("a",Object(r.a)({parentName:"em"},{href:"https://github.com/mikro-orm/mikro-orm/blob/18b580bb42/packages/core/src/connections/Connection.ts#L133"}),"packages/core/src/connections/Connection.ts:133"))),Object(c.b)("hr",null),Object(c.b)("h3",{id:"password"},"password"),Object(c.b)("p",null,"\u2022 ",Object(c.b)("inlineCode",{parentName:"p"},"Optional")," ",Object(c.b)("strong",{parentName:"p"},"password"),": string"),Object(c.b)("p",null,Object(c.b)("em",{parentName:"p"},"Defined in ",Object(c.b)("a",Object(r.a)({parentName:"em"},{href:"https://github.com/mikro-orm/mikro-orm/blob/18b580bb42/packages/core/src/connections/Connection.ts#L136"}),"packages/core/src/connections/Connection.ts:136"))),Object(c.b)("hr",null),Object(c.b)("h3",{id:"port"},"port"),Object(c.b)("p",null,"\u2022 ",Object(c.b)("inlineCode",{parentName:"p"},"Optional")," ",Object(c.b)("strong",{parentName:"p"},"port"),": number"),Object(c.b)("p",null,Object(c.b)("em",{parentName:"p"},"Defined in ",Object(c.b)("a",Object(r.a)({parentName:"em"},{href:"https://github.com/mikro-orm/mikro-orm/blob/18b580bb42/packages/core/src/connections/Connection.ts#L134"}),"packages/core/src/connections/Connection.ts:134"))),Object(c.b)("hr",null),Object(c.b)("h3",{id:"user"},"user"),Object(c.b)("p",null,"\u2022 ",Object(c.b)("inlineCode",{parentName:"p"},"Optional")," ",Object(c.b)("strong",{parentName:"p"},"user"),": string"),Object(c.b)("p",null,Object(c.b)("em",{parentName:"p"},"Defined in ",Object(c.b)("a",Object(r.a)({parentName:"em"},{href:"https://github.com/mikro-orm/mikro-orm/blob/18b580bb42/packages/core/src/connections/Connection.ts#L135"}),"packages/core/src/connections/Connection.ts:135"))))}s.isMDXComponent=!0},1256:function(e,n,t){"use strict";t.d(n,"a",(function(){return l})),t.d(n,"b",(function(){return d}));var r=t(0),o=t.n(r);function c(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){c(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function b(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},c=Object.keys(e);for(r=0;r<c.length;r++)t=c[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(r=0;r<c.length;r++)t=c[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var p=o.a.createContext({}),s=function(e){var n=o.a.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},l=function(e){var n=s(e.components);return o.a.createElement(p.Provider,{value:n},e.children)},m={inlineCode:"code",wrapper:function(e){var n=e.children;return o.a.createElement(o.a.Fragment,{},n)}},u=o.a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,c=e.originalType,i=e.parentName,p=b(e,["components","mdxType","originalType","parentName"]),l=s(t),u=r,d=l["".concat(i,".").concat(u)]||l[u]||m[u]||c;return t?o.a.createElement(d,a(a({ref:n},p),{},{components:t})):o.a.createElement(d,a({ref:n},p))}));function d(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var c=t.length,i=new Array(c);i[0]=u;var a={};for(var b in n)hasOwnProperty.call(n,b)&&(a[b]=n[b]);a.originalType=e,a.mdxType="string"==typeof e?e:r,i[1]=a;for(var p=2;p<c;p++)i[p]=t[p];return o.a.createElement.apply(null,i)}return o.a.createElement.apply(null,t)}u.displayName="MDXCreateElement"}}]);