/*
 * @Author: HenryZheng
 * @Date: 2020-02-23 16:23:03
 * @LastEditors: HenryZheng
 * @LastEditTime: 2020-02-24 12:42:04
 * @Description: 
 */
import { createElement,render,renderDom } from './Element'
import diff from './Diff'
import patch from './Patch'



let vertualDom1 = createElement('ul',{class:'list'},[
    createElement('li',{class:'item'},['a']),
    createElement('li',{class:'item'},['b']),
    createElement('li',{class:'item'},['c']),
])
let vertualDom2 = createElement('ul',{class:'list-group'},[
    createElement('li',{class:'item'},['1']),
    createElement('li',{class:'item'},['b']),
    createElement('li',{class:'item'},['3']),
])
//用render转换VDOM1为真实dom
let el = render(vertualDom1);
//渲染真实dom
renderDom(el, window.root);

document.getElementById("button").addEventListener("click", function(){
    //调用diff算法，得到补丁包
    let patches = diff(vertualDom1,vertualDom2);
    //给元素打补丁，重新更新视图
    patch(el,patches);
});

//dom-diff是比较两个虚拟dom的区别,比较两个对象的区别
//dom-diff的作用根据两个虚拟dom创建出补丁。描述改变的内容
//将这个补丁用来更新dom