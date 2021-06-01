(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[53057],{3905:function(e,t,r){"use strict";r.d(t,{Zo:function(){return l},kt:function(){return f}});var n=r(67294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},c=Object.keys(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),p=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},l=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,c=e.originalType,s=e.parentName,l=o(e,["components","mdxType","originalType","parentName"]),m=p(r),f=a,d=m["".concat(s,".").concat(f)]||m[f]||u[f]||c;return r?n.createElement(d,i(i({ref:t},l),{},{components:r})):n.createElement(d,i({ref:t},l))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var c=r.length,i=new Array(c);i[0]=m;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:a,i[1]=o;for(var p=2;p<c;p++)i[p]=r[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},61189:function(e,t,r){"use strict";r.r(t),r.d(t,{frontMatter:function(){return i},metadata:function(){return o},toc:function(){return s},default:function(){return l}});var n=r(74034),a=r(79973),c=(r(67294),r(3905)),i={id:"core.eventargs",title:"Interface: EventArgs<T>",sidebar_label:"EventArgs",custom_edit_url:null},o={unversionedId:"api/interfaces/core.eventargs",id:"api/interfaces/core.eventargs",isDocsHomePage:!1,title:"Interface: EventArgs<T\\>",description:"core.EventArgs",source:"@site/docs/api/interfaces/core.eventargs.md",sourceDirName:"api/interfaces",slug:"/api/interfaces/core.eventargs",permalink:"/docs/next/api/interfaces/core.eventargs",editUrl:null,version:"current",sidebar_label:"EventArgs",frontMatter:{id:"core.eventargs",title:"Interface: EventArgs<T>",sidebar_label:"EventArgs",custom_edit_url:null},sidebar:"API",previous:{title:"Interface: EnumOptions<T\\>",permalink:"/docs/next/api/interfaces/core.enumoptions"},next:{title:"Interface: EventSubscriber<T\\>",permalink:"/docs/next/api/interfaces/core.eventsubscriber"}},s=[{value:"Type parameters",id:"type-parameters",children:[]},{value:"Properties",id:"properties",children:[{value:"changeSet",id:"changeset",children:[]},{value:"em",id:"em",children:[]},{value:"entity",id:"entity",children:[]}]}],p={toc:s};function l(e){var t=e.components,r=(0,a.Z)(e,["components"]);return(0,c.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,c.kt)("p",null,(0,c.kt)("a",{parentName:"p",href:"/docs/next/api/modules/core"},"core"),".EventArgs"),(0,c.kt)("h2",{id:"type-parameters"},"Type parameters"),(0,c.kt)("table",null,(0,c.kt)("thead",{parentName:"table"},(0,c.kt)("tr",{parentName:"thead"},(0,c.kt)("th",{parentName:"tr",align:"left"},"Name"))),(0,c.kt)("tbody",{parentName:"table"},(0,c.kt)("tr",{parentName:"tbody"},(0,c.kt)("td",{parentName:"tr",align:"left"},(0,c.kt)("inlineCode",{parentName:"td"},"T"))))),(0,c.kt)("h2",{id:"properties"},"Properties"),(0,c.kt)("h3",{id:"changeset"},"changeSet"),(0,c.kt)("p",null,"\u2022 ",(0,c.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,c.kt)("strong",{parentName:"p"},"changeSet"),": ",(0,c.kt)("a",{parentName:"p",href:"/docs/next/api/classes/core.changeset"},(0,c.kt)("em",{parentName:"a"},"ChangeSet")),"<T",">"),(0,c.kt)("p",null,"Defined in: ",(0,c.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/8c16720/packages/core/src/events/EventSubscriber.ts#L9"},"packages/core/src/events/EventSubscriber.ts:9")),(0,c.kt)("hr",null),(0,c.kt)("h3",{id:"em"},"em"),(0,c.kt)("p",null,"\u2022 ",(0,c.kt)("strong",{parentName:"p"},"em"),": ",(0,c.kt)("a",{parentName:"p",href:"/docs/next/api/classes/core.entitymanager"},(0,c.kt)("em",{parentName:"a"},"EntityManager")),"<",(0,c.kt)("a",{parentName:"p",href:"/docs/next/api/interfaces/core.idatabasedriver"},(0,c.kt)("em",{parentName:"a"},"IDatabaseDriver")),"<",(0,c.kt)("a",{parentName:"p",href:"/docs/next/api/classes/core.connection"},(0,c.kt)("em",{parentName:"a"},"Connection")),">",">"),(0,c.kt)("p",null,"Defined in: ",(0,c.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/8c16720/packages/core/src/events/EventSubscriber.ts#L8"},"packages/core/src/events/EventSubscriber.ts:8")),(0,c.kt)("hr",null),(0,c.kt)("h3",{id:"entity"},"entity"),(0,c.kt)("p",null,"\u2022 ",(0,c.kt)("strong",{parentName:"p"},"entity"),": T"),(0,c.kt)("p",null,"Defined in: ",(0,c.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/8c16720/packages/core/src/events/EventSubscriber.ts#L7"},"packages/core/src/events/EventSubscriber.ts:7")))}l.isMDXComponent=!0}}]);