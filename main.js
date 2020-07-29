let sudoku = document.getElementsByClassName('sudoku');

let rows = 3;
let columns = 3;

let act_box = {
    write_in_mini_column:false,
    elem:0,
    x:0,
    y:0,
    num:0
}
let problems = {
    box:{},
    row:{}
};
add_sum_counters = () =>{
    for(let i =0; i < sudoku[0].children.length;i++){
        for(let j = 0; j < sudoku[0].children[i].children.length;j++){
            sudoku[0].children[i].children[2].children[j].innerHTML += `<div class ='mini-column watcher'></div>`;
        }
    }
    for(let i =0; i < sudoku[0].children.length;i++){
        let html = `
    <div class="mini-row">
        <div class="mini-column watcher"></div>
        <div class="mini-column watcher"></div>
        <div class="mini-column watcher"></div>
    </div>`;
        sudoku[0].children[2].children[i].innerHTML += html;
    }
}

sudoku[0].addEventListener('click',(event)=>{

    if(event.target.className.includes('mini-column')){
        act_box.write_in_mini_column = true;
        act_box.elem = event.target;
        act_box.x = event.target.dataset.father;
        act_box.y = event.target.dataset.child;
    }
    else{
        act_box.write_in_mini_column = false;
        act_box.elem = 0;
        act_box.num = 0;
    }
})

window.addEventListener('keyup',(e)=>{ 
    if(act_box.write_in_mini_column){
        act_box.elem.innerHTML = Number(e.key)/2?Number(e.key):'';
        act_box.num = Number(e.key)/2?Number(e.key):'';
        verification_in_box(act_box);
        refresh_act_info_sudoku();

        update_horizon_watcher(act_box.elem.dataset);
        update_vertical_watcher(act_box.elem.dataset);
    }
})

init = (options) =>{
    let html = ``;

    for(let i = 0; i < options.rows;i++){
        html += `<div class="row-sudoku" data-row = ${i}>`;
        for(let j = 0; j < options.columns;j++){
            html += `<div class="column-sudoku" data-row = ${i} data-column = "${j}">`;
            for(let k = 0; k < options.rows;k++){
                html += `<div class="mini-row" data-row = "${i}" data-column ="${j}" data-father = "${k}">`;
                for(let p = 0; p < options.columns;p++){
                    html += `<div class="mini-column" data-row = "${i}" data-column ="${j}" data-father = "${k}" data-child = "${p}"></div>`;
                }
                html += `</div>`;
            }
            html += `</div>`;
        }
        html += `</div>`;
    }

    sudoku[0].innerHTML += html;
    add_sum_counters();

}

init({rows:rows,columns:columns});

update_horizon_watcher = (options) =>{
    // console.log(options);
    let wather = sudoku[0].children[options.row].children[columns-1].children[options.father].children[columns];
    wather.innerHTML += Number(act_box.num);
    let sum = 0;
    for(let i =0 ; i <rows;i++){
        for(let j=0; j < columns;j++){
            let momentik = sudoku[0].children[options.row].children[i].children[options.father].children[j].innerHTML;
            sum += Number(momentik);
        }
    }
    wather.innerHTML = sum;
}
update_vertical_watcher = (options) =>{
    // console.log(options);
    let wather = sudoku[0].children[rows-1].children[options.column].children[columns].children[options.child];
    wather.innerHTML += Number(act_box.num);
    let sum = 0;
    for(let i = 0 ; i < rows;i++){
        for(let j = 0; j < columns;j++){
            let momentik = sudoku[0].children[i].children[options.column].children[j].children[options.child].innerHTML;
            sum += Number(momentik);
        }
    }
    wather.innerHTML = sum;
}

