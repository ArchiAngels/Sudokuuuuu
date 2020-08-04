let sudoku = document.getElementsByClassName('sudoku');
let help_nums = document.getElementsByClassName('help_num');

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
    row:{},
    col:{}
};
let firs_block = [];
let global_matrix_all = [];
let first_refresh = true;

let help_ctrl_on = false;
let kkkkk = 0;

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

window.addEventListener('click',(event)=>{
    console.log(event.target);
    if(event.target.className.includes('mini-column')){
        if(help_ctrl_on){
            // console.log(event.target.dataset);
            help_to_find_solution_sudoku({row:event.target.dataset.row,column:event.target.dataset.column,num:kkkkk});
        }
        else{
            act_box.write_in_mini_column = true;
            act_box.elem = event.target;
            act_box.x = event.target.dataset.father;
            act_box.y = event.target.dataset.child;
        }
    }
    else{
        act_box.write_in_mini_column = false;
        act_box.elem = 0;
        act_box.num = 0;
    }
    if(event.target.parentElement.className.includes('help_num')){
        kkkkk = event.target.innerHTML;
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
    help_ctrl_on = false;
});
window.addEventListener('keydown',(e)=>{
    console.log(e);
    if(e.key == 'Control'){
        help_ctrl_on = true;
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
            // console.log(momentik,Number(momentik));
            sum += Number(momentik);
        }
    }
    // console.log(elem,sum);
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
                            // console.log(momentik_two);
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
Verification_in_column = () =>{
    let warning3 = 0;
    problems.col = {};
    for(let l0 = 0; l0 < columns; l0++){
        for(let r0 = 0; r0 < rows; r0++){
            for(let l1 = 0; l1 < columns; l1++){
                for(let r1 = 0; r1 < rows; r1++){
                    let curre_check_num = sudoku[0].children[r0].children[l0].children[r1].children[l1];
                    // console.log(curre_check_num);
                    for(let r2 = 1; r2 < rows; r2++){
                        for(let l2 = 0; l2 < columns; l2++){
                            let curre_check_item = sudoku[0].children[r2].children[l0].children[l2].children[l1];
                            // console.log(r2,curre_check_item);
                            if(curre_check_num.innerHTML != '' && curre_check_num.innerHTML == curre_check_item.innerHTML){
                                if(r0 != r2){
                                    problems.col[`col_warn${warning3}`] = {
                                        num1:curre_check_item.innerHTML,
                                        num2:curre_check_num.innerHTML,
                                        coors:`${r0}${l0}${r1}${l1}_${r2}${l0}${l2}${l1}`,
                                        elems:{
                                            el1:curre_check_item,
                                            el2:curre_check_num
                                        }
                                    }
                                    warning3++;
                                    // console.log('PROBLEM',warning3,curre_check_item,curre_check_num);
                                    // console.log(curre_check_item);
                                    // console.log(curre_check_item,curre_check_num);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
problems_always_red = (obj) =>{
    for(let i in obj){
        for(let k in obj[i]){
            for(let z in obj[i][k].elems){
                // console.log('RED:',obj[i][k].elems[z]
                // console.log(i);
                if(i == 'box'){
                    obj[i][k].elems[z].style.color = '#f9b107';
                }
                if(i == 'col'){
                    obj[i][k].elems[z].style.color = 'blue';
                }
                if(i == 'row'){
                    obj[i][k].elems[z].style.color = 'red';
                }
            }
        }
    }
}
start_game = () =>{
    first_refresh = true;
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
    fill_all_column();
    fill_all_row();
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
fill_all_row = () =>{
    for(let r0 = 0; r0 < rows;r0++){
        for(let l0 = 1; l0 < columns;l0++){ 
            for(let r1 = 0; r1 < rows;r1++){
                for(let l1 = 0; l1 < columns; l1++){
                    let curr_moment_quadr = sudoku[0].children[r0].children[l0].children[r1].children[l1];
                    let row_num = r1+l0;
                    let column_num = r1+l1+r0;
                    // console.log('1::',row_num,firs_block.length,row_num%firs_block.length);
                        let roow = row_num > firs_block.length-1?(row_num%firs_block.length):row_num;
                        // console.log('2::',row_num,firs_block.length,row_num%firs_block.length);
                        // console.log(l0,roow,row_num%firs_block.length);
                        let coll = column_num > firs_block.length-1?(column_num%firs_block.length):column_num;
                        // console.log(r1,l1,column_num,coll);
                        curr_moment_quadr.innerHTML = firs_block[roow][coll];
                        // console.log(firs_block,firs_block[roow][coll]);
                }
            }
        }
    }
}
fill_all_column = () =>{
    for(let l0 = 0; l0 < 1; l0++){
        for(let r0 = 1; r0 < rows; r0++){
            for(let r1 = 0; r1 < rows; r1++){
                for(let l1 = 0; l1 < columns; l1++){
                    let curr_mini_item = sudoku[0].children[r0].children[l0].children[r1].children[l1];

                    let row_num = r1;
                    let column_num = l1+r0;

                    let roow = row_num > firs_block.length-1?(row_num%firs_block.length):row_num;
                    let coll = column_num > firs_block.length-1?(column_num%firs_block.length):column_num;

                    curr_mini_item.innerHTML = firs_block[roow][coll];
                    // curr_mini_item.innerHTML = firs_block[row_num][coll];
                }
            }
        }
    }
}

refresh_act_info_sudoku = () =>{
    verification_in_row();
    Verification_in_column();
    problems_always_red(problems);
    updt_sum_oveflow();
    if(first_refresh){

        first_refresh = false;
        global_matrix_all = [];
        let mini_matrix_1_3 = [];
        let mini_matrix_1_9 = [];
        let mini_matrix_1_27 = [];
        
        for(let r0 = 0; r0 < rows; r0++){
            mini_matrix_1_3 = [];
            for(let l0 = 0; l0 < rows; l0++){
                mini_matrix_1_9 = [];
                for(let r1 = 0; r1 < rows; r1++){
                    mini_matrix_1_27 = [];
                    for(let l1 = 0; l1 < rows; l1++){
                        mini_matrix_1_27.push(sudoku[0].children[r0].children[l0].children[r1].children[l1].innerHTML);
                    }
                    mini_matrix_1_9.push(mini_matrix_1_27);
                    
                }
                mini_matrix_1_3.push(mini_matrix_1_9);
                // console.log(mini_matrix_1_3);
            }
            global_matrix_all.push(mini_matrix_1_3);
            
            
        }
        
        // console.log(global_matrix_all);
    }
}

start_sudoku_game = (how_much_save = 60) =>{
    for(let r0 = 0; r0 < rows; r0++){
        for(let l0 = 0; l0 < rows; l0++){
            for(let r1 = 0; r1 < rows; r1++){
                for(let l1 = 0; l1 < rows; l1++){
                    let curr_item = sudoku[0].children[r0].children[l0].children[r1].children[l1];
                    curr_item.innerHTML = Math.random() >= (how_much_save/100)?'':curr_item.innerHTML;
                }
            }
        } 
    }
    updt_sum_oveflow();
}
updt_sum_oveflow = ()=>{
    for(let i = 0; i < rows; i++){
        for(let b = 0; b < columns; b++){
            update_horizon_watcher({row:i,father:b});
            update_vertical_watcher({column:i,child:b});
        }
    }
}
help_to_find_solution_sudoku = (options) =>{
    // console.log(options);
    // let solution = {};
    for(let i = 0 ; i < rows; i++){
        for(let j = 0; j < columns; j++){
            if(global_matrix_all[options.row][options.column][i][j] == options.num){
                sudoku[0].children[options.row].children[options.column].children[i].children[j].innerHTML = options.num;
                break;
            }
            // solution.row = global_matrix_all[options.row][options.column][i];
            // solution.col = solution.row.indexOf(options.num+'');
        }
    }
    refresh_act_info_sudoku();
    // console.log(solution);
    // sudoku[0].children[options.row].children[options.column].children[Number(solution.row)].children[Number(solution.col)].innerHTML = options.num;
}