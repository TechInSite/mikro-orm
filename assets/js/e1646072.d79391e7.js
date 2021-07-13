(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[10419],{3905:function(e,n,t){"use strict";t.d(n,{Zo:function(){return k},kt:function(){return u}});var r=t(67294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function p(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function o(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var l=r.createContext({}),s=function(e){var n=r.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):p(p({},n),e)),t},k=function(e){var n=s(e.components);return r.createElement(l.Provider,{value:n},e.children)},m={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},c=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,a=e.originalType,l=e.parentName,k=o(e,["components","mdxType","originalType","parentName"]),c=s(t),u=i,d=c["".concat(l,".").concat(u)]||c[u]||m[u]||a;return t?r.createElement(d,p(p({ref:n},k),{},{components:t})):r.createElement(d,p({ref:n},k))}));function u(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var a=t.length,p=new Array(a);p[0]=c;var o={};for(var l in n)hasOwnProperty.call(n,l)&&(o[l]=n[l]);o.originalType=e,o.mdxType="string"==typeof e?e:i,p[1]=o;for(var s=2;s<a;s++)p[s]=t[s];return r.createElement.apply(null,p)}return r.createElement.apply(null,t)}c.displayName="MDXCreateElement"},43910:function(e,n,t){"use strict";t.r(n),t.d(n,{frontMatter:function(){return p},contentTitle:function(){return o},metadata:function(){return l},toc:function(){return s},default:function(){return m}});var r=t(74034),i=t(79973),a=(t(67294),t(3905)),p={id:"knex.column",title:"Interface: Column",sidebar_label:"Column",custom_edit_url:null},o=void 0,l={unversionedId:"api/interfaces/knex.column",id:"api/interfaces/knex.column",isDocsHomePage:!1,title:"Interface: Column",description:"knex.Column",source:"@site/docs/api/interfaces/knex.column.md",sourceDirName:"api/interfaces",slug:"/api/interfaces/knex.column",permalink:"/docs/next/api/interfaces/knex.column",editUrl:null,version:"current",frontMatter:{id:"knex.column",title:"Interface: Column",sidebar_label:"Column",custom_edit_url:null},sidebar:"API",previous:{title:"UpdateOptions",permalink:"/docs/next/api/interfaces/core.updateoptions"},next:{title:"ColumnDifference",permalink:"/docs/next/api/interfaces/knex.columndifference"}},s=[{value:"Properties",id:"properties",children:[{value:"autoincrement",id:"autoincrement",children:[]},{value:"comment",id:"comment",children:[]},{value:"default",id:"default",children:[]},{value:"enumItems",id:"enumitems",children:[]},{value:"length",id:"length",children:[]},{value:"mappedType",id:"mappedtype",children:[]},{value:"name",id:"name",children:[]},{value:"nullable",id:"nullable",children:[]},{value:"precision",id:"precision",children:[]},{value:"primary",id:"primary",children:[]},{value:"scale",id:"scale",children:[]},{value:"type",id:"type",children:[]},{value:"unique",id:"unique",children:[]},{value:"unsigned",id:"unsigned",children:[]}]}],k={toc:s};function m(e){var n=e.components,t=(0,i.Z)(e,["components"]);return(0,a.kt)("wrapper",(0,r.Z)({},k,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/docs/next/api/modules/knex"},"knex"),".Column"),(0,a.kt)("h2",{id:"properties"},"Properties"),(0,a.kt)("h3",{id:"autoincrement"},"autoincrement"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"autoincrement"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"boolean")),(0,a.kt)("h4",{id:"defined-in"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/4b497aa/packages/knex/src/typings.ts#L37"},"packages/knex/src/typings.ts:37")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"comment"},"comment"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"comment"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"string")),(0,a.kt)("h4",{id:"defined-in-1"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/4b497aa/packages/knex/src/typings.ts#L43"},"packages/knex/src/typings.ts:43")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"default"},"default"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"default"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"null")," ","|"," ",(0,a.kt)("inlineCode",{parentName:"p"},"string")),(0,a.kt)("h4",{id:"defined-in-2"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/4b497aa/packages/knex/src/typings.ts#L42"},"packages/knex/src/typings.ts:42")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"enumitems"},"enumItems"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"enumItems"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"string"),"[]"),(0,a.kt)("h4",{id:"defined-in-3"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/4b497aa/packages/knex/src/typings.ts#L44"},"packages/knex/src/typings.ts:44")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"length"},"length"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"length"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"number")),(0,a.kt)("h4",{id:"defined-in-4"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/4b497aa/packages/knex/src/typings.ts#L39"},"packages/knex/src/typings.ts:39")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"mappedtype"},"mappedType"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("strong",{parentName:"p"},"mappedType"),": ",(0,a.kt)("a",{parentName:"p",href:"/docs/next/api/classes/core.type"},(0,a.kt)("inlineCode",{parentName:"a"},"Type")),"<",(0,a.kt)("inlineCode",{parentName:"p"},"unknown"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"unknown"),">"),(0,a.kt)("h4",{id:"defined-in-5"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/4b497aa/packages/knex/src/typings.ts#L35"},"packages/knex/src/typings.ts:35")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"name"},"name"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("strong",{parentName:"p"},"name"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"string")),(0,a.kt)("h4",{id:"defined-in-6"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/4b497aa/packages/knex/src/typings.ts#L33"},"packages/knex/src/typings.ts:33")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"nullable"},"nullable"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"nullable"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"boolean")),(0,a.kt)("h4",{id:"defined-in-7"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/4b497aa/packages/knex/src/typings.ts#L38"},"packages/knex/src/typings.ts:38")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"precision"},"precision"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"precision"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"number")),(0,a.kt)("h4",{id:"defined-in-8"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/4b497aa/packages/knex/src/typings.ts#L40"},"packages/knex/src/typings.ts:40")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"primary"},"primary"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"primary"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"boolean")),(0,a.kt)("h4",{id:"defined-in-9"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/4b497aa/packages/knex/src/typings.ts#L45"},"packages/knex/src/typings.ts:45")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"scale"},"scale"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"scale"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"number")),(0,a.kt)("h4",{id:"defined-in-10"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/4b497aa/packages/knex/src/typings.ts#L41"},"packages/knex/src/typings.ts:41")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"type"},"type"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("strong",{parentName:"p"},"type"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"string")),(0,a.kt)("h4",{id:"defined-in-11"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/4b497aa/packages/knex/src/typings.ts#L34"},"packages/knex/src/typings.ts:34")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"unique"},"unique"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"unique"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"boolean")),(0,a.kt)("h4",{id:"defined-in-12"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/4b497aa/packages/knex/src/typings.ts#L46"},"packages/knex/src/typings.ts:46")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"unsigned"},"unsigned"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"unsigned"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"boolean")),(0,a.kt)("h4",{id:"defined-in-13"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/4b497aa/packages/knex/src/typings.ts#L36"},"packages/knex/src/typings.ts:36")))}m.isMDXComponent=!0}}]);