sum_of = (row,column) =>{
    // console.log(row,column);
    let elem = sudoku[0].children[row].children[column];
    let sum = 0;
    for(let i = 0; i < rows; i++){
        for(let j = 0 ; j < columns;j++){
            let momentik = elem.children[i].children[j].innerHTML;
            console.log(momentik,Number(momentik));
            sum += Number(momentik);
        }
    }
    console.log(elem,sum);
}
verification_in_box = (options) =>{
    // console.log(options);
    let warning = 0;
    for(let p in problems.box){
        if(p == `box${options.elem.dataset.row}${options.elem.dataset.column}_warn`){
            // console.log(p,"DELETE");
            problems.box[p] = {};
        }
    }
    for(let bi = 0 ; bi < rows;bi++){
        for(let bj = 0; bj < columns;bj++){
            let momentik = sudoku[0].children[options.elem.dataset.row].children[options.elem.dataset.column].children[bi].children[bj];
            for(let bk = 0; bk < rows;bk++){
                for(let bk2 = 0; bk2 < columns;bk2++){
                    let momentik_two = sudoku[0].children[options.elem.dataset.row].children[options.elem.dataset.column].children[bk].children[bk2];
                        momentik.style.color = 'black';
                        momentik_two.style.color = 'black';
                    if(momentik.innerHTML == momentik_two.innerHTML && momentik_two.innerHTML != '' && momentik.innerHTML != ''){
                        // console.log('1::',bi,bj,bk,bk2,momentik.innerHTML,momentik_two.innerHTML,momentik.innerHTML == momentik_two.innerHTML);
                        if(bi != bk || bj != bk2){
                            // console.log('2::',bi,bj,bk,bk2,momentik.innerHTML,momentik_two.innerHTML,momentik.innerHTML == momentik_two.innerHTML);
                            problems.box[`box${options.elem.dataset.row}${options.elem.dataset.column}_warn`] = {
                                num1:momentik.innerHTML,
                                num2:momentik_two.innerHTML,
                                coors:`${bi}${bj}${bk}${bk2}`,
                                elems:{
                                    el1:momentik,
                                    el2:momentik_two
                                }
                            } 
                            warning++;
                            break;
                        }
                    }
                }
            }
        }
        // console.log(problems);
    }
}
verification_in_row = () =>{
    // console.log(options);
    let warning2 = 0;
    problems.row = {};
    for(let ri0 =0; ri0 < rows; ri0++){
        for(let rj0 = 0; rj0 < columns; rj0++){
            for(let ri = 0 ; ri < rows;ri++){
                for(let rj = 0; rj < columns;rj++){
                    let momentik = sudoku[0].children[ri0].children[rj0].children[ri].children[rj];
                    momentik.style.color = 'black';
                    for(let ri1 = 1; ri1 < rows;ri1++){
                        for(let rj1 = 0; rj1 < columns;rj1++){
                            let momentik_two = sudoku[0].children[ri0].children[ri1].children[ri].children[rj1];
                            momentik_two.style.color = 'black';
                            // console.log('1::',ri0,rj0,ri,rj,momentik.innerHTML,ri0,ri1,ri,rj1,momentik_two.innerHTML,momentik.innerHTML == momentik_two.innerHTML);
                            if(momentik.innerHTML == momentik_two.innerHTML && momentik_two != '' && momentik.innerHTML != ''){
                                if(rj0 != ri1 || rj != rj1){
                                    // console.log('2::',ri0,rj0,ri,rj,momentik.innerHTML,ri0,ri1,ri,rj1,momentik_two.innerHTML,momentik.innerHTML == momentik_two.innerHTML);
                                    problems.row[`row_warn${warning2}`] = {
                                    num1:momentik.innerHTML,
                                    num2:momentik_two.innerHTML,
                                    coors:`${ri0}${rj0}${ri}${rj}_${ri0}${ri1}${ri}${rj1}`,
                                    elems:{
                                        el1:momentik,
                                        el2:momentik_two
                                    }
                                } 
                                warning2++;
                                break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    // console.log(problems.row);
}
problems_always_red = (obj) =>{
    for(let i in obj){
        for(let k in obj[i]){
            for(let z in obj[i][k].elems){
                // console.log('RED:',obj[i][k].elems[z]
                obj[i][k].elems[z].style.color = 'red';
            }
        }
    }
}
let firs_block = []
start_game = () =>{
    firs_block = [];
    // for(let r0 = 0 ; r0 < rows;r0++){
        // for(let l0 = 0 ; l0 < columns;l0++){
            let count = 0;
            let row = [];
            let arr = [1,2,3,4,5,6,7,8,9];
            for(let r1 = 0 ; r1 < rows;r1++){
                for(let l1 = 0 ; l1 < columns;l1++){
                    let curr_mini_quad = sudoku[0].children[0].children[0].children[r1].children[l1];
                    let random = (Math.floor(Math.random()*(arr.length-2)))+1;
                    curr_mini_quad.innerHTML = arr[random];
                    row.push(arr[random]);
                    arr = change_arr(arr,random);
                    
                    count++;
                    if(count%3==0){
                        firs_block.push(row);
                        row = [];
                        count = 0;
                    }
                    // console.log(arr);
                }
            }
        // }
    // }
    fill_all_sudoku();
    refresh_act_info_sudoku();
}
change_arr = (arr,item) =>{
    // console.log(arr,item);
    let new_arr = [];
    for(let i = 0; i <arr.length;i++){
        if(i == item){}
        else{new_arr.push(arr[i]);}
    }
    return new_arr;
}
fill_all_sudoku = () =>{
    for(r0 = 0; r0 < 1;r0++){
        for(l0 = 1; l0 < columns;l0++){
            for(r1 = 0; r1 < rows;r1++){
                for(l1 = 0; l1 < columns; l1++){
                    let curr_moment_quadr = sudoku[0].children[r0].children[l0].children[r1].children[l1];
                    
                        let roow = r1+l0 > firs_block.length-1?Math.abs(firs_block.length-(r1+l0)):r1+l0;
                        // console.log(roow);
                        let coll = r1+l1 > firs_block.length-1?Math.abs(firs_block.length-(r1+l1)):r1+l1;
                        curr_moment_quadr.innerHTML = firs_block[roow][coll];
                }
            }
        }
    }
}
refresh_act_info_sudoku = () =>{
    verification_in_row();
    problems_always_red(problems);
}