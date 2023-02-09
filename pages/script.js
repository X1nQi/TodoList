var donelist,todolist,intitle;
var list = {
    todolist: [],
    donelist: [],
}
// 初始化
init();
function init(){
    // 初始化获取节点
    donelist = document.querySelector("#donelist");
    todolist = document.querySelector("#todolist");
    intitle = document.querySelector("#intitle");

    // 输入文本后敲回车
    document.addEventListener('keyup',keyHandler);
    // 单击后修改列表
    todolist.addEventListener("change",changeHandler);
    // 删除元素
    todolist.addEventListener("click",clickHandler);
    // 修改显示input
    todolist.addEventListener("dblclick",dblclick);
    // 失去焦点后确认改变
    todolist.addEventListener("focusout",blurHandler);

    // 单击后修改列表
    donelist.addEventListener("change",changeHandler);
    // 删除元素
    donelist.addEventListener("click",clickHandler);

    // 初始化渲染
    if(localStorage.list){
        list = JSON.parse(localStorage.list);
        render();
    }
};
function dblclick(e){
    if(e.target.nodeName !=='P') return;
    // P的第一个子节点就是隐藏的输入框
    let changeInput = e.target.firstElementChild;
    changeInput.style.display="inline-block";
    changeInput.value = e.target.textContent;
    // 选中文本框中的字符串
    changeInput.setSelectionRange(0,changeInput.value.length);
    // 聚焦
    changeInput.focus();
};
function blurHandler(e){
    // Array.from()方法对一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例。
    // 通过向上寻找两级节点，对todolist的子节点进行对比，并返回索引
    let index = Array.from(todolist.children).indexOf(
        e.target.parentElement.parentElement
    );
    list.todolist[index] = e.target.value;
    render();
}
// 删除键的单击
function clickHandler(e){
    if(e.target.nodeName !== 'A') return;
    switchList(e.target,
        !e.target.parentElement.firstElementChild.checked,
        true
        );
}
// 点击复选框切换列表
function changeHandler(e){
    if(e.target.type !== "checkbox") return;
    switchList(e.target,e.target.checked);
};
function switchList(target,bool,remove){
    console.log(bool);
    // 此时的状态是已经切换过的，所以当bool为true时，代表着为todolist的项
    var arr = bool ? list.todolist : list.donelist;
    var arr1 = bool ? list.donelist : list.todolist;
    // 如果remove没有给值，target就是checkbox，删除并添加
    // 如果有值就是 a标签 只删除，不添加
    var elem = remove === undefined ? target.nextElementSibling : target.previousElementSibling;
    var index = arr.indexOf(elem.textContent);
    // splice会返回一个数组，并且改变原数组
    var del = arr.splice(index,1);
    if(remove === undefined) { arr1.push(del[0]) };
    render();
};


function keyHandler(e){
    // 如果键码不是13 或者 输入为空，直接跳过
    if(e.keyCode !== 13 || intitle.value.trim().length === 0) return;
    // 把输入内容推入todolist 的尾部
    list.todolist.push(intitle.value);
    // 清空输入框
    intitle.value = '';
    // 渲染
    render();
};
// 渲染函数
function render(){
    localStorage.list = JSON.stringify(list);
    for(let prop in list){
        window[prop].innerHTML = list[prop].reduce((value,item) => {
            return (
              value + `
                <li>
                    <input type="checkbox" ${prop === "donelist" ? "checked":''}>
                    <p style="display:inline-block">${item}<input type="text" style="display:none"></p>
                    <a href="javascript:void(0)">-</a>
                </li>
                    `  
            );
        },'');
    }
    console.log(todolist.children);
}