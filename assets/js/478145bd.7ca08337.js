(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[26982],{3905:function(e,t,a){"use strict";a.d(t,{Zo:function(){return o},kt:function(){return d}});var r=a(67294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function p(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?p(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):p(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},p=Object.keys(e);for(r=0;r<p.length;r++)a=p[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var p=Object.getOwnPropertySymbols(e);for(r=0;r<p.length;r++)a=p[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var m=r.createContext({}),l=function(e){var t=r.useContext(m),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},o=function(e){var t=l(e.components);return r.createElement(m.Provider,{value:t},e.children)},k={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},c=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,p=e.originalType,m=e.parentName,o=s(e,["components","mdxType","originalType","parentName"]),c=l(a),d=n,N=c["".concat(m,".").concat(d)]||c[d]||k[d]||p;return a?r.createElement(N,i(i({ref:t},o),{},{components:a})):r.createElement(N,i({ref:t},o))}));function d(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var p=a.length,i=new Array(p);i[0]=c;var s={};for(var m in t)hasOwnProperty.call(t,m)&&(s[m]=t[m]);s.originalType=e,s.mdxType="string"==typeof e?e:n,i[1]=s;for(var l=2;l<p;l++)i[l]=a[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,a)}c.displayName="MDXCreateElement"},93346:function(e,t,a){"use strict";a.r(t),a.d(t,{frontMatter:function(){return i},contentTitle:function(){return s},metadata:function(){return m},toc:function(){return l},default:function(){return k}});var r=a(74034),n=a(79973),p=(a(67294),a(3905)),i={id:"core.eventmanager",title:"Class: EventManager",sidebar_label:"EventManager",custom_edit_url:null,hide_title:!0},s="Class: EventManager",m={unversionedId:"api/classes/core.eventmanager",id:"version-4.5/api/classes/core.eventmanager",isDocsHomePage:!1,title:"Class: EventManager",description:"core.EventManager",source:"@site/versioned_docs/version-4.5/api/classes/core.eventmanager.md",sourceDirName:"api/classes",slug:"/api/classes/core.eventmanager",permalink:"/docs/api/classes/core.eventmanager",editUrl:null,version:"4.5",lastUpdatedBy:"Martin Ad\xe1mek",lastUpdatedAt:1627914910,formattedLastUpdatedAt:"8/2/2021",frontMatter:{id:"core.eventmanager",title:"Class: EventManager",sidebar_label:"EventManager",custom_edit_url:null,hide_title:!0},sidebar:"version-4.5/API",previous:{title:"EnumArrayType",permalink:"/docs/api/classes/core.enumarraytype"},next:{title:"ExceptionConverter",permalink:"/docs/api/classes/core.exceptionconverter"}},l=[{value:"Constructors",id:"constructors",children:[{value:"constructor",id:"constructor",children:[]}]},{value:"Properties",id:"properties",children:[{value:"entities",id:"entities",children:[]},{value:"listeners",id:"listeners",children:[]}]},{value:"Methods",id:"methods",children:[{value:"dispatchEvent",id:"dispatchevent",children:[]},{value:"getSubscribedEntities",id:"getsubscribedentities",children:[]},{value:"hasListeners",id:"haslisteners",children:[]},{value:"registerSubscriber",id:"registersubscriber",children:[]}]}],o={toc:l};function k(e){var t=e.components,a=(0,n.Z)(e,["components"]);return(0,p.kt)("wrapper",(0,r.Z)({},o,a,{components:t,mdxType:"MDXLayout"}),(0,p.kt)("h1",{id:"class-eventmanager"},"Class: EventManager"),(0,p.kt)("p",null,(0,p.kt)("a",{parentName:"p",href:"/docs/api/modules/core"},"core"),".EventManager"),(0,p.kt)("h2",{id:"constructors"},"Constructors"),(0,p.kt)("h3",{id:"constructor"},"constructor"),(0,p.kt)("p",null,"+"," ",(0,p.kt)("strong",{parentName:"p"},"new EventManager"),"(",(0,p.kt)("inlineCode",{parentName:"p"},"subscribers"),": ",(0,p.kt)("a",{parentName:"p",href:"/docs/api/interfaces/core.eventsubscriber"},(0,p.kt)("em",{parentName:"a"},"EventSubscriber")),"<any",">","[]): ",(0,p.kt)("a",{parentName:"p",href:"/docs/api/classes/core.eventmanager"},(0,p.kt)("em",{parentName:"a"},"EventManager"))),(0,p.kt)("h4",{id:"parameters"},"Parameters:"),(0,p.kt)("table",null,(0,p.kt)("thead",{parentName:"table"},(0,p.kt)("tr",{parentName:"thead"},(0,p.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,p.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,p.kt)("tbody",{parentName:"table"},(0,p.kt)("tr",{parentName:"tbody"},(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("inlineCode",{parentName:"td"},"subscribers")),(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("a",{parentName:"td",href:"/docs/api/interfaces/core.eventsubscriber"},(0,p.kt)("em",{parentName:"a"},"EventSubscriber")),"<any",">","[]")))),(0,p.kt)("p",null,(0,p.kt)("strong",{parentName:"p"},"Returns:")," ",(0,p.kt)("a",{parentName:"p",href:"/docs/api/classes/core.eventmanager"},(0,p.kt)("em",{parentName:"a"},"EventManager"))),(0,p.kt)("p",null,"Defined in: ",(0,p.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/bcf1a0899b/packages/core/src/events/EventManager.ts#L9"},"packages/core/src/events/EventManager.ts:9")),(0,p.kt)("h2",{id:"properties"},"Properties"),(0,p.kt)("h3",{id:"entities"},"entities"),(0,p.kt)("p",null,"\u2022 ",(0,p.kt)("inlineCode",{parentName:"p"},"Private")," ",(0,p.kt)("inlineCode",{parentName:"p"},"Readonly")," ",(0,p.kt)("strong",{parentName:"p"},"entities"),": ",(0,p.kt)("em",{parentName:"p"},"Map"),"<",(0,p.kt)("a",{parentName:"p",href:"/docs/api/interfaces/core.eventsubscriber"},(0,p.kt)("em",{parentName:"a"},"EventSubscriber")),"<any",">",", string[]",">"),(0,p.kt)("p",null,"Defined in: ",(0,p.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/bcf1a0899b/packages/core/src/events/EventManager.ts#L9"},"packages/core/src/events/EventManager.ts:9")),(0,p.kt)("hr",null),(0,p.kt)("h3",{id:"listeners"},"listeners"),(0,p.kt)("p",null,"\u2022 ",(0,p.kt)("inlineCode",{parentName:"p"},"Private")," ",(0,p.kt)("inlineCode",{parentName:"p"},"Readonly")," ",(0,p.kt)("strong",{parentName:"p"},"listeners"),": ",(0,p.kt)("em",{parentName:"p"},"Partial"),"<Record<",(0,p.kt)("a",{parentName:"p",href:"/docs/api/enums/core.eventtype"},(0,p.kt)("em",{parentName:"a"},"EventType")),", ",(0,p.kt)("a",{parentName:"p",href:"/docs/api/interfaces/core.eventsubscriber"},(0,p.kt)("em",{parentName:"a"},"EventSubscriber")),"<any",">","[]",">",">"),(0,p.kt)("p",null,"Defined in: ",(0,p.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/bcf1a0899b/packages/core/src/events/EventManager.ts#L8"},"packages/core/src/events/EventManager.ts:8")),(0,p.kt)("h2",{id:"methods"},"Methods"),(0,p.kt)("h3",{id:"dispatchevent"},"dispatchEvent"),(0,p.kt)("p",null,"\u25b8 ",(0,p.kt)("strong",{parentName:"p"},"dispatchEvent"),"<T",">","(",(0,p.kt)("inlineCode",{parentName:"p"},"event"),": ",(0,p.kt)("a",{parentName:"p",href:"/docs/api/modules/core#transactioneventtype"},(0,p.kt)("em",{parentName:"a"},"TransactionEventType")),", ",(0,p.kt)("inlineCode",{parentName:"p"},"args"),": ",(0,p.kt)("a",{parentName:"p",href:"/docs/api/interfaces/core.transactioneventargs"},(0,p.kt)("em",{parentName:"a"},"TransactionEventArgs")),"): ",(0,p.kt)("em",{parentName:"p"},"unknown")),(0,p.kt)("h4",{id:"type-parameters"},"Type parameters:"),(0,p.kt)("table",null,(0,p.kt)("thead",{parentName:"table"},(0,p.kt)("tr",{parentName:"thead"},(0,p.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,p.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,p.kt)("tbody",{parentName:"table"},(0,p.kt)("tr",{parentName:"tbody"},(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("inlineCode",{parentName:"td"},"T")),(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("a",{parentName:"td",href:"/docs/api/modules/core#anyentity"},(0,p.kt)("em",{parentName:"a"},"AnyEntity")),"<T",">")))),(0,p.kt)("h4",{id:"parameters-1"},"Parameters:"),(0,p.kt)("table",null,(0,p.kt)("thead",{parentName:"table"},(0,p.kt)("tr",{parentName:"thead"},(0,p.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,p.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,p.kt)("tbody",{parentName:"table"},(0,p.kt)("tr",{parentName:"tbody"},(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("inlineCode",{parentName:"td"},"event")),(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("a",{parentName:"td",href:"/docs/api/modules/core#transactioneventtype"},(0,p.kt)("em",{parentName:"a"},"TransactionEventType")))),(0,p.kt)("tr",{parentName:"tbody"},(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("inlineCode",{parentName:"td"},"args")),(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("a",{parentName:"td",href:"/docs/api/interfaces/core.transactioneventargs"},(0,p.kt)("em",{parentName:"a"},"TransactionEventArgs")))))),(0,p.kt)("p",null,(0,p.kt)("strong",{parentName:"p"},"Returns:")," ",(0,p.kt)("em",{parentName:"p"},"unknown")),(0,p.kt)("p",null,"Defined in: ",(0,p.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/bcf1a0899b/packages/core/src/events/EventManager.ts#L25"},"packages/core/src/events/EventManager.ts:25")),(0,p.kt)("p",null,"\u25b8 ",(0,p.kt)("strong",{parentName:"p"},"dispatchEvent"),"<T",">","(",(0,p.kt)("inlineCode",{parentName:"p"},"event"),": ",(0,p.kt)("a",{parentName:"p",href:"/docs/api/enums/core.eventtype#oninit"},(0,p.kt)("em",{parentName:"a"},"onInit")),", ",(0,p.kt)("inlineCode",{parentName:"p"},"args"),": ",(0,p.kt)("em",{parentName:"p"},"Partial"),"<",(0,p.kt)("a",{parentName:"p",href:"/docs/api/interfaces/core.eventargs"},(0,p.kt)("em",{parentName:"a"},"EventArgs")),"<T",">",">","): ",(0,p.kt)("em",{parentName:"p"},"unknown")),(0,p.kt)("h4",{id:"type-parameters-1"},"Type parameters:"),(0,p.kt)("table",null,(0,p.kt)("thead",{parentName:"table"},(0,p.kt)("tr",{parentName:"thead"},(0,p.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,p.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,p.kt)("tbody",{parentName:"table"},(0,p.kt)("tr",{parentName:"tbody"},(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("inlineCode",{parentName:"td"},"T")),(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("a",{parentName:"td",href:"/docs/api/modules/core#anyentity"},(0,p.kt)("em",{parentName:"a"},"AnyEntity")),"<T",">")))),(0,p.kt)("h4",{id:"parameters-2"},"Parameters:"),(0,p.kt)("table",null,(0,p.kt)("thead",{parentName:"table"},(0,p.kt)("tr",{parentName:"thead"},(0,p.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,p.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,p.kt)("tbody",{parentName:"table"},(0,p.kt)("tr",{parentName:"tbody"},(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("inlineCode",{parentName:"td"},"event")),(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("a",{parentName:"td",href:"/docs/api/enums/core.eventtype#oninit"},(0,p.kt)("em",{parentName:"a"},"onInit")))),(0,p.kt)("tr",{parentName:"tbody"},(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("inlineCode",{parentName:"td"},"args")),(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("em",{parentName:"td"},"Partial"),"<",(0,p.kt)("a",{parentName:"td",href:"/docs/api/interfaces/core.eventargs"},(0,p.kt)("em",{parentName:"a"},"EventArgs")),"<T",">",">")))),(0,p.kt)("p",null,(0,p.kt)("strong",{parentName:"p"},"Returns:")," ",(0,p.kt)("em",{parentName:"p"},"unknown")),(0,p.kt)("p",null,"Defined in: ",(0,p.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/bcf1a0899b/packages/core/src/events/EventManager.ts#L26"},"packages/core/src/events/EventManager.ts:26")),(0,p.kt)("p",null,"\u25b8 ",(0,p.kt)("strong",{parentName:"p"},"dispatchEvent"),"<T",">","(",(0,p.kt)("inlineCode",{parentName:"p"},"event"),": ",(0,p.kt)("a",{parentName:"p",href:"/docs/api/enums/core.eventtype"},(0,p.kt)("em",{parentName:"a"},"EventType")),", ",(0,p.kt)("inlineCode",{parentName:"p"},"args"),": ",(0,p.kt)("em",{parentName:"p"},"Partial"),"<",(0,p.kt)("a",{parentName:"p",href:"/docs/api/interfaces/core.flusheventargs"},(0,p.kt)("em",{parentName:"a"},"FlushEventArgs"))," ","|"," ",(0,p.kt)("a",{parentName:"p",href:"/docs/api/interfaces/core.eventargs"},(0,p.kt)("em",{parentName:"a"},"EventArgs")),"<T",">",">","): ",(0,p.kt)("em",{parentName:"p"},"Promise"),"<unknown",">"),(0,p.kt)("h4",{id:"type-parameters-2"},"Type parameters:"),(0,p.kt)("table",null,(0,p.kt)("thead",{parentName:"table"},(0,p.kt)("tr",{parentName:"thead"},(0,p.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,p.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,p.kt)("tbody",{parentName:"table"},(0,p.kt)("tr",{parentName:"tbody"},(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("inlineCode",{parentName:"td"},"T")),(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("a",{parentName:"td",href:"/docs/api/modules/core#anyentity"},(0,p.kt)("em",{parentName:"a"},"AnyEntity")),"<T",">")))),(0,p.kt)("h4",{id:"parameters-3"},"Parameters:"),(0,p.kt)("table",null,(0,p.kt)("thead",{parentName:"table"},(0,p.kt)("tr",{parentName:"thead"},(0,p.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,p.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,p.kt)("tbody",{parentName:"table"},(0,p.kt)("tr",{parentName:"tbody"},(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("inlineCode",{parentName:"td"},"event")),(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("a",{parentName:"td",href:"/docs/api/enums/core.eventtype"},(0,p.kt)("em",{parentName:"a"},"EventType")))),(0,p.kt)("tr",{parentName:"tbody"},(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("inlineCode",{parentName:"td"},"args")),(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("em",{parentName:"td"},"Partial"),"<",(0,p.kt)("a",{parentName:"td",href:"/docs/api/interfaces/core.flusheventargs"},(0,p.kt)("em",{parentName:"a"},"FlushEventArgs"))," ","|"," ",(0,p.kt)("a",{parentName:"td",href:"/docs/api/interfaces/core.eventargs"},(0,p.kt)("em",{parentName:"a"},"EventArgs")),"<T",">",">")))),(0,p.kt)("p",null,(0,p.kt)("strong",{parentName:"p"},"Returns:")," ",(0,p.kt)("em",{parentName:"p"},"Promise"),"<unknown",">"),(0,p.kt)("p",null,"Defined in: ",(0,p.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/bcf1a0899b/packages/core/src/events/EventManager.ts#L27"},"packages/core/src/events/EventManager.ts:27")),(0,p.kt)("hr",null),(0,p.kt)("h3",{id:"getsubscribedentities"},"getSubscribedEntities"),(0,p.kt)("p",null,"\u25b8 ",(0,p.kt)("inlineCode",{parentName:"p"},"Private"),(0,p.kt)("strong",{parentName:"p"},"getSubscribedEntities"),"(",(0,p.kt)("inlineCode",{parentName:"p"},"listener"),": ",(0,p.kt)("a",{parentName:"p",href:"/docs/api/interfaces/core.eventsubscriber"},(0,p.kt)("em",{parentName:"a"},"EventSubscriber")),"<any",">","): ",(0,p.kt)("em",{parentName:"p"},"string"),"[]"),(0,p.kt)("h4",{id:"parameters-4"},"Parameters:"),(0,p.kt)("table",null,(0,p.kt)("thead",{parentName:"table"},(0,p.kt)("tr",{parentName:"thead"},(0,p.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,p.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,p.kt)("tbody",{parentName:"table"},(0,p.kt)("tr",{parentName:"tbody"},(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("inlineCode",{parentName:"td"},"listener")),(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("a",{parentName:"td",href:"/docs/api/interfaces/core.eventsubscriber"},(0,p.kt)("em",{parentName:"a"},"EventSubscriber")),"<any",">")))),(0,p.kt)("p",null,(0,p.kt)("strong",{parentName:"p"},"Returns:")," ",(0,p.kt)("em",{parentName:"p"},"string"),"[]"),(0,p.kt)("p",null,"Defined in: ",(0,p.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/bcf1a0899b/packages/core/src/events/EventManager.ts#L70"},"packages/core/src/events/EventManager.ts:70")),(0,p.kt)("hr",null),(0,p.kt)("h3",{id:"haslisteners"},"hasListeners"),(0,p.kt)("p",null,"\u25b8 ",(0,p.kt)("strong",{parentName:"p"},"hasListeners"),"<T",">","(",(0,p.kt)("inlineCode",{parentName:"p"},"event"),": ",(0,p.kt)("a",{parentName:"p",href:"/docs/api/enums/core.eventtype"},(0,p.kt)("em",{parentName:"a"},"EventType")),", ",(0,p.kt)("inlineCode",{parentName:"p"},"meta"),": ",(0,p.kt)("a",{parentName:"p",href:"/docs/api/classes/core.entitymetadata"},(0,p.kt)("em",{parentName:"a"},"EntityMetadata")),"<T",">","): ",(0,p.kt)("em",{parentName:"p"},"boolean")),(0,p.kt)("h4",{id:"type-parameters-3"},"Type parameters:"),(0,p.kt)("table",null,(0,p.kt)("thead",{parentName:"table"},(0,p.kt)("tr",{parentName:"thead"},(0,p.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,p.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,p.kt)("tbody",{parentName:"table"},(0,p.kt)("tr",{parentName:"tbody"},(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("inlineCode",{parentName:"td"},"T")),(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("a",{parentName:"td",href:"/docs/api/modules/core#anyentity"},(0,p.kt)("em",{parentName:"a"},"AnyEntity")),"<T",">")))),(0,p.kt)("h4",{id:"parameters-5"},"Parameters:"),(0,p.kt)("table",null,(0,p.kt)("thead",{parentName:"table"},(0,p.kt)("tr",{parentName:"thead"},(0,p.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,p.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,p.kt)("tbody",{parentName:"table"},(0,p.kt)("tr",{parentName:"tbody"},(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("inlineCode",{parentName:"td"},"event")),(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("a",{parentName:"td",href:"/docs/api/enums/core.eventtype"},(0,p.kt)("em",{parentName:"a"},"EventType")))),(0,p.kt)("tr",{parentName:"tbody"},(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("inlineCode",{parentName:"td"},"meta")),(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("a",{parentName:"td",href:"/docs/api/classes/core.entitymetadata"},(0,p.kt)("em",{parentName:"a"},"EntityMetadata")),"<T",">")))),(0,p.kt)("p",null,(0,p.kt)("strong",{parentName:"p"},"Returns:")," ",(0,p.kt)("em",{parentName:"p"},"boolean")),(0,p.kt)("p",null,"Defined in: ",(0,p.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/bcf1a0899b/packages/core/src/events/EventManager.ts#L51"},"packages/core/src/events/EventManager.ts:51")),(0,p.kt)("hr",null),(0,p.kt)("h3",{id:"registersubscriber"},"registerSubscriber"),(0,p.kt)("p",null,"\u25b8 ",(0,p.kt)("strong",{parentName:"p"},"registerSubscriber"),"(",(0,p.kt)("inlineCode",{parentName:"p"},"subscriber"),": ",(0,p.kt)("a",{parentName:"p",href:"/docs/api/interfaces/core.eventsubscriber"},(0,p.kt)("em",{parentName:"a"},"EventSubscriber")),"<any",">","): ",(0,p.kt)("em",{parentName:"p"},"void")),(0,p.kt)("h4",{id:"parameters-6"},"Parameters:"),(0,p.kt)("table",null,(0,p.kt)("thead",{parentName:"table"},(0,p.kt)("tr",{parentName:"thead"},(0,p.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,p.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,p.kt)("tbody",{parentName:"table"},(0,p.kt)("tr",{parentName:"tbody"},(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("inlineCode",{parentName:"td"},"subscriber")),(0,p.kt)("td",{parentName:"tr",align:"left"},(0,p.kt)("a",{parentName:"td",href:"/docs/api/interfaces/core.eventsubscriber"},(0,p.kt)("em",{parentName:"a"},"EventSubscriber")),"<any",">")))),(0,p.kt)("p",null,(0,p.kt)("strong",{parentName:"p"},"Returns:")," ",(0,p.kt)("em",{parentName:"p"},"void")),(0,p.kt)("p",null,"Defined in: ",(0,p.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/bcf1a0899b/packages/core/src/events/EventManager.ts#L15"},"packages/core/src/events/EventManager.ts:15")))}k.isMDXComponent=!0}}]);