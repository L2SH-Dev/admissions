import{g as h,m as g,h as Q,u as y,c as r,p as P,a as I,a9 as x,F as k,$ as G,b as J,d as K,a0 as U,f as T,ag as X,ah as Z,y as ee}from"./index-W8PNIg5p.js";import{c as te,a as E}from"./VAvatar-DBpl5UN7.js";import{l as _,j as D,f as S,m as ae,a as ne,O as ie,C as se,D as re,b as le,w as de,s as ce,R as oe,c as ue,x as fe,n as me,d as ve,P as he,E as ge,F as ye,e as be,A as pe,V as Ce,Q as xe,B as Pe}from"./VBtn-DRPATHRK.js";class C{constructor(n){let{x:t,y:a,width:s,height:i}=n;this.x=t,this.y=a,this.width=s,this.height=i}get top(){return this.y}get bottom(){return this.y+this.height}get left(){return this.x}get right(){return this.x+this.width}}function Oe(e,n){return{x:{before:Math.max(0,n.left-e.left),after:Math.max(0,e.right-n.right)},y:{before:Math.max(0,n.top-e.top),after:Math.max(0,e.bottom-n.bottom)}}}function We(e){return Array.isArray(e)?new C({x:e[0],y:e[1],width:0,height:0}):e.getBoundingClientRect()}function Le(e){const n=e.getBoundingClientRect(),t=getComputedStyle(e),a=t.transform;if(a){let s,i,l,d,c;if(a.startsWith("matrix3d("))s=a.slice(9,-1).split(/, /),i=+s[0],l=+s[5],d=+s[12],c=+s[13];else if(a.startsWith("matrix("))s=a.slice(7,-1).split(/, /),i=+s[0],l=+s[3],d=+s[4],c=+s[5];else return new C(n);const o=t.transformOrigin,u=n.x-d-(1-i)*parseFloat(o),f=n.y-c-(1-l)*parseFloat(o.slice(o.indexOf(" ")+1)),m=i?n.width/i:e.offsetWidth+1,v=l?n.height/l:e.offsetHeight+1;return new C({x:u,y:f,width:m,height:v})}else return new C(n)}function Fe(e,n,t){if(typeof e.animate>"u")return{finished:Promise.resolve()};let a;try{a=e.animate(n,t)}catch{return{finished:Promise.resolve()}}return typeof a.finished>"u"&&(a.finished=new Promise(s=>{a.onfinish=()=>{s(a)}})),a}const Me="cubic-bezier(0.4, 0, 0.2, 1)",je="cubic-bezier(0.0, 0, 0.2, 1)",He="cubic-bezier(0.4, 0, 1, 1)";function $e(e){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;for(;e;){if(n?Ve(e):B(e))return e;e=e.parentElement}return document.scrollingElement}function ze(e,n){const t=[];if(n&&e&&!n.contains(e))return t;for(;e&&(B(e)&&t.push(e),e!==n);)e=e.parentElement;return t}function B(e){if(!e||e.nodeType!==Node.ELEMENT_NODE)return!1;const n=window.getComputedStyle(e);return n.overflowY==="scroll"||n.overflowY==="auto"&&e.scrollHeight>e.clientHeight}function Ve(e){if(!e||e.nodeType!==Node.ELEMENT_NODE)return!1;const n=window.getComputedStyle(e);return["scroll","auto"].includes(n.overflowY)}const we=h()({name:"VCardActions",props:g(),setup(e,n){let{slots:t}=n;return Q({VBtn:{slim:!0,variant:"text"}}),y(()=>{var a;return r("div",{class:["v-card-actions",e.class],style:e.style},[(a=t.default)==null?void 0:a.call(t)])}),{}}}),Se=P({opacity:[Number,String],...g(),...I()},"VCardSubtitle"),Ie=h()({name:"VCardSubtitle",props:Se(),setup(e,n){let{slots:t}=n;return y(()=>r(e.tag,{class:["v-card-subtitle",e.class],style:[{"--v-card-subtitle-opacity":e.opacity},e.style]},t)),{}}}),Ae=te("v-card-title"),Re=P({appendAvatar:String,appendIcon:x,prependAvatar:String,prependIcon:x,subtitle:[String,Number],title:[String,Number],...g(),..._()},"VCardItem"),ke=h()({name:"VCardItem",props:Re(),setup(e,n){let{slots:t}=n;return y(()=>{var o;const a=!!(e.prependAvatar||e.prependIcon),s=!!(a||t.prepend),i=!!(e.appendAvatar||e.appendIcon),l=!!(i||t.append),d=!!(e.title!=null||t.title),c=!!(e.subtitle!=null||t.subtitle);return r("div",{class:["v-card-item",e.class],style:e.style},[s&&r("div",{key:"prepend",class:"v-card-item__prepend"},[t.prepend?r(S,{key:"prepend-defaults",disabled:!a,defaults:{VAvatar:{density:e.density,image:e.prependAvatar},VIcon:{density:e.density,icon:e.prependIcon}}},t.prepend):r(k,null,[e.prependAvatar&&r(E,{key:"prepend-avatar",density:e.density,image:e.prependAvatar},null),e.prependIcon&&r(D,{key:"prepend-icon",density:e.density,icon:e.prependIcon},null)])]),r("div",{class:"v-card-item__content"},[d&&r(Ae,{key:"title"},{default:()=>{var u;return[((u=t.title)==null?void 0:u.call(t))??e.title]}}),c&&r(Ie,{key:"subtitle"},{default:()=>{var u;return[((u=t.subtitle)==null?void 0:u.call(t))??e.subtitle]}}),(o=t.default)==null?void 0:o.call(t)]),l&&r("div",{key:"append",class:"v-card-item__append"},[t.append?r(S,{key:"append-defaults",disabled:!i,defaults:{VAvatar:{density:e.density,image:e.appendAvatar},VIcon:{density:e.density,icon:e.appendIcon}}},t.append):r(k,null,[e.appendIcon&&r(D,{key:"append-icon",density:e.density,icon:e.appendIcon},null),e.appendAvatar&&r(E,{key:"append-avatar",density:e.density,image:e.appendAvatar},null)])])])}),{}}}),Te=P({opacity:[Number,String],...g(),...I()},"VCardText"),Ee=h()({name:"VCardText",props:Te(),setup(e,n){let{slots:t}=n;return y(()=>r(e.tag,{class:["v-card-text",e.class],style:[{"--v-card-text-opacity":e.opacity},e.style]},t)),{}}}),De=P({appendAvatar:String,appendIcon:x,disabled:Boolean,flat:Boolean,hover:Boolean,image:String,link:{type:Boolean,default:void 0},prependAvatar:String,prependIcon:x,ripple:{type:[Boolean,Object],default:!0},subtitle:[String,Number],text:[String,Number],title:[String,Number],...ae(),...g(),..._(),...G(),...ne(),...ie(),...se(),...re(),...le(),...de(),...I(),...J(),...ce({variant:"elevated"})},"VCard"),Ye=h()({name:"VCard",directives:{Ripple:oe},props:De(),setup(e,n){let{attrs:t,slots:a}=n;const{themeClasses:s}=K(e),{borderClasses:i}=ue(e),{colorClasses:l,colorStyles:d,variantClasses:c}=fe(e),{densityClasses:o}=me(e),{dimensionStyles:u}=U(e),{elevationClasses:f}=ve(e),{loaderClasses:m}=he(e),{locationStyles:v}=ge(e),{positionClasses:N}=ye(e),{roundedClasses:O}=be(e),b=pe(e,t),W=T(()=>e.link!==!1&&b.isLink.value),p=T(()=>!e.disabled&&e.link!==!1&&(e.link||b.isClickable.value));return y(()=>{const L=W.value?"a":e.tag,F=!!(a.title||e.title!=null),M=!!(a.subtitle||e.subtitle!=null),j=F||M,H=!!(a.append||e.appendAvatar||e.appendIcon),$=!!(a.prepend||e.prependAvatar||e.prependIcon),z=!!(a.image||e.image),Y=j||$||H,q=!!(a.text||e.text!=null);return X(r(L,ee({class:["v-card",{"v-card--disabled":e.disabled,"v-card--flat":e.flat,"v-card--hover":e.hover&&!(e.disabled||e.flat),"v-card--link":p.value},s.value,i.value,l.value,o.value,f.value,m.value,N.value,O.value,c.value,e.class],style:[d.value,u.value,v.value,e.style],onClick:p.value&&b.navigate,tabindex:e.disabled?-1:void 0},b.linkProps),{default:()=>{var A;return[z&&r("div",{key:"image",class:"v-card__image"},[a.image?r(S,{key:"image-defaults",disabled:!e.image,defaults:{VImg:{cover:!0,src:e.image}}},a.image):r(Ce,{key:"image-img",cover:!0,src:e.image},null)]),r(xe,{name:"v-card",active:!!e.loading,color:typeof e.loading=="boolean"?void 0:e.loading},{default:a.loader}),Y&&r(ke,{key:"item",prependAvatar:e.prependAvatar,prependIcon:e.prependIcon,title:e.title,subtitle:e.subtitle,appendAvatar:e.appendAvatar,appendIcon:e.appendIcon},{default:a.item,prepend:a.prepend,title:a.title,subtitle:a.subtitle,append:a.append}),q&&r(Ee,{key:"text"},{default:()=>{var R;return[((R=a.text)==null?void 0:R.call(a))??e.text]}}),(A=a.default)==null?void 0:A.call(a),a.actions&&r(we,null,{default:a.actions}),Pe(p.value,"v-card")]}}),[[Z("ripple"),p.value&&e.ripple]])}),{}}}),V=Symbol("Forwarded refs");function w(e,n){let t=e;for(;t;){const a=Reflect.getOwnPropertyDescriptor(t,n);if(a)return a;t=Object.getPrototypeOf(t)}}function qe(e){for(var n=arguments.length,t=new Array(n>1?n-1:0),a=1;a<n;a++)t[a-1]=arguments[a];return e[V]=t,new Proxy(e,{get(s,i){if(Reflect.has(s,i))return Reflect.get(s,i);if(!(typeof i=="symbol"||i.startsWith("$")||i.startsWith("__"))){for(const l of t)if(l.value&&Reflect.has(l.value,i)){const d=Reflect.get(l.value,i);return typeof d=="function"?d.bind(l.value):d}}},has(s,i){if(Reflect.has(s,i))return!0;if(typeof i=="symbol"||i.startsWith("$")||i.startsWith("__"))return!1;for(const l of t)if(l.value&&Reflect.has(l.value,i))return!0;return!1},set(s,i,l){if(Reflect.has(s,i))return Reflect.set(s,i,l);if(typeof i=="symbol"||i.startsWith("$")||i.startsWith("__"))return!1;for(const d of t)if(d.value&&Reflect.has(d.value,i))return Reflect.set(d.value,i,l);return!1},getOwnPropertyDescriptor(s,i){var d;const l=Reflect.getOwnPropertyDescriptor(s,i);if(l)return l;if(!(typeof i=="symbol"||i.startsWith("$")||i.startsWith("__"))){for(const c of t){if(!c.value)continue;const o=w(c.value,i)??("_"in c.value?w((d=c.value._)==null?void 0:d.setupState,i):void 0);if(o)return o}for(const c of t){const o=c.value&&c.value[V];if(!o)continue;const u=o.slice();for(;u.length;){const f=u.shift(),m=w(f.value,i);if(m)return m;const v=f.value&&f.value[V];v&&u.push(...v)}}}}})}export{C as B,Ye as V,Ae as a,we as b,Ee as c,Ie as d,Fe as e,qe as f,je as g,He as h,We as i,ze as j,Oe as k,B as l,$e as m,Le as n,Me as s};